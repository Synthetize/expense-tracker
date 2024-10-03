const {ipcMain, dialog} = require('electron')
const path = require('path')
const fs = require('fs')
const fs_extra = require('fs-extra')
const {expensesFolderPath, subjectsFilePath, categoriesFilesPath} = require('../../utils/paths')
const {createExpenseEditWindow, createCategoryDetailsWindow} = require('../../utils/windows')
const paths = require("../../utils/paths");

function deleteYearHandler() {
    ipcMain.handle('delete-year', async (event, year) => {
        const directory = path.join(expensesFolderPath)
        fs.unlinkSync(path.join(directory, `SPESE${parseInt(year)}.json`))
    })

}

module.exports = {deleteYearHandler}