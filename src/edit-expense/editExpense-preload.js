const { contextBridge , ipcRenderer} = require('electron')
contextBridge.exposeInMainWorld('electron', {
    getSubjects: () => ipcRenderer.invoke('get-subjects'),
    getCategories: () => ipcRenderer.invoke('get-categories'),
    getCategoryIdByType: (type) => ipcRenderer.invoke('get-category-id-by-type', type),
    updateExpense: (expense, year) => ipcRenderer.invoke('update-expense-1', expense, year),
})

