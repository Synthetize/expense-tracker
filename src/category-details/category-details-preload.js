const {ipcRenderer, contextBridge} = require('electron')
contextBridge.exposeInMainWorld('electron', {
    getCategoryDetailsByYear: async (year, categoryId) => ipcRenderer.invoke('get-category-details-by-year', year, categoryId),
    getCategoryById: (id) => ipcRenderer.invoke('get-category-by-id', id),
})
