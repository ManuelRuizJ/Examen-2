import React, { useState, useEffect } from "react";
import { collection, doc, getDocs, deleteDoc, query } from "firebase/firestore"; // Firestore
import { db } from "@/services/firebaseConfig";

export const DeleteMenuItem = () => {
  const [menuItems, setMenuItems] = useState([]); // Lista de platillos
  const [selectedItemId, setSelectedItemId] = useState(""); // ID del elemento seleccionado
  const [selectedItem, setSelectedItem] = useState(null); // Elemento seleccionado
  const [message, setMessage] = useState(""); // Mensaje de éxito o error
  const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar el modal

  // Cargar los elementos del menú al montar el componente
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const menuCollection = collection(db, "Menu"); // Referencia a la colección
        const q = query(menuCollection); // Query para obtener todos los documentos
        const querySnapshot = await getDocs(q);

        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          price: doc.data().price,
          description: doc.data().description,
        }));

        setMenuItems(items); // Guardar los nombres e IDs
      } catch (error) {
        console.error("Error al cargar los elementos del menú:", error);
        setMessage("Error al cargar los elementos del menú. Intenta de nuevo.");
      }
    };

    fetchMenuItems();
  }, []);

  const openConfirmationModal = () => {
    const item = menuItems.find((item) => item.id === selectedItemId);
    if (item) {
      setSelectedItem(item);
      setShowModal(true); // Mostrar el modal
    } else {
      setMessage("Por favor selecciona un platillo para eliminar.");
    }
  };

  const handleDelete = async () => {
    try {
      const docRef = doc(db, "Menu", selectedItemId); // Referencia al documento
      await deleteDoc(docRef); // Eliminar el documento

      // Actualizar la lista local de elementos
      setMenuItems((prevItems) =>
        prevItems.filter((item) => item.id !== selectedItemId)
      );

      setSelectedItemId(""); // Limpiar selección
      setSelectedItem(null);
      setShowModal(false); // Cerrar el modal
      setMessage("¡Elemento eliminado exitosamente!");
    } catch (error) {
      console.error("Error al eliminar el elemento del menú:", error);
      setMessage("Error al eliminar el elemento. Por favor, intenta de nuevo.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Eliminar Elemento del Menú
        </h2>

        {/* Selector de platillo */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-medium mb-2"
            htmlFor="menu-item"
          >
            Buscar platillo:
          </label>
          <select
            id="menu-item"
            value={selectedItemId}
            onChange={(e) => setSelectedItemId(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="">Selecciona un platillo</option>
            {menuItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* Botón para abrir la confirmación */}
        <button
          onClick={openConfirmationModal}
          className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
        >
          Eliminar Elemento
        </button>

        {/* Mensaje de retroalimentación */}
        {message && (
          <p
            className={`mt-4 text-center font-medium ${
              message.includes("exitosamente")
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      {/* Modal de confirmación */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              ¿Estás seguro que deseas eliminar este elemento?
            </h3>
            <div className="mb-4">
              <p className="text-gray-700">
                <strong>Nombre:</strong> {selectedItem.name}
              </p>
              <p className="text-gray-700">
                <strong>Precio:</strong> ${selectedItem.price}
              </p>
              <p className="text-gray-700">
                <strong>Descripción:</strong> {selectedItem.description}
              </p>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
