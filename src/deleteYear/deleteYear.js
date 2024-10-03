const yearSelect = document.getElementById('year-options');
const deleteYearButton = document.getElementById('delete-year-button');
let yearsList = []

async function fetchData() {
    yearsList = await window.electron.getYears()
}
function populateYearsSelect(years) {
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.innerText = year;
        yearSelect.appendChild(option);
    });
    yearSelect.selectedIndex = yearSelect.options[0].index;
    yearSelect.value = yearSelect.options[yearSelect.selectedIndex].value;
}

fetchData().then(() => {
    populateYearsSelect(yearsList);
})

deleteYearButton.addEventListener('click', async () => {
    try {
        const confirm = window.confirm(`Conferma eliminazione anno: ${yearSelect.value}`);
        if (!confirm) return
        await window.electron.deleteYear(yearSelect.value)
        window.close()
    } catch (error) {
        window.alert('Errore:\n' + error.message)
    }
})