import db from "./firebase";

// Función para obtener el menú desde Firestore
export const getMenuFromFirestore = async () => {
  try {
    const snapshot = await db.collection("Menu").get(); // Asume que tienes una colección llamada "Menu"
    const menuItems = snapshot.docs.map((doc) => doc.data()); // Extrae los datos de cada documento
    return menuItems;
  } catch (error) {
    console.error("Error obteniendo los datos del menú:", error);
    throw error;
  }
};
