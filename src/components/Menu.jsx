import React, { useEffect, useState } from "react";
import { db } from "../services/firebaseConfig"; // Asegúrate de importar la configuración de Firebase
import { collection, getDocs } from "firebase/firestore"; // Importar Firestore funciones necesarias

export const Menu = ({ onAddItem }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener los platillos desde Firestore
    const fetchData = async () => {
      try {
        const menuCollection = collection(db, "Menu");
        const menuSnapshot = await getDocs(menuCollection);
        const menuList = menuSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(menuList);
      } catch (error) {
        console.error("Error al obtener los platillos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white shadow-xl w-full max-w-3xl p-5 rounded-lg">
        <h1 className="text-4xl font-bold text-center mb-6 pb-5">Platillos</h1>
        {loading ? (
          <p className="text-center">Cargando . . .</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {data.map((item) => (
              <li
                key={item.id}
                className="bg-gray-300 p-6 rounded-lg text-center"
              >
                <h2 className="text-lg font-bold text-center mt-4">
                  {item.name}
                </h2>
                <p className="text-center mt-2">{item.description}</p>
                <p className="text-center mt-2 font-bold">
                  {/* Verificar si price es un número y convertirlo en uno si es necesario */}
                  ${Number(item.price).toFixed(2)}
                </p>
                <button
                  className="bg-blue-500 text-white font-bold py-1 px-3 rounded mt-4"
                  onClick={() => onAddItem(item)}
                >
                  Agregar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
