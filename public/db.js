let db;
let budgetVersion;

const request = indexesDB.open("Budgetdb" || 21);

request.onupgradeneeded = function (e) {
    console.log('Upgrade needed!!');

    const db { oldVersion } = e;
    const newVersion = e.newVersion || db.version;

    console.log('Updated from ${oldVersion} to ${newVersion}');

    db = e.target.result;

    if(db.objectStoreNames.length === 0){
        db.createObjectStore('BudgetStore', { autoIncrement: true });
    }
};

request.onerror = function(e){
    console.log('Somethings not right! ${e.target.errorCode}');
};

request.onsuccess = function (e) {
    db = e.target.result;

    if(navigator.onLine){
        checkDatabase();
    }
};