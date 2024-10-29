import { NextResponse } from 'next/server'
import { db, products } from 'lib/db';


export const dynamic = 'force-dynamic';

type ProductData = {
  imageUrl: string
  name: string
  status: string
  price: number
  stock: number
  availableAt: any
}

// app/api/products/route.ts

export async function POST(request: Request) {
  try {
    // Convierte el ReadableStream a JSON
    const data = await request.json();
    const { imageUrl, name, status, price, stock, availableAt } = data;

    // Validación de los campos requeridos
    if (!name || !status) {
      return new Response(JSON.stringify({ error: 'Name and status are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Inserta el producto en la base de datos (aquí va tu lógica de inserción)
    await db.insert(products).values([{
      imageUrl,
      name,
      status,
      price,
      stock,
      availableAt: new Date(availableAt)
    }])

    return new Response(JSON.stringify({ message: 'Product created successfully' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return new Response(JSON.stringify({ error: 'Error creating product' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}