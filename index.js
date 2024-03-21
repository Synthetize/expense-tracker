const success_alert = document.getElementById('success-alert');
const error_alert = document.getElementById('error-alert');
const addCategoryButton = document.getElementById('add-category-button');

error_alert.style.display = 'none';

addCategoryButton.addEventListener('click', (event) => {
    addCategory(event);
});



function addCategory(event) {
    const input = document.getElementById('category-name');
    window.electron.addNewCategory(input.value).then(result => {
        if(!result.success) {
            error_alert.style.display = 'block';
            error_alert.innerText = result.message;
        }

        setTimeout(() => {
            error_alert.style.display = 'none';
        }, 3000)
    })
}


function openEditCategoriesWindows() {
    window.electron.openEditCategoryWindow();
}
