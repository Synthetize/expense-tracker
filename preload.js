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
    getNextAvailableIdByYear: (year) => ipcRenderer.invoke('get-next-available-id-by-year', year),
    newExpense: (expense, year) => ipcRenderer.invoke('new-expense', expense, year),
    getExpensesByYear: (year) => ipcRenderer.invoke('get-expenses-by-year', year),
    openCategoryExpenseDetailsWindow: (year, category) => ipcRenderer.send('open-category-expense-details-window', year, category),
    addNewCategory: (categoryName) => ipcRenderer.invoke('add-new-category', categoryName),
    getCategoryById: (id) => ipcRenderer.invoke('get-category-by-id', id),
    getCategoryIdByType: (type) => ipcRenderer.invoke('get-category-id-by-type', type),
})

