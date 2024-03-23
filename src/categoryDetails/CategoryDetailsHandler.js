const {ipcMain, app} = require('electron')
const path = require('path')
const fs_extra = require('fs-extra')
const fs = require("fs");
const paths = require('../../utils/paths')
function categoryDetailsHandler() {
    ipcMain.handle('get-category-details-by-year', (event, year, categoryId) => {

        const file = path.join(paths.expensesFolderPath, `SPESE${year}.json`)
        return fs_extra.readJson(file).then(expenses => {
            return expenses.filter(expense => expense.category === parseInt(categoryId))
        }).catch(error => {
            console.error(error)
        })
    })
}

module.exports = {categoryDetailsHandler}