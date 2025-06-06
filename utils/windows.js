const {BrowserWindow} = require('electron')
const path = require('path')
const paths = require('./paths')


const createMainWindow = () => {
    const win = new BrowserWindow({
        minHeight: 720,
        minWidth: 1200,
        webPreferences: {
            preload: path.join(paths.mainWindowPath, 'preload.js')
        }
    })
    //win.webContents.openDevTools()
    win.loadFile(path.join(paths.mainWindowPath, 'index', 'index.html'))
    return win
}

const createConverterWindow = () => {
    const win = new BrowserWindow({
        width: 270,
        height: 150,
        resizable: false,
        webPreferences: {
            preload: path.join(paths.converterPath, 'converter-preload.js')
        }
    })
    win.loadFile(path.join(paths.converterPath, 'converter.html'))
}

const createDeleteYearWindow = () => {
    const win = new BrowserWindow({
        width: 250,
        height: 230,
        resizable: false,
        webPreferences: {
            preload: path.join(paths.deleteYearPath, 'deleteYear-preload.js')
        }
    })
    win.loadFile(path.join(paths.deleteYearPath, 'deleteYear.html'))
}

const createExpenseEditWindow = (expense, year) => {
    const win = new BrowserWindow({
        height: 510,
        width: 900,
        resizable: false,
        webPreferences: {
            preload: path.join(paths.editExpenseFolderPath, 'editExpense-preload.js')
        }
    })
    //win.webContents.openDevTools()
    win.loadFile(path.join(paths.editExpenseFolderPath, 'editExpense.html'),
        {search: `?year=${year}&expense=${JSON.stringify(expense)}`})
}

function createCategoryDetailsWindow(year, category, categoryType, fromDate, toDate) {
    const win = new BrowserWindow({
        minHeight: 720,
        minWidth: 1100,
        webPreferences: {
            preload: path.join(paths.categoryDetailsFolderPath, 'categoryDetails-preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false
        }
    })
    //win.webContents.openDevTools()
    win.loadFile(path.join(paths.categoryDetailsFolderPath, 'categoryDetails.html'),
        {search: `?year=${year}&categoryId=${category}&categoryType=${categoryType}&fromDate=${fromDate}&toDate=${toDate}`})
}


module.exports = {
    createMainWindow,
    createConverterWindow,
    createExpenseEditWindow,
    createCategoryDetailsWindow,
    createDeleteYearWindow
}