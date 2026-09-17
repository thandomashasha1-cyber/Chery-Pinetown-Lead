import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getFirestore
} from
    "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyCTsq1_N7R-vFkjShNNd37HWJc4licAIQc",
  authDomain: "chery-pinetown-leads.firebaseapp.com",
  databaseURL: "https://chery-pinetown-leads-default-rtdb.firebaseio.com",
  projectId: "chery-pinetown-leads",
  storageBucket: "chery-pinetown-leads.firebasestorage.app",
  messagingSenderId: "24141337424",
  appId: "1:24141337424:web:9442ae5c17fcc90e411255",
  measurementId: "G-7LYZE0X378"
};


const app =
    initializeApp(firebaseConfig);


const db =
    getFirestore(app);


export {
    app,
    db
};