window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency])
    }
})

const { contextBridge , ipcRenderer} = require('electron')
contextBridge.exposeInMainWorld('electron', {
    getYears: () => ipcRenderer.invoke('get-years'),
    getSubjects: () => ipcRenderer.invoke('get-subjects'),
    getCategories: () => ipcRenderer.invoke('get-categories'),
    getExpensesByYear: (year) => ipcRenderer.invoke('get-expenses-by-year', year),
    saveExpensesByYear: (year, expenses) => ipcRenderer.invoke('save-expenses-by-year', year, expenses),



    getNextAvailableIdByYear: (year) => ipcRenderer.invoke('get-next-available-id-by-year', year),
    newExpense: (expense, year) => ipcRenderer.invoke('new-expense', expense, year),

    openCategoryExpenseDetailsWindow: (year, category) => ipcRenderer.send('open-category-expense-details-window', year, category),
    getCategoryById: (id) => ipcRenderer.invoke('get-category-by-id', id),
    getCategoryIdByType: (type) => ipcRenderer.invoke('get-category-id-by-type', type),
    openEditCategoryWindow: () => ipcRenderer.send('open-edit-categories-window'),
    openExpenseEditWindow: (expense, year) => ipcRenderer.send('open-expense-edit-window', expense, year),
})

