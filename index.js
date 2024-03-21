const success_alert = document.getElementById('success-alert');
const error_alert = document.getElementById('error-alert');


error_alert.style.display = 'none';



function openEditCategoriesWindows() {
    window.electron.openEditCategoryWindow();
}
