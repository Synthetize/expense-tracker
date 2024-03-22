const { BrowserWindow } = require('electron')
const path = require('path')
const paths = require('./paths')



const createMainWindow = () => {
    const win = new BrowserWindow({
        minHeight: 720,
        minWidth: 1100,
        webPreferences: {
            preload: path.join(paths.mainWindowPath,'preload.js')
        }
    })
    win.webContents.openDevTools()
    win.loadFile(path.join(paths.mainWindowPath, 'index' ,'index.html'))
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






module.exports = {
    createMainWindow,
    createConverterWindow
}