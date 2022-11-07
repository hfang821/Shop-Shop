export function pluralize(name, count) {
  if (count === 1) {
    return name
  }
  return name + 's'
}

//indexedDB is async and event driven
export function idbPromise(storeName, method, object) {
  //Promise: https://www.w3schools.com/js/js_promise.asp
  //wrap the whole thing in a promise to work with async nature
  return new Promise((resolve, reject) => {
    //open connection to the database 'shop-shop' with the version of 1
    const request = window.indexedDB.open('shop-shop', 1);

    //create variable to hold reference to the database, transaction (tx) and object store.
    let db, tx, store;

    //if version has changed (or if this is the first time using the database), run this method and create the three object stores
    //onupgradeneeded function will only run if the browser notices that the version number in the .open() method has changed since the last time, or if the browser has never connected to the database before and 1 is the new version
    request.onupgradeneeded = function(e){
      const db = request.result;
      //create object store for each type pf data and set "primary" key index to be the '_id' of the data
      db.createObjectStore('products', {keyPath:'_id'});
      db.createObjectStore('categories', {keyPath:'_id'});
      db.createObjectStore('cart', {keyPath:'_id'});
    };

    //handle any errors with connecting
    request.onerror = function(e){
      console.log('There was an error');
    };

    //on database open success
    request.onsuccess = function(e){
      //save a reference of the database to the 'db' variable
      db=request.result;
      //open a transaction do whatever we pass into 'storeName' (must match one of the object store names)
      tx = db.transaction(storeName, 'readwrite');
      //save a reference to that object store
      store = tx.objectStore(storeName);

      //if there's any errors
      db.onerror = function(e){
        console.log('error', e);
      };

      switch(method){
        case 'put':
          //overwriting any data with the matching _id value from the object and adding it if it can't find a match
          store.put(object);
          resolve(object);
          break;
        case 'get':
          //get all data from that store and return it
          const all = store.getAll();
          all.onsuccess = function(){
            resolve(all.result);
          };
          break;
        case 'delete':
          // delete that item from the object store even while offline.
          store.delete(object._id);
          break;
        default:
          console.log('invalid method');
          break;
      }

      //when the transaction is complete, close the connection
      tx.oncomplete = function(){
        db.close();
      };
    };
  })
}