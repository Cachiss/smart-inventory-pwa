'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function SalesChart({ sales }: { sales: any[] }) {
  const [salesByCustomer, setSalesByCustomer] = useState<any[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]);

  useEffect(() => {
    // Agrupar las ventas por cliente y por producto
    const groupedSales = sales.reduce((acc: any, sale: any) => {
      const { customerId, customerName, productId, productName, quantity, date } = sale;

      // Agrupando por cliente y por producto
      if (!acc[customerId]) {
        acc[customerId] = {
          customerName,
          products: {},
          salesData: []
        };
      }

      if (!acc[customerId].products[productId]) {
        acc[customerId].products[productId] = {
          productName,
          totalQuantity: 0
        };
      }

      acc[customerId].products[productId].totalQuantity += quantity;

      // Guardar los datos para la gráfica de líneas (si fuera necesario más tarde)
      acc[customerId].salesData.push({
        date,
        quantity
      });

      return acc;
    }, {});

    // Convertir los datos de ventas agrupados en un array para facilitar su uso
    const salesArray = Object.keys(groupedSales).map((customerId) => {
      const productsArray = Object.keys(groupedSales[customerId].products).map((productId) => ({
        productName: groupedSales[customerId].products[productId].productName,
        totalQuantity: groupedSales[customerId].products[productId].totalQuantity
      }));
      return {
        customerId,
        customerName: groupedSales[customerId].customerName,
        products: productsArray,
        salesData: groupedSales[customerId].salesData
      };
    });

    setSalesByCustomer(salesArray);
    // Para la primera gráfica de ventas por cliente
    const totalSalesByCustomer = salesArray.map((customerData) => ({
      customerName: customerData.customerName,
      totalQuantity: customerData.salesData.reduce((sum: number, sale: any) => sum + sale.quantity, 0)
    }));
    setSalesData(totalSalesByCustomer);
  }, [sales]);

  // Definir colores para cada segmento del gráfico de pastel
  const COLORS = ['#8884d8', '#82ca9d', '#ff8042', '#ffbb28', '#00C49F'];

  return (
    <div>
      {/* Primera gráfica: Piechart de ventas por cliente */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Ventas por cliente</h2>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={salesData}
              dataKey="totalQuantity"
              nameKey="customerName"
              cx="50%" cy="50%"
              outerRadius={150}
              fill="#8884d8"
              label
            >
              {salesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Gráficas de pastel por cliente */}
      <div className="grid grid-cols-2 gap-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 col-span-2">Distribución de Ventas por Cliente</h2>
        {salesByCustomer.map((customerData) => (
          <div
            key={customerData.customerId}
            style={{ marginBottom: '30px' }}
            className="flex flex-col items-center"
          >
            <h3 className="text-md font-medium text-gray-700 mb-2">{`Distribución de compras para el cliente: ${customerData.customerName}`}</h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={customerData.products}
                  dataKey="totalQuantity"
                  nameKey="productName"
                  cx="50%" cy="50%"
                  outerRadius={150}
                  fill="#8884d8"
                  label
                >
                  {customerData.products.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SalesChart;