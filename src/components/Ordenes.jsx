import React, { useState, useEffect } from "react";
import { getOrders, createOrder } from "../services/orderService";
import { Menu } from "./Menu";
import { Button } from "@/components/ui/button";
import { CreateMenuItem } from "./CreateMenuItem";
import { UpdateMenuItem } from "./UpdateMenuItem";
import { DeleteMenuItem } from "./DeleteMenuItem";

export const Ordenes = ({ isAdmin }) => {
  const [orders, setOrders] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [pagado, setPagado] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [newOrder, setNewOrder] = useState({
    items: [],
    total: 0,
    payment: "",
    table: "/Tables/R2JthS29DSLRYU6dEqAV",
    timestamp: new Date().toLocaleString("es-MX", {
      timeZone: "America/Mexico_City",
    }),
  });
  const [error, setError] = useState("");

  const [activeComponent, setActiveComponent] = useState(null);

  const handleAddItem = (item) => {
    const existingItem = selectedItems.find((i) => i.id === item.id);
    if (existingItem) {
      setSelectedItems(
        selectedItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrders = await getOrders();
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error al obtener las órdenes:", error);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const total = selectedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setNewOrder((prevOrder) => ({
      ...prevOrder,
      items: selectedItems.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity.toString(),
      })),
      total,
      timestamp: new Date().toLocaleString("es-MX", {
        timeZone: "America/Mexico_City",
      }),
    }));
  }, [selectedItems]);

  const guardarOrden = async () => {
    if (!newOrder.payment || selectedItems.length === 0) {
      setError(
        "Por favor, completa todos los campos antes de guardar la orden."
      );
      return;
    }

    try {
      await createOrder(newOrder);
      const updatedOrders = await getOrders();
      setOrders(updatedOrders);
      setNewOrder({
        items: [],
        total: 0,
        payment: "",
        table: "/Tables/R2JthS29DSLRYU6dEqAV",
        timestamp: new Date().toLocaleString("es-MX", {
          timeZone: "America/Mexico_City",
        }),
      });
      setSelectedItems([]);
      setError("");
    } catch (error) {
      console.error("Error al guardar la orden:", error);
      setError("Error al guardar la orden");
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="mx-auto max-w-screen-lg px-4 py-8">
      <h2 className="text-2xl font-bold mt-4 text-center">
        {activeComponent ? "Gestión del Menú" : "Órdenes y Menú"}
      </h2>

      {!activeComponent && (
        <>
          <Menu onAddItem={handleAddItem} />
          <div className="mt-6 p-4 border-2 bg-gray-100 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Nueva Orden</h3>
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4 rounded-lg">
                <strong>Error: </strong>
                {error}
              </div>
            )}
            <div className="mb-4">
              <label className="block font-bold text-gray-700 mb-2">
                Artículos
              </label>
              {newOrder.items.length > 0 ? (
                newOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between mt-2">
                    <span>{item.name}</span>
                    <span>
                      ${item.price} x {item.quantity}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">
                  No se han seleccionado artículos.
                </p>
              )}
            </div>
            <div className="mb-6">
              <label className="block font-bold text-gray-700 mb-2">
                Total
              </label>
              <input
                type="number"
                value={newOrder.total}
                className="block w-full p-2 border rounded-lg bg-gray-50"
                readOnly
              />
            </div>
            <div className="mb-6">
              <label className="block font-bold text-gray-700 mb-2">
                Método de Pago
              </label>
              <select
                value={newOrder.payment}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, payment: e.target.value })
                }
                className="w-full p-2 border rounded-lg bg-gray-50"
              >
                <option value="">Selecciona una forma de pago</option>
                <option value="cash">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
              </select>
            </div>
            <button
              onClick={guardarOrden}
              className="w-full md:w-1/2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-800 transition duration-300"
            >
              Guardar Orden
            </button>
          </div>
        </>
      )}

      {activeComponent === "create" && (
        <div>
          <CreateMenuItem />
          <button
            className="mt-4 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-300"
            onClick={() => setActiveComponent(null)}
          >
            Regresar al Menú
          </button>
        </div>
      )}

      {activeComponent === "update" && (
        <div>
          <UpdateMenuItem />
          <button
            className="mt-4 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-300"
            onClick={() => setActiveComponent(null)}
          >
            Regresar al Menú
          </button>
        </div>
      )}

      {activeComponent === "delete" && (
        <div>
          <DeleteMenuItem />
          <button
            className="mt-4 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-300"
            onClick={() => setActiveComponent(null)}
          >
            Regresar al Menú
          </button>
        </div>
      )}

      {orders.length > 0 && !activeComponent && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center">Órdenes Existentes</h2>
          <div className="mt-4 space-y-4">
            {orders
              .sort((a, b) => {
                console.log("Fecha A (timestamp):", a.timestamp);
                console.log("Fecha B (timestamp):", b.timestamp);

                const dateA = new Date(a.timestamp);
                const dateB = new Date(b.timestamp);

                console.log("Fecha A (Date):", dateA);
                console.log("Fecha B (Date):", dateB);

                return dateB - dateA;
              })
              .map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Orden ID: {order.id}
                    </h3>
                    <Button
                      onClick={() => toggleOrderDetails(order.id)}
                      className="bg-blue-500 text-white py-1 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                      {expandedOrder === order.id
                        ? "Ocultar detalles"
                        : "Ver detalles"}
                    </Button>
                  </div>
                  {expandedOrder === order.id && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-800">
                        Detalles de la Orden
                      </h4>
                      <div className="mt-2">
                        <p>
                          <strong>Status:</strong> {order.status}
                        </p>
                        <p>
                          <strong>Mesa:</strong> {order.table}
                        </p>
                        <p>
                          <strong>Fecha y Hora:</strong> {order.timestamp}
                        </p>
                        <h5 className="font-semibold mt-2">Artículos:</h5>
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between mt-2"
                          >
                            <span>{item.name}</span>
                            <span>
                              ${item.price} x {item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 border-t pt-4">
                        <p className="text-gray-700 font-semibold">
                          Total: ${order.total}
                        </p>
                        <p className="text-gray-700">
                          Forma de pago: {order.payment}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-center gap-4">
        <Button
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300"
          onClick={() => setActiveComponent("create")}
        >
          Crear Elemento
        </Button>
        <Button
          className="bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors duration-300"
          onClick={() => setActiveComponent("update")}
        >
          Actualizar Elemento
        </Button>
        <Button
          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300"
          onClick={() => setActiveComponent("delete")}
        >
          Eliminar Elemento
        </Button>
      </div>
    </div>
  );
};
