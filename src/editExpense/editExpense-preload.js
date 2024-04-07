const { contextBridge , ipcRenderer} = require('electron')
contextBridge.exposeInMainWorld('electron', {
    getSubjects: () => ipcRenderer.invoke('get-subjects'),
    getCategories: () => ipcRenderer.invoke('get-categories'),
    updateExpense: (expense, year) => ipcRenderer.invoke('update-expense-1', expense, year),
    deleteExpense: (expenseId, year) => ipcRenderer.invoke('delete-expense', expenseId, year)
})

