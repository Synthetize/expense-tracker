const {ipcMain, app} = require('electron')
const path = require('path')
const fs = require('fs')
const fs_extra = require('fs-extra')

let filesPath
if(app.isPackaged) {
    filesPath = path.join(process.resourcesPath, 'files')
} else {
    filesPath = path.join(__dirname, '..', 'files')

}

function editCategoryHandler() {
    ipcMain.handle('update-category', async (event, category) => {
        if(category.type === '') {
            throw new Error('La categoria non può essere vuota')
        }
        const filePath = path.join(filesPath, 'categories.json')
        let categories = await fs_extra.readJson(filePath)

        // Trova l'indice della categoria che si desidera aggiornare
        const index = categories.findIndex(cat => cat.id === parseInt(category.id));

        // Se la categoria esiste, aggiorna i suoi valori
        if (index !== -1) {
            categories[index] = category;
        }

        // Scrivi di nuovo il file JSON
        await fs_extra.writeJson(filePath, categories, {spaces: 2})
    })

    ipcMain.handle('add-new-category', async (event, category_name) => {
        let categories = await fs_extra.readJson(path.join(filesPath, 'categories.json'))
        if(category_name === '')
            return {success: false, message: 'Invalid category.'}
        for (let category of categories) {
            if (category.type === category_name) {
                return {success: false, message: 'Category already exists.'}
            }
        }
        let id = categories[categories.length - 1].id + 1
        categories.push({id: id, type: category_name})
        await fs_extra.writeJson(path.join(filesPath, 'categories.json'), categories, {spaces: 2})
        return {success: true, message: 'Category added successfully.'}

    })
}

module.exports = {ipcMainEditCategoryHandler: editCategoryHandler}