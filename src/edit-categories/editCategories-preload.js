const { contextBridge , ipcRenderer} = require('electron')
contextBridge.exposeInMainWorld('electron', {
    getCategories: () => ipcRenderer.invoke('get-categories'),
    updateCategory: (category) => ipcRenderer.invoke('update-category', category),
})
