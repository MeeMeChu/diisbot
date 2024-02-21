import firebase from 'firebase';

const FirebaseConfig = {
    projectId: "diisbot",
    databaseURL: "https://diisbot-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

firebase.initializeApp(FirebaseConfig);
var database = firebase.database();

export default database;
