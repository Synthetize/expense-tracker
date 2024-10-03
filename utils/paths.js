const path = require('path')
const {app} = require("electron");


function getFilesFolderPath() {
    if (app.isPackaged) {
        return  path.join(process.resourcesPath, 'files')
    } else {
        return  path.join(__dirname, '..', 'files')
    }
}

module.exports = {
    mainWindowPath: path.join(__dirname, '..', 'src', 'mainWindow'),
    converterPath: path.join(__dirname, '..', 'src', 'converter'),
    deleteYearPath: path.join(__dirname, '..', 'src', 'deleteYear'),
    expensesFolderPath: path.join(getFilesFolderPath(), 'expenses'),
    oldFilesFolderPath: path.join(getFilesFolderPath(), 'old_files'),
    subjectsFilePath: path.join(getFilesFolderPath(), 'subjects.json'),
    categoriesFilesPath: path.join(getFilesFolderPath(), 'categories.json'),
    editExpenseFolderPath: path.join(__dirname, '..', 'src', 'editExpense'),
    categoryDetailsFolderPath: path.join(__dirname, '..', 'src', 'categoryDetails'),
    editCategoriesFolderPath: path.join(__dirname, '..', 'src', 'mainWindow', 'editCategories'),
}