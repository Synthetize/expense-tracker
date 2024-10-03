const { contextBridge , ipcRenderer} = require('electron')
contextBridge.exposeInMainWorld('electron', {
    getYears: () => ipcRenderer.invoke('get-years'),
    deleteYear: (year) => ipcRenderer.invoke('delete-year', year),
})
