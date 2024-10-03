const {app, BrowserWindow, Menu} = require('electron')

const {createMainWindow, createConverterWindow, createExpenseEditWindow, createDeleteYearWindow} = require('./utils/windows')
const {mainWindowHandler} = require('./src/mainWindow/mainWindowHandler')
const {converterHandler} = require('./src/converter/ConverterHandler')
const {categoryDetailsHandler} = require('./src/categoryDetails/CategoryDetailsHandler')
const {editExpenseHandler} = require("./src/editExpense/editExpenseHandler");
const {deleteYearHandler} = require("./src/deleteYear/deleteYearHandler");

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
                label: 'Convertitore',
                click: () => {
                    createConverterWindow()
                }
            },
            {
                label:"Elimina anno",
                click: () => {
                    createDeleteYearWindow()
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
editExpenseHandler()
deleteYearHandler()



