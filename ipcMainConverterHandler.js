const {ipcMain, dialog} = require('electron')
const path = require('path')
const fs = require('fs')
const fs_extra = require('fs-extra')
function ipcMainConverterHandler () {
    ipcMain.handle('get-old-files-expenses', () => {
        const directory = path.join(__dirname, 'files', 'old_files')
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

    ipcMain.on('create-expense-json-file', async (event,expensesList, year) => {
        const filePath = path.join(__dirname, 'files', 'expenses', `SPESE${year}.json`)
        fs_extra.writeJson(filePath, expensesList, {spaces: 2})
    })

    ipcMain.on('open-file-dialog-for-upload', (event) => {
        dialog.showOpenDialog({
            defaultPath: path.join(__dirname,'files', 'old_files'),
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

module.exports = {ipcMainConverterHandler}