const {ipcMain, BrowserWindow, app} = require('electron')
const path = require('path')
const fs = require('fs')
const fs_extra = require('fs-extra')
const {expensesFolderPath, subjectsFilePath, categoriesFilesPath} = require('../../utils/paths')
const {createExpenseEditWindow, createCategoryDetailsWindow, createConverterWindow, createEditCategoriesWindow} = require('../../utils/windows')


function mainWindowHandler() {
    ipcMain.handle('get-years', async () => {
        const directory = path.join(expensesFolderPath)
        const years = []
        fs.readdirSync(directory).forEach(file => {
            let year = file.match(/\d+/)[0]
            if (!years.includes(year)) years.push(year)
        })
        return years.sort((a, b) => b - a)
    })

    ipcMain.handle('get-subjects', async () => {
        try {
            return await fs_extra.readJson(subjectsFilePath)
        } catch (error) {
            console.error(error)
        }
    })

    ipcMain.handle('get-categories', async () => {
        try {
            return await fs_extra.readJson(categoriesFilesPath)
        } catch (error) {
            console.error(error)
        }
    })

    ipcMain.handle('get-expenses-by-year', async (event, year) => {
        const file = path.join(expensesFolderPath, `SPESE${parseInt(year)}.json`)
        try {
            if(!fs.existsSync(file)) {
                return []
            }
            return await fs_extra.readJson(file)
        } catch (error) {
            console.error(error)
        }
    })

    ipcMain.handle('save-expenses-by-year', async (event, year, expenses) => {
        const file = path.join(expensesFolderPath, `SPESE${parseInt(year)}.json`)
        try {
            await fs_extra.writeJson(file, expenses, {spaces: 2})
        } catch (error) {
            console.error(error)
        }
    })

    ipcMain.on('open-expense-edit-window', (event, expense, year) => {
        createExpenseEditWindow(expense, year)
    })

    ipcMain.on('open-category-expense-details-window', (event, year, categoryId, categoryType) => {
        createCategoryDetailsWindow(year, categoryId, categoryType)
    })

    ipcMain.on('open-edit-categories-window', (event) => {
        createEditCategoriesWindow()
    })


    // ipcMain.handle('get-expenses-by-year', async (event, year) => {
    //     const directory = path.join(filesPath, 'expenses', `SPESE${year}.json`)
    //     try {
    //         return await fs_extra.readJson(directory)
    //     } catch (error) {
    //         console.error(error)
    //     }
    // })
    //
    // ipcMain.handle('get-category-by-id', async (event, id) => {
    //     const categories = await fs_extra.readJson(path.join(filesPath, 'categories.json'))
    //     for (let category of categories) {
    //         if (category.id === id) {
    //             return category.type
    //         }
    //     }
    // })
    //
    // ipcMain.handle('get-category-id-by-type', async (event, type) => {
    //     const categories = await fs_extra.readJson(path.join(filesPath, 'categories.json'))
    //     for (let category of categories) {
    //         if (category.type === type) {
    //             return category.id
    //         }
    //     }
    // })
    //

    //

    //
    // ipcMain.on('open-expense-edit-window', async (event, expense, year) => {
    //     const win = new BrowserWindow({
    //         height: 510,
    //         width: 900,
    //         resizable: false,
    //         webPreferences: {
    //             preload: path.join(__dirname, '..', 'src', 'edit-expense', 'editExpense-preload.js'),
    //             nodeIntegration: false,
    //             contextIsolation: true,
    //             enableRemoteModule: false
    //         }
    //     })
    //     //win.webContents.openDevTools()
    //     await win.loadFile(path.join(__dirname, '..', 'src', 'edit-expense', 'editExpense.html'), {search: `?expense=${JSON.stringify(expense)}&year=${year}`})
    // })

}

module.exports = {mainWindowHandler}