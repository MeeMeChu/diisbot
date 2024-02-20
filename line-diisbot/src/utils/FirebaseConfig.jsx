import firebase from 'firebase'

const FirebaseConfig = {
    projectId: 'grey-cf4fe',
    databaseURL: "https://grey-cf4fe-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

firebase.initializeApp(FirebaseConfig);
var database = firebase.database();

export default database;
