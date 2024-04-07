const {ipcMain} = require('electron')
const path = require('path')
const fs = require('fs')
const fs_extra = require('fs-extra')
const {expensesFolderPath, subjectsFilePath, categoriesFilesPath} = require('../../utils/paths')
const {createExpenseEditWindow, createCategoryDetailsWindow} = require('../../utils/windows')
const paths = require("../../utils/paths");


function mainWindowHandler() {
    ipcMain.handle('get-years', async () => {
        const directory = path.join(expensesFolderPath)
        const years = []
        fs.readdirSync(directory).forEach(file => {
            let year = file.match(/\d+/)[0]
            if (!years.includes(year)) years.push(year)
        })
        return years.sort((a, b) => b - a)
    })

    ipcMain.handle('get-subjects', async () => {
        try {
            return await fs_extra.readJson(subjectsFilePath)
        } catch (error) {
            console.error(error)
        }
    })

    ipcMain.handle('get-categories', async () => {
        try {
            return await fs_extra.readJson(categoriesFilesPath)
        } catch (error) {
            console.error(error)
        }
    })

    ipcMain.handle('get-expenses-by-year', async (event, year) => {
        const file = path.join(expensesFolderPath, `SPESE${parseInt(year)}.json`)
        try {
            if(!fs.existsSync(file)) {
                return []
            }
            return await fs_extra.readJson(file)
        } catch (error) {
            console.error(error)
        }
    })

    ipcMain.handle('save-expenses-by-year', async (event, year, expenses) => {
        const file = path.join(expensesFolderPath, `SPESE${parseInt(year)}.json`)
        try {
            await fs_extra.writeJson(file, expenses, {spaces: 2})
        } catch (error) {
            console.error(error)
        }
    })

    ipcMain.on('open-expense-edit-window', (event, expense, year) => {
        createExpenseEditWindow(expense, year)
    })

    ipcMain.on('open-category-expense-details-window', (event, year, categoryId, categoryType, fromDate, toDate) => {
        createCategoryDetailsWindow(year, categoryId, categoryType, fromDate, toDate)
    })

    ipcMain.handle('update-category', async (event, category) => {
        if(category.type === '') {
            throw new Error('La categoria non può essere vuota')
        }
        let categories = await fs_extra.readJson(paths.categoriesFilesPath)
        // Trova l'indice della categoria che si desidera aggiornare
        const index = categories.findIndex(cat => cat.id === parseInt(category.id));
        // Se la categoria esiste, aggiorna i suoi valori
        if (index !== -1) {
            categories[index] = category;
        }
        // Scrivi di nuovo il file JSON
        await fs_extra.writeJson(paths.categoriesFilesPath, categories, {spaces: 2})
    })

    ipcMain.handle('add-new-category', async (event, category_name) => {
        let categories = await fs_extra.readJson(paths.categoriesFilesPath)
        if(category_name === '')
            return {success: false, message: 'La categoria non può essere vuota.'}
        for (let category of categories) {
            if (category.type === category_name) {
                return {success: false, message: 'Categoria già esistente.'}
            }
        }
        let id = categories[categories.length - 1].id + 1
        categories.push({id: id, type: category_name})
        await fs_extra.writeJson(paths.categoriesFilesPath, categories, {spaces: 2})
        return {success: true, message: 'Categoria aggiunta con successo!'}
    })
}

module.exports = {mainWindowHandler}