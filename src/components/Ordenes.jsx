import React, { useState, useEffect } from "react";
import { getOrders, createOrder } from "../services/orderService";
import { Menu } from "./Menu";
import { Button } from "@/components/ui/button";
import NewOrderForm from "./NewOrderForm";

export const Ordenes = ({ isAdmin }) => {
  const [orders, setOrders] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [error, setError] = useState("");
  const [showOrders, setShowOrders] = useState(true);
  const [loading, setLoading] = useState(true);

  const [newOrder, setNewOrder] = useState({
    items: [],
    total: 0,
    payment: isAdmin ? "" : "tarjeta", // Restriccion para usuarios no administradores
    table: "/Tables/R2JthS29DSLRYU6dEqAV",
    timestamp: new Date().toLocaleString("es-MX", {
      timeZone: "America/Mexico_City",
    }),
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrders = await getOrders();
        const sortedOrders = fetchedOrders.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setOrders(sortedOrders);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Error al cargar las órdenes");
        setLoading(false);
      }
    };

    // Fetch orders  sirve para actualizar la lista de órdenes en tiempo real
    fetchOrders();
    const handleStorageChange = () => fetchOrders();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

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
      const sortedOrders = updatedOrders.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      setOrders(sortedOrders);
      setNewOrder({
        items: [],
        total: 0,
        payment: isAdmin ? "" : "tarjeta",
        table: "/Tables/R2JthS29DSLRYU6dEqAV",
        timestamp: new Date().toLocaleString("es-MX", {
          timeZone: "America/Mexico_City",
        }),
      });
      setSelectedItems([]);
      setError("");
      alert("¡Orden creada exitosamente!");
    } catch (error) {
      console.error("Error al guardar la orden:", error);
      setError("Error al guardar la orden");
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const toggleOrdersVisibility = () => {
    setShowOrders((prevShowOrders) => !prevShowOrders);
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
      <h2 className="text-2xl font-bold mt-4 text-center">Órdenes y Menú</h2>

      <Menu onAddItem={handleAddItem} />

      <NewOrderForm
        newOrder={newOrder}
        setNewOrder={setNewOrder}
        selectedItems={selectedItems}
        error={error}
        onSaveOrder={guardarOrden}
      />

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
              {orders.map((order, index) => (
                <div
                  key={order.id || `order-${index}`} 
                  className="border rounded-lg bg-white shadow-sm"
                >
                  <div
                    className="p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleOrderDetails(order.id)}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-semibold">
                        Orden #{order.id || `N/A`}
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
                                {item.name} - ${item.price} x {item.quantity}
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
    </div>
  );
};
