const indexeDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shemIndexedDB;
let db;
let budgetVersion;

// Create a new db request for the budget database
const request = indexeDB.open("Budgetdb" || 21);

request.onupgradeneeded = function (e) {
    console.log('Upgrade needed!!');

    const { oldVersion } = e;
    const newVersion = e.newVersion || db.version;

    console.log('Updated from ${oldVersion} to ${newVersion}');

    db = e.target.result;

    if(db.objectStoreNames.length === 0){
        db.createObjectStore('BudgetStore', { autoIncrement: true });
    }
};

// If the request is not successful, run this function
request.onerror = function(e){
    console.log('Somethings not right! ${e.target.errorCode}');
};

// If the request is successful, run this function
request.onsuccess = function (e) {
    console.log('success');
    db = e.target.result;

    if(navigator.onLine){
        console.log('Online!')
        checkDatabase();
    }
};


function checkDatabase() {
    console.log('check db invoked');

// Open a transaction
    let transaction = db.transaction(['BudgetStore'], 'readwrite');
// Access BudgetStore
    const store = transaction.objectStore('BudgetStore');
// Get all records from the store
    const getAll = store.getAll();
console.log(getAll);
    getAll.onsuccess = function(){
        if(getAll.result.length > 0) {
          fetch('/api/transaction/bulk', {
              method: 'POST',
              body: JSON.stringify(getAll.result),
              headers: {
                  Accept: 'application/json, text/plain, */*',
                  'Content-Type': 'application/json',
              },
          }).then((response) => response.json())
            .then((res) => {
                if(res.length !== 0){
                    transaction = db.transaction(['BudgetStore'], 'readwrite');

                    const currentStore = transaction.objectStore('BudgetStore');

                    currentStore.clear();
                    console.log('Clearing store!')
                }
            });
        }
    };
}

const saveRecord = (record) => {
    console.log('Save record invoked');

    const transaction = db.transaction(['BudgetStore'], 'readwrite');

    const store = transaction.objectStore('BudgetStore');

    store.add(record);
};

window.addEventListener('online', checkDatabase);
