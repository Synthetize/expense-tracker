// Add select for subjects
const select_subject = document.getElementById('expense-subject');
const installment_checkbox = document.getElementById('enable-installment');
const installment_number = document.getElementById('installment-number');
const select_categories = document.getElementById('expense-category');
const submitButton = document.getElementById('submit');
const confirmAlert = document.getElementById('confirm-alert');
const errorAlert = document.getElementById('error-alert');
const inputDate = document.getElementById('expense-date');


errorAlert.style.display = 'none';
confirmAlert.style.display = 'none';
installment_number.disabled = true;

installment_checkbox.addEventListener('change', () => {
    installment_number.disabled = !installment_checkbox.checked;
});

//get the subjects and categories from the main process and add them to the select elements
function addOptionsToSelect(selectElement, optionsData, valueKey, textKey) {
    optionsData.forEach(optionData => {
        const option = document.createElement('option');
        option.value = optionData[valueKey];
        option.innerText = optionData[textKey];
        selectElement.appendChild(option);
    });
}

window.electron.getSubjects()
    .then(subjects => addOptionsToSelect(select_subject, subjects, 'name', 'name'))
    .catch(error => {
        console.error('Failed to get subjects:', error);
        displayErrorAlert('Errore nel caricamento dei soggetti');
    })
window.electron.getCategories()
    .then(categories => {
        categories.sort((a, b) => a.type.localeCompare(b.type));
        addOptionsToSelect(select_categories, categories, 'id', 'type');
        select_categories.value = localStorage.getItem('lastSelectedCategory') || 1;
        localStorage.clear()
    })
    .catch(error => {
        console.error('Failed to get categories:', error);
        displayErrorAlert('Errore nel caricamento delle categorie');
    })

function displayErrorAlert(message) {
    errorAlert.style.display = 'block';
    errorAlert.innerText = message;
    setTimeout(() => {
        errorAlert.style.display = 'none';
    }, 3000);
}

function displaySuccessAlert(message) {
    confirmAlert.style.display = 'block';
    confirmAlert.innerText = message;
    setTimeout(() => {
        confirmAlert.style.display = 'none';
    }, 3000);
}


function goBack() {
    window.history.back();
}

function validateFields() {
    const subject = document.getElementById('expense-subject').value;
    const date = document.getElementById('expense-date').value;
    const category = document.getElementById('expense-category').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const installmentNumber = installment_checkbox.checked ? parseInt(installment_number.value) : null;

    if (!subject || !date || !category || isNaN(amount)) {
        displayErrorAlert('Campi obbligatori non compilati o valori non validi');
        return false;
    } else if (installment_checkbox.checked && (isNaN(installmentNumber) || installmentNumber < 2)) {
        displayErrorAlert('Numero di rate non valido');
        return false;
    }
    return true;
}

inputDate.addEventListener('input', function (e) {
    const dateValue = inputDate.value;
    const parts = dateValue.split('-');

        const year = parts[0];
        if (year.length > 4) {
            // Trunca l'anno a 4 cifre
            parts[0] = year.slice(1);
            inputDate.value = parts.join('-');
        }
});



submitButton.addEventListener('click', async (event) => {
    localStorage.setItem('lastSelectedCategory', select_categories.value);
    if (!validateFields()) return;
    try {
        if (installment_checkbox.checked) {
            await createInstallment();
        } else {
            await createExpense();
        }
    } catch (error) {
        console.error('Failed to create expense:', error);
        displayErrorAlert('Errore durante la creazione della spesa');
    } finally {
        document.getElementById('expense-date').value = '';
        document.getElementById('expense-amount').value = '';
        document.getElementById('expense-description').value = '';
        installment_checkbox.checked = false;
        installment_number.disabled = true;
        installment_number.value = null;
    }
})

async function createExpense() {
    const year = new Date(document.getElementById('expense-date').value).getFullYear();
    let expenses = await window.electron.getExpensesByYear(year);

    const expense = {
        id: expenses.length === 0 ? 0 : expenses[expenses.length - 1].id + 1,
        subject: document.getElementById('expense-subject').value,
        date: document.getElementById('expense-date').value,
        category: parseInt(document.getElementById('expense-category').value),
        amount: parseFloat(document.getElementById('expense-amount').value),
        description: document.getElementById('expense-description').value
    }
    expenses.push(expense);
    await window.electron.saveExpensesByYear(year, expenses);
    displaySuccessAlert('Spesa creata con successo');
}


async function createInstallment() {
    let date = new Date(document.getElementById('expense-date').value);
    let currentYear = date.getFullYear();
    let expenses = await window.electron.getExpensesByYear(currentYear);

    for (let i = 0; i < installment_number.value; i++) {
        let tempDate = await window.electron.addMonths(date, i);

        // Controlla se l'anno è cambiato
        if (tempDate.getFullYear() !== currentYear) {
            // Se l'anno è cambiato, leggi il nuovo file delle spese
            currentYear = tempDate.getFullYear();
            expenses = await window.electron.getExpensesByYear(currentYear);
        }

        const installment = {
            id: expenses.length === 0 ? 0 : expenses[expenses.length - 1].id + 1,
            subject: document.getElementById('expense-subject').value,
            date: await window.electron.formatDate(tempDate),
            category: parseInt(document.getElementById('expense-category').value),
            amount: parseFloat(document.getElementById('expense-amount').value),
            description: document.getElementById('expense-description').value +
                ` - Rata ${i + 1} di ${installment_number.value}`
        }
        expenses.push(installment);

        // Salva le spese dopo aver aggiunto l'installment
        await window.electron.saveExpensesByYear(currentYear, expenses);
    }
    displaySuccessAlert('Rate create con successo');
}