const categories_select = document.getElementById('categories-select');
const input_category = document.getElementById('new-category-name');
const confirm_button = document.getElementById('confirm-button');
const error_alert = document.getElementById('error-alert');
const success_alert = document.getElementById('success-alert');
const addCategoryButton = document.getElementById('add-category-button');


success_alert.style.display = 'none';
error_alert.style.display = 'none';

function goBack() {
    window.history.back();
}


window.electron.getCategories().then(categories => {
    categories = categories.sort((a, b) => a.type.localeCompare(b.type));
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.innerText = category.type;
        categories_select.appendChild(option);
    });
    input_category.value = categories_select.options[categories_select.selectedIndex].text;
})

categories_select.addEventListener('change', () => {
    input_category.value = categories_select.options[categories_select.selectedIndex].text;
})

confirm_button.addEventListener('click', async () => {
    const category = {
        id: parseInt(categories_select.value),
        type: input_category.value
    }
    try {
        await window.electron.updateCategory(category)
        success_alert.innerText = 'Categoria aggiornata con successo';
        success_alert.style.display = 'block';
    } catch (error) {
        error_alert.style.display = 'block';
        error_alert.innerText = error.message;
        console.error(error);
    } finally {
        setTimeout(() => {
            success_alert.style.display = 'none';
            error_alert.style.display = 'none';
        }, 3000)
    }
})

addCategoryButton.addEventListener('click', (event) => {
    addCategory(event);
});

function addCategory() {
    const input = document.getElementById('category-name');
    window.electron.addNewCategory(input.value).then(result => {
        if(!result.success) {
            error_alert.style.display = 'block';
            error_alert.innerText = result.message;
        } else {

            success_alert.style.display = 'block';
            success_alert.innerText = result.message;
            input.value = '';
        }

        setTimeout(() => {
            error_alert.style.display = 'none';
            success_alert.style.display = 'none';
        }, 3000)
    })
}


