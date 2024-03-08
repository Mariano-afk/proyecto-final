import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, Timestamp, getDoc, updateDoc } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();

let userData = {
    id: '',
    email: null,
    displayName: null,
    rol: null,
    foto: null,
    portada: null,
    bio: null,
};

let observers = [];

// Función para notificar a todos los observadores sobre el cambio en los datos del usuario
function notifyAll() {
    observers.forEach(obs => obs(userData));
}

// Función para suscribir un observador al cambio en los datos del usuario
export function authStateSubscribe(observerCallback) {
    // Agrega el observador a la lista de observadores
    observers.push(observerCallback);
    
    // Notifica al observador sobre el estado actual de autenticación
    observerCallback(userData);

    // Devuelve una función para cancelar la suscripción del observador
    return () => {
        observers = observers.filter(callback => callback !== observerCallback);
    }
}

// Función para actualizar el estado de autenticación y notificar a todos los observadores
async function updateAuthState(user) {
    if (user) {
        // Consulta Firestore para obtener los datos actualizados del usuario
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
            const userDataFromFirestore = userDocSnap.data();
            userData = {
                id: user.uid,
                email: user.email,
                displayName: userDataFromFirestore.displayName,
                rol: userDataFromFirestore.rol,
                foto: userDataFromFirestore.foto,
                portada: userDataFromFirestore.portada,
                bio: userDataFromFirestore.bio,
            };
            console.log("auth.js onAuthStateChanged userData", userData);
        } else {
            console.log("No se encontraron datos para el usuario en Firestore.");
        }
    } else {
        // Usuario no autenticado
        userData = {
            id: null,
            email: null,
            displayName: null,
            rol: null,
            foto: null,
            portada: null,
            bio: null,
        };
    }
    // Notificar a los observadores sobre el cambio en los datos del usuario
    notifyAll();
}

// Listener de cambio en el estado de autenticación
onAuthStateChanged(auth, async (user) => {
    await updateAuthState(user);
});

export function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
        .catch(err => {
            console.error("Error al autenticar al usuario: ", err);
            throw err;
        });
}

export function register(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
        .then(async (credentials) => {
            await setDoc(doc(db, 'users', credentials.user.uid), {
                email,
                displayName: null,
                created_at: Timestamp.now(),
                rol: 'comun',
                foto: '',
                portada :'',
                bio: '',
            });
        })
        .catch(err => {
            console.error("Error al crear el usuario: ", err);
        });
}

export function logout() {
    return signOut(auth);
}

export async function updateUserProfile(newData, id) {
    try {
        const userDocRef = doc(db, 'users', id);
        await updateDoc(userDocRef, newData);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
        } else {
            console.log('¡No existe el documento del usuario!');
        }
    } catch (error) {
        console.error('Error al actualizar el perfil del usuario:', error);
    }
}

export default {
    auth
};
