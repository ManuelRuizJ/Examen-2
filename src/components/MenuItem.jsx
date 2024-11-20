import React from "react";

const MenuItem = ({ item, onAddItem }) => {
  return (
    <li className="bg-gray-300 p-6 rounded-lg text-center">
      <h2 className="text-lg font-bold text-center mt-4">{item.name}</h2>
      <p className="text-center mt-2">{item.description}</p>
      <p className="text-center mt-2 font-bold">${item.price.toFixed(2)}</p>
      <button
        className="bg-blue-500 text-white font-bold py-1 px-3 rounded mt-4"
        onClick={() => onAddItem(item)}
      >
        Agregar
      </button>
    </li>
  );
};

export default MenuItem;
