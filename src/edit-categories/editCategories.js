const categories_select = document.getElementById('categories-select');
const input_category = document.getElementById('new-category-name');
const confirm_button = document.getElementById('confirm-button');
const error_alert = document.getElementById('error-alert');

error_alert.style.display = 'none';
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

categories_select.addEventListener('change', (event) => {
    input_category.value = categories_select.options[categories_select.selectedIndex].text;
})

confirm_button.addEventListener('click', async (event) => {
    const category = {
        id: parseInt(categories_select.value),
        type: input_category.value
    }
    try {
        await window.electron.updateCategory(category)
        window.close();
    } catch (error) {
        error_alert.style.display = 'block';
        error_alert.innerText = error.message;
        console.error(error);
    } finally {
        setTimeout(() => {
            error_alert.style.display = 'none';
        }, 3000)
    }
})

