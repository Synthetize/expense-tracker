const {app, BrowserWindow, Menu} = require('electron')

const {createMainWindow, createConverterWindow} = require('./utils/windows')
const {mainWindowHandler} = require('./src/mainWindow/mainWindowHandler')
const {ipcMainConverterHandler} = require('./src/converter/ConverterHandler')
const {ipcMainCategoryDetailsHandler} = require('./src/categoryDetails/CategoryDetailsHandler')
const {ipcMainEditCategoryHandler} = require("./src/edit-categories/editCategoryHandler");
const {editExpenseHandler} = require("./src/editExpense/editExpenseHandler");

const menuItems = [
    {
        label: 'Window',
        submenu: [
            {
                role: 'close'
            },
            {
                role: 'minimize'
            },
        ]
    },
    {
        label: 'File',
        submenu: [
            {
                label: 'Open converter',
                click: () => {
                    createConverterWindow()
                }
            }
        ]
    }
]

const menu = Menu.buildFromTemplate(menuItems)
Menu.setApplicationMenu(menu)

app.whenReady().then(() => {
    createMainWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

mainWindowHandler()


ipcMainConverterHandler()
ipcMainCategoryDetailsHandler()
ipcMainEditCategoryHandler()
editExpenseHandler()



