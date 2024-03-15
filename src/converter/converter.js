const convertButton = document.getElementById('convert-button');
const openDialogButton = document.getElementById('open-dialog-button');
convertButton.addEventListener('click', () => {
    convert().then();
});

openDialogButton.addEventListener('click', () => {
    window.electron.openFileDialogForUpload();
})

async function convert() {
    const year_expenses = await window.electron.getOldFilesExpenses();
    //year_expenses is an object with the year and the expenses, a string with all the expenses concatenated
    for (const object of year_expenses) {
        let convertedExpensesToJSON = []
        for (let i = 0; i < object.expenses.length; i++) {
            const line = object.expenses.substring(0, 435).trim()
            object.expenses = object.expenses.substring(435)
            const expense = await convertToJSON(line)
            convertedExpensesToJSON.push(expense)
        }
        await window.electron.createExpenseJSONFile(convertedExpensesToJSON, object.year)
    }
}

async function convertToJSON(line) {
    const id = parseInt(line.substring(0, 8).replace(/^0+/, '')) // 8 characters for the id
    const subject = line.substring(8, 12); // 4 characters for the subject
    const date = () => {
        const date = line.substring(12, 20); // 8 characters for the date
        return `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`;
    }

    let categories = await window.electron.getCategories();

    function type() {
        const typeId = parseInt(line.substring(20, 24)); // 4 characters for the type
        let found = false;
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].id === typeId && !found) {
                found = true;
                return categories[i].type;
            }
        }
    }

    const amount = () => {
        let amount = line.substring(24, 36).replace(/^0+/, ''); // 12 characters for the amount (9 integers and 3 decimals)
        let formattedStringNumber = amount.substring(0, amount.length - 3) + '.' + amount.substring(amount.length - 3);
        return parseFloat(formattedStringNumber);
    }

    return {
        id: id,
        subject: 'Piero e Rosita',
        date: date(),
        type: type(),
        amount: amount(),
        description: line.substring(36, 435).trim() // 400 characters for the description
    }
}


