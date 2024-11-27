import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutForm } from "./CheckoutForm";
import { useLocation } from "react-router-dom";

const stripePromise = loadStripe("pk_test_51QP5brE4cZfsH7eSXHfcQlUbDgy2LPrRGRSJRsfeUVg5KU2F2n13p8P9GKmJBctG0OU0RxhyJ9utH3xL29t9ySCD00ZxZsupvR");

export const Pago = () => {
  const location = useLocation();
  const { total = 0, items = [] } = location.state || {};

  return (
    <Elements stripe={stripePromise}>
      <div className="p-6 flex items-center justify-center w-full">
        <div className="bg-slate-300 p-4 rounded-lg shadow-lg w-3/4 max-w-sm">
          <h1 className="text-2xl font-bold mb-4 text-center">Procesar Pago</h1>
          <CheckoutForm order={{ total, items }} />
        </div>
      </div>

    </Elements>
  );
};
