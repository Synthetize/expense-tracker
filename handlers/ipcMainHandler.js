const {ipcMain, BrowserWindow, app} = require('electron')
const path = require('path')
const fs = require('fs')
const fs_extra = require('fs-extra')

let filesPath
if (app.isPackaged) {
    filesPath = path.join(process.resourcesPath, 'files')
} else {
    filesPath = path.join(__dirname, '..', 'files')

}

function ipcMainHandler() {
    ipcMain.handle('get-years', async () => {
        const directory = path.join(filesPath, 'expenses')
        const years = []
        fs.readdirSync(directory).forEach(file => {
            let year = file.match(/\d+/)[0]
            if (!years.includes(year)) years.push(year)
        })
        return years
    })

    ipcMain.handle('get-subjects', async () => {
        try {
            return await fs_extra.readJson(path.join(filesPath, 'subjects.json'))
        } catch (error) {
            console.error(error)
        }
    })

    ipcMain.handle('get-categories', async () => {
        try {
            return await fs_extra.readJson(path.join(filesPath, 'categories.json'))
        } catch (error) {
            console.error(error)
        }
    })

    ipcMain.handle('get-next-available-id-by-year', async (event, year) => {
        const directory = path.join(filesPath, 'expenses', `SPESE${year}.json`)
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
        const file = path.join(filesPath, 'expenses', `SPESE${year}.json`)
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
        const directory = path.join(filesPath, 'expenses', `SPESE${year}.json`)
        try {
            return await fs_extra.readJson(directory)
        } catch (error) {
            console.error(error)
        }
    })

    ipcMain.handle('get-category-by-id', async (event, id) => {
        const categories = await fs_extra.readJson(path.join(filesPath, 'categories.json'))
        for (let category of categories) {
            if (category.id === id) {
                return category.type
            }
        }
    })

    ipcMain.handle('get-category-id-by-type', async (event, type) => {
        const categories = await fs_extra.readJson(path.join(filesPath, 'categories.json'))
        for (let category of categories) {
            if (category.type === type) {
                return category.id
            }
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
        win.webContents.openDevTools()
        await win.loadFile(path.join(__dirname, '..', 'src', 'category-details', 'category-details.html'), {search: `?year=${year}&category=${category}`})
    })

    ipcMain.on('open-edit-categories-window', async (event) => {
        const win = new BrowserWindow({
            height: 750,
            width: 600,

            resizable: false,
            webPreferences: {
                preload: path.join(__dirname, '..', 'src', 'edit-categories', 'editCategories-preload.js'),
                nodeIntegration: false,
                contextIsolation: true,
                enableRemoteModule: false
            }
        })
        //win.webContents.openDevTools()
        await win.loadFile(path.join(__dirname, '..', 'src', 'edit-categories', 'editCategories.html'))
    })

    ipcMain.on('open-expense-edit-window', async (event, expense, year) => {
        const win = new BrowserWindow({
            height: 510,
            width: 900,
            resizable: false,
            webPreferences: {
                preload: path.join(__dirname, '..', 'src', 'edit-expense', 'editExpense-preload.js'),
                nodeIntegration: false,
                contextIsolation: true,
                enableRemoteModule: false
            }
        })
        //win.webContents.openDevTools()
        await win.loadFile(path.join(__dirname, '..', 'src', 'edit-expense', 'editExpense.html'), {search: `?expense=${JSON.stringify(expense)}&year=${year}`})
    })

}

module.exports = {ipcMainHandler}