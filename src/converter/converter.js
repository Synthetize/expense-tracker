const convertButton = document.getElementById('convert-button');
const openDialogButton = document.getElementById('open-dialog-button');
convertButton.addEventListener('click', () => {
    convert().then();
});

openDialogButton.addEventListener('click', () => {
    window.electron.openFileDialogForUpload();
})

async function convert() {
    const years_expenses = await window.electron.getOldFilesExpenses();
    //years_expenses is an object with the year and the expenses, a string with all the expenses concatenated
    for (const object of years_expenses) {
        object.expenses = object.expenses.substring(436);
        let convertedExpensesToJSON = [];
        for (let i = 0; i < object.expenses.length / 436; i++) {
            let line = object.expenses.substring(i * 436, (i + 1) * 436);
            convertedExpensesToJSON.push(convertToJSON(line));
        }

        await window.electron.createExpenseJSONFile(convertedExpensesToJSON, object.year)
    }
}

function convertToJSON(line) {
    const id = parseInt(line.substring(0, 8).replace(/^0+/, '')) // 8 characters for the id
    const subject = line.substring(8, 12); // 4 characters for the subject
    const date = () => {
        const date = line.substring(12, 20); // 8 characters for the date
        return `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`;
    }

    function type() {
        const typeId = parseInt(line.substring(20, 24)); // 4 characters for the type
        if (typeId === 100) {
            return 57;
        } else if (typeId === 990) {
            return 58;
        } else {
            return typeId;
        }
    }

    const amount = () => {
        let amount = line.substring(24, 36).replace(/^0+/, ''); // 12 characters for the amount (9 integers and 3 decimals)
        if (amount[amount.length - 1] === '}') {
            amount = amount.replace('}', '0');
            return parseFloat('-' + amount.substring(0, amount.length - 3) + '.' + amount.substring(amount.length - 3));
        }
        return parseFloat(amount.substring(0, amount.length - 3) + '.' + amount.substring(amount.length - 3));

    }

    return {
        id: id,
        subject: 'Piero e Rosita',
        date: date(),
        category: type(),
        amount: amount(),
        description: line.substring(36, 435).trim() // 400 characters for the description
    }
}


