const {ipcMain, app} = require('electron')
const path = require('path')
const fs_extra = require('fs-extra')
const fs = require("fs");

let filesPath
if(app.isPackaged) {
    filesPath = path.join(process.resourcesPath, 'files')
} else {
    filesPath = path.join(__dirname, '..', 'files')

}

function categoryDetailsHandler() {
    ipcMain.handle('get-category-details-by-year', (event, year, category) => {
        console.log(year, category)
        const file = path.join(filesPath, 'expenses', `SPESE${year}.json`)
        return fs_extra.readJson(file).then(expenses => {
            return expenses.filter(expense => expense.type === category)
        }).catch(error => {
            console.error(error)
        })
    })
}

module.exports = {ipcMainCategoryDetailsHandler: categoryDetailsHandler}