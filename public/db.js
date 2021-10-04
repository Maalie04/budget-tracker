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

function checkDatabase() {
    console.log('check db invoked');

    let transaction = db.transaction(['BudgetStore'], 'readwrite');

    const store = transaction.objectStore('BudgetStore');

    const getAll = store.getAll();

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

