export const enviarSMSCompra = async (telefonoCliente, mensaje) => {
  try {
    const response = await fetch("http://localhost:5000/send-sms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: telefonoCliente,
        message: mensaje,
      }),
    });

    const data = await response.json();
    if (data.success) {
      console.log("SMS enviado correctamente:", data.sid);
    } else {
      console.error("Error al enviar SMS:", data.error);
    }
  } catch (error) {
    console.error("Error al enviar SMS:", error);
  }
};
