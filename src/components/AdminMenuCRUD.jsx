import React, { useState, useEffect } from "react";
import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../services/menuService";

export const AdminMenuCRUD = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", price: 0 });
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const items = await getMenuItems();
        setMenuItems(items);
      } catch (error) {
        console.error("Error al cargar los elementos del menú:", error);
      }
    };

    fetchMenuItems();
  }, []);

  const handleCreate = async () => {
    try {
      const createdItem = await createMenuItem(newItem);
      setMenuItems([...menuItems, createdItem]);
      setNewItem({ name: "", price: 0 });
    } catch (error) {
      console.error("Error al crear el elemento:", error);
    }
  };

  const handleUpdate = async () => {
    if (selectedItem) {
      try {
        await updateMenuItem(selectedItem);
        const updatedMenu = menuItems.map((item) =>
          item.id === selectedItem.id ? selectedItem : item
        );
        setMenuItems(updatedMenu);
        setSelectedItem(null);
      } catch (error) {
        console.error("Error al actualizar el elemento:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMenuItem(id);
      const updatedMenu = menuItems.filter((item) => item.id !== id);
      setMenuItems(updatedMenu);
    } catch (error) {
      console.error("Error al eliminar el elemento:", error);
    }
  };

  return (
    <div className="admin-menu-crud">
      <h2>Administrar Menú</h2>

      <div className="create-form">
        <input
          type="text"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          placeholder="Nombre del artículo"
        />
        <input
          type="number"
          value={newItem.price}
          onChange={(e) =>
            setNewItem({ ...newItem, price: parseFloat(e.target.value) })
          }
          placeholder="Precio"
        />
        <button onClick={handleCreate}>Crear</button>
      </div>

      <ul>
        {menuItems.map((item) => (
          <li key={item.id}>
            <span>
              {item.name} - ${item.price}
            </span>
            <button onClick={() => setSelectedItem(item)}>Editar</button>
            <button onClick={() => handleDelete(item.id)}>Eliminar</button>
          </li>
        ))}
      </ul>

      {selectedItem && (
        <div className="edit-form">
          <h3>Editar Elemento</h3>
          <input
            type="text"
            value={selectedItem.name}
            onChange={(e) =>
              setSelectedItem({ ...selectedItem, name: e.target.value })
            }
            placeholder="Nuevo nombre"
          />
          <input
            type="number"
            value={selectedItem.price}
            onChange={(e) =>
              setSelectedItem({
                ...selectedItem,
                price: parseFloat(e.target.value),
              })
            }
            placeholder="Nuevo precio"
          />
          <button onClick={handleUpdate}>Actualizar</button>
          <button onClick={() => setSelectedItem(null)}>Cancelar</button>
        </div>
      )}
    </div>
  );
};
