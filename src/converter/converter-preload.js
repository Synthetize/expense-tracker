const { contextBridge , ipcRenderer} = require('electron')
contextBridge.exposeInMainWorld('electron', {
    getOldFilesExpenses: () => ipcRenderer.invoke('get-old-files-expenses'),
    getCategories: () => ipcRenderer.invoke('get-categories'),
    createExpenseJSONFile: (expensesList, year) => ipcRenderer.send('create-expense-json-file', expensesList, year),
    openFileDialogForUpload: () => ipcRenderer.send('open-file-dialog-for-upload'),
})
