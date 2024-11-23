import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";

const createOrder = async (order) => {
  try {
    const orderWithTimestamp = {
      ...order,
      createdAt: Timestamp.now(),
      status: "pending",
    };
    const docRef = await addDoc(collection(db, "Orders"), orderWithTimestamp);
    console.log("Order created with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

const getOrders = async () => {
  const querySnapshot = await getDocs(collection(db, "Orders"));
  const dataList = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return dataList;
};

const getMenuFromFirestore = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "Menu"));

    const menuItems = querySnapshot.docs.map((doc) => doc.data());
    return menuItems;
  } catch (error) {
    console.error("Error obteniendo los datos del menú:", error);
    throw error;
  }
};

export { getOrders, createOrder, getMenuFromFirestore };
