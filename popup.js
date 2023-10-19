// Open the database
var openDB = async () => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open("UserDataDB", 1);

    request.onerror = (event) => {
      reject(`Error opening database: ${event.target.errorCode}`);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const objectStore = db.createObjectStore("UserData", { keyPath: "id", autoIncrement: true });
      objectStore.createIndex("username", "username", { unique: false });
      objectStore.createIndex("age", "age", { unique: false });
    };
  });
};
  
  var insertData = async () => {
    const db = await openDB();
    const transaction = db.transaction(["UserData"], "readwrite");
    const objectStore = transaction.objectStore("UserData");
  
    const username = document.getElementById("username").value;
    const age = parseInt(document.getElementById("age").value);
  
    const data = { username, age };
    const request = objectStore.add(data);
  
    request.onsuccess = () => {
      console.log("Data inserted successfully!");
    };
  
    request.onerror = (event) => {
      console.error(`Error inserting data: ${event.target.error}`);
    };
  };
  
  var updateData = async () => {
    const db = await openDB();
    const transaction = db.transaction(["UserData"], "readwrite");
    const objectStore = transaction.objectStore("UserData");
  
    const username = document.getElementById("username").value;
    const age = parseInt(document.getElementById("age").value);
  
    const data = { username, age };
  
    // Get the existing record by username
    const getRequest = objectStore.index("username").get(username);
  
    getRequest.onsuccess = (event) => {
      const existingData = event.target.result;
  
      if (existingData) {
        // Update the existing record with the new data
        existingData.age = data.age;
  
        // Use put without specifying the key to update the record
        const updateRequest = objectStore.put(existingData);
  
        updateRequest.onsuccess = () => {
          console.log("Data updated successfully!");
          listData(); // Refresh the displayed list after update
        };
  
        updateRequest.onerror = (event) => {
          console.error(`Error updating data: ${event.target.error}`);
        };
      } else {
        console.error("Record not found for username:", username);
      }
    };
  
    getRequest.onerror = (event) => {
      console.error(`Error getting data for username ${username}: ${event.target.error}`);
    };
  };
  
  var deleteData = async () => {
    const db = await openDB();
  const transaction = db.transaction(["UserData"], "readwrite");
  const objectStore = transaction.objectStore("UserData");

  const request = objectStore.clear();

  request.onsuccess = () => {
    console.log("All data deleted successfully!");
    listData(); // Refresh the displayed list after deletion
  };

  request.onerror = (event) => {
    console.error(`Error deleting all data: ${event.target.error}`);
  };
  };
// Function to list all data
var listData = async () => {
  const db = await openDB();
  const transaction = db.transaction(["UserData"], "readonly");
  const objectStore = transaction.objectStore("UserData");

  const request = objectStore.getAll();

  request.onsuccess = (event) => {
    const data = event.target.result;
    displayDataAsList(data);
    console.log("List of Data:", data);
    // Display or process the data as needed
  };

  request.onerror = (event) => {
    console.error(`Error listing data: ${event.target.error}`);
  };
};

// Function to display data as an unordered list
var displayDataAsList = (data) => {
  const resultList = document.getElementById("resultList");
  resultList.innerHTML = ""; // Clear previous results

  data.forEach((entry) => {
    const listItem = document.createElement("li");
    listItem.textContent = `Username: ${entry.username}, Age: ${entry.age}`;
    resultList.appendChild(listItem);
  });
};

document.addEventListener('DOMContentLoaded', function () {
  // Button event listeners
  document.getElementById("insertBtn").addEventListener("click", insertData);
  document.getElementById("updateBtn").addEventListener("click", updateData);
  document.getElementById("deleteBtn").addEventListener("click", deleteData);
  document.getElementById("listBtn").addEventListener("click", listData);

});