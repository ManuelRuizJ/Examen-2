import React, { useEffect, useState } from "react";
import { getOrders, createOrder } from "../services/orderService";
import { Menu } from "./Menu";
import { Button } from "@/components/ui/button";

export const Ordenes = () => {
  const [orders, setOrders] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [pagado, setPagado] = useState(false);
  const [newOrder, setNewOrder] = useState({
    items: [],
    total: 0,
    payment: "",
    table: "/Tables/R2JthS29DSLRYU6dEqAV",
    timestamp: new Date().toLocaleString("es-MX", {
      timeZone: "America/Mexico_City",
    }),
  });

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
        console.error("Error al obtener las ordenes:", error);
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

  const handlePay = async (paymentMethod) => {
    try {
      const total = selectedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const order = {
        items: selectedItems,
        total,
        payment: paymentMethod,
        createdAt: new Date(),
      };

      await createOrder(order);
      setSelectedItems([]);
      setPagado(true);
    } catch (error) {
      console.error("Error al crear la orden:", error);
      alert("Error al procesar el pago");
    }
  };

  const guardarOrden = async () => {
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
    } catch (error) {
      console.error("Error al guardar la orden:", error);
    }
  };

  return (
    <div className="ml-52 mr-52 min-h-screen items-center">
      <h2 className="text-2xl font-bold mt-24">Agregar Nueva Orden</h2>
      <Menu onAddItem={handleAddItem} />
      <div className="place-items-center mt-4 p-4 border-2 bg-gray-100">
        <h3 className="text-xl font-semibold mt-2 mb-6">Nueva Orden</h3>
        <div className="mb-6">
          <label className="block font-bold text-gray-700 mb-2">
            Articulos
          </label>
          {newOrder.items.map((item, index) => (
            <div key={index} className=" mt-2">
              <span className="mr-4">{item.name}</span>
              <span>
                ${item.price} x {item.quantity}
              </span>
            </div>
          ))}
        </div>
        <div className="mb-9">
          <label className="block font-bold text-gray-700 mb-2">Total</label>
          <input
            type="number"
            value={newOrder.total}
            className="block p-2 border rounded-lg"
            readOnly
          />
        </div>
        <div className="mb-10">
          <label className="block font-bold text-gray-700 mb-2">
            Metodo de Pago
          </label>
          <select
            value={newOrder.payment}
            onChange={(e) =>
              setNewOrder({ ...newOrder, payment: e.target.value })
            }
            className="w-full p-2 border rounded-xl"
          >
            <option value="cash">Cash</option>
            <option value="tarjeta">Tarjeta</option>
          </select>
        </div>
        <button
          onClick={() => handlePay(newOrder.payment)}
          className="block cente w-5/12 bg-green-600 text-white py-3 rounded-lg hover:bg-green-800"
        >
          Guardar Orden
        </button>
      </div>
      <h2 className="text-2xl font-bold">Ordenes</h2>
      <ul className="place-items-center mt-4 p-4 border-2 bg-gray-100">
        {orders.map((order) => (
          <li key={order.id}>
            <h3>Orden ID: {order.id}</h3>
            {order.items.map((item, index) => (
              <p key={index}>
                {item.name} - ${item.price} x {item.quantity}
              </p>
            ))}
            <p>Total: ${order.total}</p>
            <p>Forma de pago: {order.payment}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
