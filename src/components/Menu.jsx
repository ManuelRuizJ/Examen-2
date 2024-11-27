//MENU DE CIENTE
import React, { useEffect, useState } from "react";
import { db } from "../services/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export const Menu = ({ onAddItem }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const [addedItems, setAddedItems] = useState({});

  useEffect(() => {
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

  const handleAddItem = (item) => {
    setAddedItems((prev) => ({ ...prev, [item.id]: true }));
    onAddItem(item);
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [item.id]: false }));
    }, 500);
  };

  const filteredData = data
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) &&
        Number(item.price) >= priceRange.min &&
        Number(item.price) <= priceRange.max
    )
    .sort((a, b) => {
      if (sortOption === "alphabetical") {
        return a.name.localeCompare(b.name);
      }
      if (sortOption === "priceAsc") {
        return a.price - b.price;
      }
      if (sortOption === "priceDesc") {
        return b.price - a.price;
      }
      return 0;
    });

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white shadow-xl w-full max-w-3xl p-5 rounded-lg">
        <h1 className="text-4xl font-bold text-center mb-6 pb-5">Platillos</h1>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar platillo..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full p-2 border rounded-lg mb-4"
          />
        </div>

        <div className="mb-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Ordenar por:
            </label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Sin orden</option>
              <option value="alphabetical">Alfabéticamente</option>
              <option value="priceAsc">Precio: Menor a mayor</option>
              <option value="priceDesc">Precio: Mayor a menor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Rango de precios:
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Mínimo"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, min: Number(e.target.value) })
                }
                className="w-1/2 p-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Máximo"
                value={priceRange.max === Infinity ? "" : priceRange.max}
                onChange={(e) =>
                  setPriceRange({
                    ...priceRange,
                    max:
                      e.target.value === "" ? Infinity : Number(e.target.value),
                  })
                }
                className="w-1/2 p-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-center">Cargando . . .</p>
        ) : filteredData.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredData.map((item) => (
              <li
                key={item.id}
                className={`bg-gray-300 p-6 rounded-lg text-center transition-transform ${
                  addedItems[item.id] ? "scale-105 bg-green-200" : ""
                }`}
              >
                <h2 className="text-lg font-bold text-center mt-4">
                  {item.name}
                </h2>
                <p className="text-center mt-2">{item.description}</p>
                <p className="text-center mt-2 font-bold">
                  ${Number(item.price).toFixed(2)}
                </p>
                <button
                  className="bg-blue-500 text-white font-bold py-1 px-3 rounded mt-4 transition-colors hover:bg-blue-700"
                  onClick={() => handleAddItem(item)}
                >
                  Agregar
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">
            No se encontraron resultados con los filtros aplicados.
          </p>
        )}
      </div>
    </div>
  );
};
