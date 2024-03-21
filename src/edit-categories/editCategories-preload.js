const { contextBridge , ipcRenderer} = require('electron')
contextBridge.exposeInMainWorld('electron', {
    getCategories: () => ipcRenderer.invoke('get-categories'),
    updateCategory: (category) => ipcRenderer.invoke('update-category', category),
    addNewCategory: (categoryName) => ipcRenderer.invoke('add-new-category', categoryName),
})
