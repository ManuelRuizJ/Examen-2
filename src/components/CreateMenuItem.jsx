import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/services/firebaseConfig";

export const CreateMenuItem = () => {
  const [menuItem, setMenuItem] = useState({
    name: "",
    price: "",
    description: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenuItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const menuCollection = collection(db, "Menu");

      await addDoc(menuCollection, {
        name: menuItem.name,
        price: Number(menuItem.price),
        description: menuItem.description,
      });

      setMessage("¡Elemento creado exitosamente!");

      setMenuItem({
        name: "",
        price: "",
        description: "",
      });
    } catch (error) {
      console.error("Error al crear el elemento del menú:", error);
      setMessage("Error al crear el elemento. Por favor, intenta de nuevo.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Crear Nuevo Elemento del Menú
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="name"
            >
              Nombre:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={menuItem.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="price"
            >
              Precio:
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={menuItem.price}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="description"
            >
              Descripción:
            </label>
            <textarea
              id="description"
              name="description"
              value={menuItem.description}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows="4"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            Crear Elemento
          </button>
        </form>
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
    </div>
  );
};
