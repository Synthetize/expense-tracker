const {ipcMain} = require('electron')
const path = require('path')
const fs_extra = require('fs-extra')
const fs = require("fs");

function categoryDetailsHandler() {
    ipcMain.handle('get-category-details-by-year', (event, year, category) => {
        console.log(year, category)
        const file = path.join(__dirname, '..', 'files', 'expenses', `SPESE${year}.json`)
        return fs_extra.readJson(file).then(expenses => {
            return expenses.filter(expense => expense.type === category)
        }).catch(error => {
            console.error(error)
        })
    })
}

module.exports = {ipcMainCategoryDetailsHandler: categoryDetailsHandler}