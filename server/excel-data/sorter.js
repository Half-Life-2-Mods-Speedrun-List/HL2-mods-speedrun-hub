const fs = require('node:fs');

function readFile(callback) {
    fs.readFile('Half-Life 2 Mods List - Mods.csv', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        callback(data);
    });
}


readFile((data) => {
    const rows = data.split("\n").slice(1);
    const columns = rows.map(row => row.split(","))
    
    const columnIndex = 0; // changing this number will change the csv column that the script reads

    const columnData = columns.map(row => row[columnIndex]?.trim());

    console.log(columnData) // this is the list you want to iterate into database.

    for (let row of columnData) {
        console.log(row)
    }

    
    // fs.writeFile("modNames.txt", columnData.join("\n"), (err) => {
    //     if (err) throw err;
    // })
});


