const {ipcRenderer, contextBridge} = require('electron')
contextBridge.exposeInMainWorld('electron', {
    getCategoryDetailsByYear: async (year, category) => ipcRenderer.invoke('get-category-details-by-year', year, category)
})
