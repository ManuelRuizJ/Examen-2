import React, { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/services/firebaseConfig";

export const UpdateMenuItem = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState("");

  const [menuItem, setMenuItem] = useState({
    name: "",
    price: "",
    description: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const menuCollection = collection(db, "Menu");
        const q = query(menuCollection);
        const querySnapshot = await getDocs(q);

        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));

        setMenuItems(items);
      } catch (error) {
        console.error("Error al cargar los elementos del menú:", error);
        setMessage("Error al cargar los elementos del menú. Intenta de nuevo.");
      }
    };

    fetchMenuItems();
  }, []);

  useEffect(() => {
    const fetchMenuItem = async () => {
      if (!selectedItemId) return;

      try {
        const docRef = doc(db, "Menu", selectedItemId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setMenuItem(docSnap.data());
        } else {
          console.error("No se encontró el elemento del menú.");
          setMessage("No se encontró el elemento del menú.");
        }
      } catch (error) {
        console.error("Error al cargar el elemento del menú:", error);
        setMessage("Error al cargar los datos.");
      }
    };

    fetchMenuItem();
  }, [selectedItemId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenuItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItemId) {
      setMessage("Por favor selecciona un platillo para actualizar.");
      return;
    }

    try {
      const docRef = doc(db, "Menu", selectedItemId);
      await updateDoc(docRef, {
        name: menuItem.name,
        price: Number(menuItem.price),
        description: menuItem.description,
      });

      setMessage("¡Elemento actualizado exitosamente!");
    } catch (error) {
      console.error("Error al actualizar el elemento del menú:", error);
      setMessage(
        "Error al actualizar el elemento. Por favor, intenta de nuevo."
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Actualizar Elemento del Menú
      </h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Buscar platillo:
        </label>
        <select
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
          value={selectedItemId}
          onChange={(e) => setSelectedItemId(e.target.value)}
        >
          <option value="">Selecciona un platillo</option>
          {menuItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {selectedItemId && (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre:
            </label>
            <input
              type="text"
              name="name"
              value={menuItem.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio:
            </label>
            <input
              type="number"
              name="price"
              value={menuItem.price}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción:
            </label>
            <input
              type="text"
              name="description"
              value={menuItem.description}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition duration-300"
          >
            Actualizar Elemento
          </button>
        </form>
      )}

      {message && (
        <p className="mt-4 text-center text-sm text-gray-800 bg-gray-100 p-3 rounded-lg">
          {message}
        </p>
      )}
    </div>
  );
};
