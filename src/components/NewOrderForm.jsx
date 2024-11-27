import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NewOrderForm = ({
  newOrder = {
    items: [],
    total: 0,
    payment: "",
  },
  setNewOrder,
  selectedItems = [],
  error = "",
  onSaveOrder,
}) => {
  const navigate = useNavigate();

  const handlePayment = () => {
    if (newOrder.items.length === 0 || newOrder.total <= 0) {
      alert("La orden debe tener artículos y un total válido antes de pagar.");
      return;
    }

    navigate("/pago", {
      state: {
        total: newOrder.total,
        items: newOrder.items,
        paymentMethod: newOrder.payment,
      },
    });
  };

  const handlePaymentChange = (e) => {
    setNewOrder((prev) => ({
      ...prev,
      payment: e.target.value,
    }));
  };

  return (
    <div className="mt-6 p-4 border-2 bg-gray-100 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Nueva Orden</h3>
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4 rounded-lg">
          <strong>Error: </strong>
          {error}
        </div>
      )}
      <div className="mb-4">
        <label className="block font-bold text-gray-700 mb-2">Artículos</label>
        {newOrder.items && newOrder.items.length > 0 ? (
          newOrder.items.map((item, index) => (
            <div key={index} className="flex justify-between mt-2">
              <span>{item.name || "Sin nombre"}</span>
              <span>
                ${item.price || 0} x {item.quantity || 1}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No se han seleccionado artículos.</p>
        )}
      </div>
      <div className="mb-6">
        <label className="block font-bold text-gray-700 mb-2">Total</label>
        <input
          type="number"
          value={newOrder.total || 0}
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
          onChange={handlePaymentChange}
          className="w-full p-2 border rounded-lg bg-gray-50"
        >
          <option value="">Selecciona una forma de pago</option>
          <option value="cash">Efectivo</option>
          <option value="tarjeta">Tarjeta</option>
        </select>
      </div>
      <Button
        onClick={onSaveOrder}
        variant="default"
        className="w-full md:w-1/2 bg-green-600 hover:bg-green-800 text-white"
      >
        Guardar Orden
      </Button>
      <Button
        onClick={handlePayment}
        variant="default"
        className="w-full md:w-1/2 bg-blue-600 hover:bg-blue-800 text-white mt-4"
      >
        Pagar Ahora
      </Button>
    </div>
  );
};

export default NewOrderForm;