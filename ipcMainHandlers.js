const {ipcMain} = require('electron')
const path = require('path')
const fs = require('fs')
const fs_extra = require('fs-extra')
function ipcMainHandlers() {
    ipcMain.handle('get-years', async () => {
        const directory = path.join(__dirname, 'files', 'expenses')
        const years = []
        fs.readdirSync(directory).forEach(file => {
            let year = file.match(/\d+/)[0]
            if (!years.includes(year)) years.push(year)
        })
        return years
    })

    ipcMain.handle('get-subjects', async () => {
        try {
            return await fs_extra.readJson(path.join(__dirname, 'files', 'subjects.json'))
        } catch (error) {
            console.error(error)
        }
    })

    ipcMain.handle('get-categories', async () => {
        try {
            return await fs_extra.readJson(path.join(__dirname, 'files', 'categories.json'))
        } catch (error) {
            console.error(error)
        }
    })

    ipcMain.handle('get-next-available-id-by-year', async (event, year) => {
        const directory = path.join(__dirname, 'files', 'expenses', `SPESE${year}.json`)
        try {
            const expenses = await fs_extra.readJson(directory)
            return expenses.length === 0 ? 0 : expenses[expenses.length - 1].id + 1
        } catch (error) {
            console.error(error)
        }
    })

    ipcMain.on('new-expense', async (event, expense, year) => {
        const file = path.join(__dirname, 'files', 'expenses', `SPESE${year}.json`)
        try {
            const expenses = await fs_extra.readJson(file)
            expenses.push(expense)
            await fs_extra.writeJson(file, expenses, {spaces: 2})
        } catch (error) {
            console.error(error)
        }
    })

    ipcMain.on('new-installment', async (event, installments, year) => {
        const directory = path.join(__dirname, 'files', 'expenses', `SPESE${year}.json`)
        try {
            const expenses = await fs_extra.readJson(directory)
            installments.forEach(installment => {
                expenses.push(installment)
            })
            await fs_extra.writeJson(directory, expenses, {spaces: 2})
        } catch (error) {
            console.error(error)
        }
    })

    ipcMain.handle('get-expenses-by-year', async (event, year) => {
        const directory = path.join(__dirname, 'files', 'expenses', `SPESE${year}.json`)
        try {
            return await fs_extra.readJson(directory)
        } catch (error) {
            console.error(error)
        }
    })
}

module.exports = {ipcMainHandlers}