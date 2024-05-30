
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    //Dados do firebase
    apiKey: "AIzaSyBeKyd7miaJii5LTToooikkMIqx2DLb7ZM",
    authDomain: "domboscopresenca.firebaseapp.com",
    databaseURL: "https://domboscopresenca-default-rtdb.firebaseio.com/",
    projectId: "domboscopresenca",
    storageBucket: "domboscopresenca.appspot.com",
    messagingSenderId: "550588007376",
    appId: "1:550588007376:web:ff5e80393b6598df652fd5",
    measurementId: "G-N2JBBN9W55"
}

const app = initializeApp(firebaseConfig);

// Configurando a persistência da autenticação
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

// Obtendo a referência do Firestore
const db = getFirestore(app);

export { auth, db };