let db;
const request = indexesDB.open("budgetdb",1);

request.onupgradeneeded = function (e) {
    console.log('Upgrade needed!!');
    const db = e.target.result;
    db.createObjectStore("pending", { autoIncrement: true });
};

reques.onsuccess = function (e) {
    db = e.target.result;

    if(navigator.onLine){
        checkDatabase();
    }
};