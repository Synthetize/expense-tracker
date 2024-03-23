const {ipcMain, app} = require('electron')
const path = require('path')
const fs = require('fs')
const fs_extra = require('fs-extra')
const paths = require('../../utils/paths')
function editCategoryHandler() {
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

module.exports = {editCategoryHandler}