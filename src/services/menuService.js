import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

const menuCollection = collection(db, "menu");

export const getMenuItems = async () => {
  try {
    const snapshot = await getDocs(menuCollection);
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return items;
  } catch (error) {
    console.error("Error al obtener los elementos del menú:", error);
    throw error;
  }
};

export const createMenuItem = async (item) => {
  try {
    const docRef = await addDoc(menuCollection, item);
    return { id: docRef.id, ...item };
  } catch (error) {
    console.error("Error al crear el elemento del menú:", error);
    throw error;
  }
};

export const updateMenuItem = async (item) => {
  try {
    const itemRef = doc(db, "menu", item.id);
    await updateDoc(itemRef, item);
    return item;
  } catch (error) {
    console.error("Error al actualizar el elemento del menú:", error);
    throw error;
  }
};

export const deleteMenuItem = async (id) => {
  try {
    const itemRef = doc(db, "menu", id);
    await deleteDoc(itemRef);
  } catch (error) {
    console.error("Error al eliminar el elemento del menú:", error);
    throw error;
  }
};
