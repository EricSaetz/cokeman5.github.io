var db;

function createDatabase() {
	var request;
	var cards = [];
	var objectStore;
	
	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
 
	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
	window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
	 
	if (!window.indexedDB) {
	   window.alert("Your browser doesn't support a stable version of IndexedDB.")
	}
	
	request = window.indexedDB.open("cardDatabase", 1);
         
	 request.onerror = function(event) {
		console.log("error: ");
	 };
	 
	 request.onsuccess = function(event) {
		db = request.result;
		console.log("success: "+ db);
	 };
	 
	 request.onupgradeneeded = function(event) {
		db = event.target.result;
		var objectStore = db.createObjectStore("cards", {keyPath: "id"});
	 }
}

function add(card) {
   var request = db.transaction(["cards"], "readwrite")
   .objectStore("cards")
   .put(card);
   
   request.onsuccess = function(event) {
      console.log(card.name+" has been added to your database.");
   };
   
   request.onerror = function(event) {
      console.log(card.name+" exists in your database! ");
   }
}

function read() {
   var transaction = db.transaction(["employee"]);
   var objectStore = transaction.objectStore("employee");
   var request = objectStore.get("1");
   
   request.onerror = function(event) {
      console.log("Unable to retrieve daa from database!");
   };
   
   request.onsuccess = function(event) {
      if(request.result) {
         console.log(request.result);
      }
      
      else {
         console.log("couldn't be found in your database!");  
      }
   };
}