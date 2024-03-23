const {ipcMain, dialog} = require('electron')
const path = require('path')
const fs = require('fs')
const fs_extra = require('fs-extra')
const paths = require('../../utils/paths')
function converterHandler() {
    ipcMain.handle('get-old-files-expenses', () => {
        const directory = paths.oldFilesFolderPath
        const files = fs.readdirSync(directory)
        const expenses = []
        files.forEach(file => {
            expenses.push({
                year: file.match(/\d+/)[0],
                expenses: fs.readFileSync(path.join(directory, file), 'utf8')
            })
        })
        return expenses.flat()
    })

    ipcMain.on('create-expense-json-file', async (event, expensesList, year) => {
        const filePath = path.join(paths.expensesFolderPath, `SPESE${year}.json`)
        await fs_extra.writeJson(filePath, expensesList, {spaces: 2})
    })

    ipcMain.on('open-file-dialog-for-upload', (event) => {
        dialog.showOpenDialog({
            defaultPath: paths.oldFilesFolderPath,
            properties: ['openFile', 'multiSelections']
        }).then(result => {
            if (!result.canceled) {
                event.sender.send('selected-files', result.filePaths)
            }
        }).catch(err => {
            console.log(err)
        })
    })
}

module.exports = {converterHandler}