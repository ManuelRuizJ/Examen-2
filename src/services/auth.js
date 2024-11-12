import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { db } from "./firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
const auth = getAuth();

// Registrar un usuario
const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await setDoc(doc(db, "Users", user.uid), {
      email: user.email,
      role: "user",
      createdAt: new Date(),
    });

    console.log("User registered and saved to Firestore: ", user.uid);
    return { user, error: null };
  } catch (error) {
    console.log("Error registrando usuario: ", error.message);
    return { user: null, error: error.message };
  }
};

// Login User
const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    const role = userDoc.exists() ? userDoc.data().role : null;

    return { user, role, error: null };
  } catch (error) {
    console.error("Error loging in user: ", error.message);
    return { user: null, role: null, error: error.message };
  }
};

// Logout User
const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("User logged out");
    return { user: null, error: null };
  } catch (error) {
    console.error("Error logging out user: ", error.message);
    return { error: error.message };
  }
};

export { registerUser, loginUser, logoutUser };
