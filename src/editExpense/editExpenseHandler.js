const {ipcMain, app} = require('electron')
const path = require('path')
const fs = require('fs')
const fs_extra = require('fs-extra')
const paths = require('../../utils/paths')
function editExpenseHandler () {
    ipcMain.handle('update-expense-1', async (event, expense, year) => {
        const filePath = path.join(paths.expensesFolderPath, `SPESE${year}.json`)
        let expenses = await fs_extra.readJson(filePath)

        // Trova l'indice della spesa che si desidera aggiornare
        const index = expenses.findIndex(exp => exp.id === parseInt(expense.id));

        // Se la spesa esiste, aggiorna i suoi valori
        if (index !== -1) {
            expenses[index] = expense;
        }

        // Scrivi di nuovo il file JSON
        await fs_extra.writeJson(filePath, expenses, {spaces: 2})
        event.sender.send('expense-updated', expense)
    })


    ipcMain.handle('delete-expense', async (event, expenseId, year) => {
        const filePath = path.join(paths.expensesFolderPath, `SPESE${parseInt(year)}.json`)
        let expenses = await fs_extra.readJson(filePath)

        // Trova l'indice della spesa che si desidera eliminare
        const index = expenses.findIndex(exp => exp.id === parseInt(expenseId));

        // Se la spesa esiste, elimina la spesa
        if (index !== -1) {
            expenses.splice(index, 1);
        }

        // Scrivi di nuovo il file JSON
        await fs_extra.writeJson(filePath, expenses, {spaces: 2})
        event.sender.send('expense-deleted', expenseId)
    })

}

module.exports = {editExpenseHandler}