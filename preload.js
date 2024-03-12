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
    getNextIdByYear: (year) => ipcRenderer.invoke('get-next-available-id-by-year', year),
    newExpense: (expense, year) => ipcRenderer.send('new-expense', expense, year),
    newInstallment: (installments, year) => ipcRenderer.send('new-installment', installments, year)
})
