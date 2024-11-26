import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const Confirmacion = () => {
  const location = useLocation(); 
  const navigate = useNavigate();

  const { total, paymentMethod } = location.state || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/menu'); 
    }, 5000);

    return () => clearTimeout(timer); 
  }, [navigate]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">¡Pago Exitoso!</h1>
        <p className="mb-2">Gracias por tu compra.</p>
        <p className="mb-4">
          <strong>Monto Pagado:</strong> ${total || 'Desconocido'}
        </p>
        <p className="mb-6">
          <strong>Método de Pago:</strong> {paymentMethod || 'Desconocido'}
        </p>
        <p className="text-sm text-gray-500">
          Serás redirigido automáticamente al menú principal en unos segundos.
        </p>
      </div>
    </div>
  );
};
