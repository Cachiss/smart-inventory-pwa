"use client";

import { useRef, useState } from "react";

export default function SalesForm({ products, customers, userId }: any) {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFormChange = () => {
    if (formRef.current) {
      const selectedProductId = formRef.current.product.value;
      const selectedProduct = products.find((product: { id: any }) => product.id == selectedProductId);
      formRef.current.quantity.max = selectedProduct?.stock?.toString() || "0";
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const productId = formData.get("product");
      const customerId = formData.get("customer");
      const quantity = formData.get("quantity");

      if (!productId || !customerId || !quantity) {
        setError("Todos los campos son requeridos.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/create-sale", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
            customerId,
            quantity: Number(quantity),
            userId: userId,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Error desconocido.");
        }

        setSuccess("Venta registrada exitosamente.");
        formRef.current.reset(); // Limpia el formulario
      } catch (error: any) {
        setError(error.message || "Error al registrar la venta.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onChange={handleFormChange}
      className="space-y-6 bg-white p-6 rounded-lg shadow-lg"
    >
      {/* Select Producto */}
      <div>
        <label htmlFor="product" className="block text-sm font-medium text-gray-700">
          Producto
        </label>
        <select
          id="product"
          name="product"
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          defaultValue=""
        >
          <option value="" disabled>
            Selecciona un producto
          </option>
          {products.map((product: { id: string; name: string; stock: number }) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>

      {/* Select Cliente */}
      <div>
        <label htmlFor="customer" className="block text-sm font-medium text-gray-700">
          Cliente
        </label>
        <select
          id="customer"
          name="customer"
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          defaultValue=""
        >
          <option value="" disabled>
            Selecciona un cliente
          </option>
          {customers.map((customer: { id: string; name: string }) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </div>

      {/* Input Cantidad */}
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
          Cantidad
        </label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          placeholder="Ingrese la cantidad"
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          min="1"
          max="0"
        />
      </div>

      {/* Botón Enviar */}
      <div className="text-center">
        <button
          type="submit"
          disabled={loading}
          className={`w-full ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          } text-white font-medium py-2 px-4 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          {loading ? "Procesando..." : "Registrar Venta"}
        </button>
      </div>

      {/* Mensajes de error y éxito */}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">{success}</p>}
    </form>
  );
}