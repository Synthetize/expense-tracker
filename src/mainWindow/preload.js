window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency])
    }
})


const {contextBridge, ipcRenderer} = require('electron')
contextBridge.exposeInMainWorld('electron', {
    getYears: () => ipcRenderer.invoke('get-years'),
    getSubjects: () => ipcRenderer.invoke('get-subjects'),
    getCategories: () => ipcRenderer.invoke('get-categories'),
    getExpensesByYear: (year) => ipcRenderer.invoke('get-expenses-by-year', year),
    saveExpensesByYear: (year, expenses) => ipcRenderer.invoke('save-expenses-by-year', year, expenses),
    openExpenseEditWindow: (expense, year) => ipcRenderer.send('open-expense-edit-window', expense, year),
    openCategoryExpenseDetailsWindow: (year, categoryId, categoryType, fromDate, toDate) => ipcRenderer.send('open-category-expense-details-window', year, categoryId, categoryType, fromDate, toDate),
    updateCategory: (category) => ipcRenderer.invoke('update-category', category),
    addNewCategory: (categoryName) => ipcRenderer.invoke('add-new-category', categoryName),
    refreshOnExpenseEdit: () => ipcRenderer.on('expense-updated', () => {
        window.location.reload();
    }),
    refreshOnExpenseDelete: () => ipcRenderer.on('expense-deleted', () => {
        window.location.reload();
    }),
    addMonths: (date, months) => ipcRenderer.invoke('add-months', date, months),
    formatDate: (date) => ipcRenderer.invoke('format-date', date),
})



