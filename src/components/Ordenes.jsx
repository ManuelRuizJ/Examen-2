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
  const [error, setError] = useState("");
  const [showOrders, setShowOrders] = useState(true);
  const [loading, setLoading] = useState(true);

  const [newOrder, setNewOrder] = useState({
    items: [],
    total: 0,
    payment: "",
    table: "/Tables/R2JthS29DSLRYU6dEqAV",
    timestamp: new Date().toLocaleString("es-MX", {
      timeZone: "America/Mexico_City",
    }),
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrders = await getOrders();

        // Función para convertir las fechas de formato 12 horas (AM/PM) a 24 horas
        const parseDate = (dateString) => {
          const [datePart, timePart] = dateString.split(", ");
          const [day, month, year] = datePart.split("/").map(Number);
          const [time, period] = timePart.split(" ");
          const [hours, minutes, seconds] = time.split(":").map(Number);

          let hours24 = hours;
          if (period === "p.m." && hours < 12) {
            hours24 += 12;
          } else if (period === "a.m." && hours === 12) {
            hours24 = 0;
          }

          return new Date(year, month - 1, day, hours24, minutes, seconds);
        };

        // Ordenamos las órdenes por el timestamp convertido
        const sortedOrders = fetchedOrders.sort((a, b) => {
          const dateA = parseDate(a.timestamp);
          const dateB = parseDate(b.timestamp);
          return dateB - dateA; // Ordenar de más reciente a más antiguo
        });

        setOrders(sortedOrders);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Error al cargar las órdenes");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleSaveOrder = (newOrder) => {
    const isDuplicate = orders.some((order) => order.id === newOrder.id);
    if (!isDuplicate) {
      setOrders((prevOrders) => [...prevOrders, newOrder]);
    } else {
      console.log("Orden duplicada");
    }
  };

  const handleRemoveItem = (itemId) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== itemId));
  };

  const toggleOrdersVisibility = () => {
    setShowOrders((prevShowOrders) => !prevShowOrders);
  };

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
      const sortedOrders = updatedOrders.sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
      setOrders(sortedOrders);
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

  const formatPaymentMethod = (payment) => {
    return payment === "cash"
      ? "Efectivo"
      : payment === "tarjeta"
      ? "Tarjeta"
      : payment;
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
                  <div
                    key={index}
                    className="flex justify-between items-center mt-2"
                  >
                    <div>
                      <span>{item.name}</span>
                      <span>
                        {" "}
                        - ${item.price} x {item.quantity}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(selectedItems[index].id)}
                      className="text-red-600 font-semibold hover:underline"
                    >
                      Eliminar
                    </button>
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

          {/* Sección de Órdenes */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Órdenes</h3>
              <Button onClick={toggleOrdersVisibility}>
                {showOrders ? "Ocultar Órdenes" : "Mostrar Órdenes"}
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-4">Cargando órdenes...</div>
            ) : (
              showOrders && (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border rounded-lg bg-white shadow-sm"
                    >
                      <div
                        className="p-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => toggleOrderDetails(order.id)}
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="text-lg font-semibold">
                            Orden #{order.id.slice(-4)}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {order.timestamp}
                          </span>
                        </div>
                      </div>
                      {expandedOrder === order.id && (
                        <div className="p-4 border-t">
                          <div className="space-y-2">
                            <div>
                              <strong>Items:</strong>
                              <ul className="list-disc pl-5 mt-2">
                                {order.items.map((item, idx) => (
                                  <li key={idx}>
                                    {item.name} - ${item.price} x{" "}
                                    {item.quantity}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <strong>Total:</strong> ${order.total}
                            </div>
                            <div>
                              <strong>Método de Pago:</strong>{" "}
                              {formatPaymentMethod(order.payment)}
                            </div>
                            <div>
                              <strong>Estado:</strong>{" "}
                              {order.status || "Pendiente"}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            )}
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
