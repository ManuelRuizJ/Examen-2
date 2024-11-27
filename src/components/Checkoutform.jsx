import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate, useLocation } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore"; 
import { db } from "../services/firebaseConfig"; 

export const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { total, items, paymentMethod } = location.state || {};

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (!stripe || !elements) {
      alert("Stripe no está cargado.");
      setLoading(false);
      return;
    }

    try {
      // Procesar el pago
      const response = await fetch("http://localhost:5000/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total * 100, currency: "usd" }),
      });

      const { clientSecret } = await response.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: "Cliente",
          },
        },
      });

      if (result.error) {
        setErrorMessage("Tu tarjeta ha sido rechazada.");
        setLoading(false);
      } else if (result.paymentIntent.status === "succeeded") {
        try {
          const orderData = {
            items: items || [],
            total: total || 0,
            payment: "tarjeta",
            status: "completed",
            timestamp: new Date().toLocaleString("es-MX", {
              timeZone: "America/Mexico_City",
            }),
          };

          await addDoc(collection(db, "orders"), orderData);

          console.log("Orden guardada en Firebase exitosamente:", orderData);

          navigate("/confirmacion", {
            state: {
              total,
              method: "Tarjeta",
              status: "completed",
              timestamp: orderData.timestamp,
            },
          });
        } catch (firebaseError) {
          console.error("Error al guardar la orden en Firebase:", firebaseError);
          setErrorMessage("El pago fue exitoso, pero ocurrió un error al guardar la orden.");
        }
      } else {
        setErrorMessage("El pago no pudo ser completado.");
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      setErrorMessage("Ocurrió un error al procesar el pago. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/menu");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Información de la Tarjeta
          </label>
          <CardElement className="p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500" />
        </div>
        {errorMessage && (
          <p className="text-red-500 text-sm text-center mb-4">{errorMessage}</p>
        )}
        <button
          type="submit"
          className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium text-lg hover:bg-blue-700 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!stripe || loading}
        >
          {loading ? "Procesando..." : `Pagar $${total}`}
        </button>
      </form>
      <button
        onClick={handleCancel}
        className="w-full mt-4 bg-gray-600 text-white py-3 px-4 rounded-lg font-medium text-lg hover:bg-gray-700 transition"
      >
        Cancelar
      </button>
    </div>
  );
};
