import db from "./firebase";

export const getMenuFromFirestore = async () => {
  try {
    const snapshot = await db.collection("Menu").get();
    const menuItems = snapshot.docs.map((doc) => doc.data());
    return menuItems;
  } catch (error) {
    console.error("Error obteniendo los datos del menú:", error);
    throw error;
  }
};
