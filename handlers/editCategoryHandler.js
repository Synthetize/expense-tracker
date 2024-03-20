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
        console.log('update-category', category)
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
}

module.exports = {ipcMainEditCategoryHandler: editCategoryHandler}