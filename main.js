const {app, BrowserWindow, Menu} = require('electron')

const {createMainWindow, createConverterWindow} = require('./utils/windows')
const {mainWindowHandler} = require('./src/mainWindow/mainWindowHandler')
const {ipcMainConverterHandler, converterHandler} = require('./src/converter/ConverterHandler')
const {ipcMainCategoryDetailsHandler, categoryDetailsHandler} = require('./src/categoryDetails/CategoryDetailsHandler')
const {ipcMainEditCategoryHandler, editCategoryHandler} = require("./src/mainWindow/editCategories/editCategoryHandler");
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
    const mainWindow = createMainWindow()

    mainWindow.on('closed', () => {
        const allWindows = BrowserWindow.getAllWindows()
        allWindows.forEach(win => {
            if (win !== mainWindow) {
                win.close()
            }
        })
    })

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

mainWindowHandler()
converterHandler()
categoryDetailsHandler()
editCategoryHandler()
editExpenseHandler()



