const {app, BrowserWindow, ipcMain, Menu} = require('electron')
const path = require('path')
const {ipcMainHandler} = require('./handlers/ipcMainHandler')
const {ipcMainConverterHandler} = require('./handlers/ConverterHandler')
const {ipcMainCategoryDetailsHandler} = require('./handlers/CategoryDetailsHandler')

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
                click: async () => {
                    converterWindow()
                }
            }
        ]
    }
]


const menu = Menu.buildFromTemplate(menuItems)
Menu.setApplicationMenu(menu)

const converterWindow = () => {
    const win = new BrowserWindow({
        width: 270,
        height: 150,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, './src/converter/converter-preload.js')
        }
    })
    //win.webContents.openDevTools()
    win.loadFile('./src/converter/converter.html')
}


const createWindow = () => {
    const win = new BrowserWindow({
        minHeight: 720,
        minWidth: 1100,
        webPreferences: {
            preload: path.join(__dirname,'preload.js')
        }
    })

    //win.webContents.openDevTools()
    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

ipcMainHandler()
ipcMainConverterHandler()
ipcMainCategoryDetailsHandler()



