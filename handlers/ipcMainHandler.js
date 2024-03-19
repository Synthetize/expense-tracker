const {ipcMain, BrowserWindow} = require('electron')
const path = require('path')
const fs = require('fs')
const fs_extra = require('fs-extra')

function ipcMainHandler() {
    ipcMain.handle('get-years', async () => {
        const directory = path.join(__dirname, '..', 'files', 'expenses')
        const years = []
        fs.readdirSync(directory).forEach(file => {
            let year = file.match(/\d+/)[0]
            if (!years.includes(year)) years.push(year)
        })
        return years
    })

    ipcMain.handle('get-subjects', async () => {
        try {
            return await fs_extra.readJson(path.join(__dirname, '..', 'files', 'subjects.json'))
        } catch (error) {
            console.error(error)
        }
    })

    ipcMain.handle('get-categories', async () => {
        try {
            return await fs_extra.readJson(path.join(__dirname, '..', 'files', 'categories.json'))
        } catch (error) {
            console.error(error)
        }
    })

    ipcMain.handle('get-next-available-id-by-year', async (event, year) => {
        const directory = path.join(__dirname, '..', 'files', 'expenses', `SPESE${year}.json`)
        try {
            if (!await fs_extra.pathExists(directory))
                return 0
            else {
                const expenses = await fs_extra.readJson(directory)
                if (expenses.length === 0) {
                    return 0
                } else {
                    return expenses[expenses.length - 1].id + 1
                }
            }
        } catch (error) {
            console.error(error)
        }
    })

    ipcMain.handle('new-expense', async (event, expense, year) => {
        const file = path.join(__dirname, '..', 'files', 'expenses', `SPESE${year}.json`)
        try {
            await fs_extra.ensureFile(file);
            let expenses;
            try {
                expenses = await fs_extra.readJson(file);
            } catch (error) {
                expenses = [];
            }
            expenses.push(expense);
            await fs_extra.writeJson(file, expenses, {spaces: 2});
        } catch (error) {
            console.error(error);
        }
    })

    ipcMain.handle('get-expenses-by-year', async (event, year) => {
        const directory = path.join(__dirname, '..', 'files', 'expenses', `SPESE${year}.json`)
        try {
            return await fs_extra.readJson(directory)
        } catch (error) {
            console.error(error)
        }
    })

    ipcMain.on('open-category-expense-details-window', async (event, year, category) => {
        const win = new BrowserWindow({
            minHeight: 720,
            minWidth: 1100,
            webPreferences: {
                preload: path.join(__dirname, '..', 'src', 'category-details', 'category-details-preload.js'),
                nodeIntegration: false,
                contextIsolation: true,
                enableRemoteModule: false
            }
        })
        //win.webContents.openDevTools()
        await win.loadFile(path.join(__dirname, '..', 'src', 'category-details', 'category-details.html'), {search: `?year=${year}&category=${category}`})
    })
}

module.exports = {ipcMainHandler}