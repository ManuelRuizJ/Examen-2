import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Create a new order
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

// Read all orders
const getOrders = async () => {
  const querySnapshot = await getDocs(collection(db, "Orders"));
  const dataList = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return dataList;
};

export { getOrders, createOrder };
