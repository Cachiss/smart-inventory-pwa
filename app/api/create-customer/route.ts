import { NextResponse } from 'next/server'
import { db, customers } from 'lib/db';


export const dynamic = 'force-dynamic';

// app/api/products/route.ts

export async function POST(request: Request) {
  try {
    // Convierte el ReadableStream a JSON
    const data = await request.json();
    const { name, address, phone, sellerId } = data;

    // Validación de los campos requeridos
    if (!name) {
      return new Response(JSON.stringify({ error: 'Name are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Inserta el producto en la base de datos (aquí va tu lógica de inserción)
    await db.insert(customers).values([{
        name,
        address,
        phone,
        sellerId
    }])

    return new Response(JSON.stringify({ message: 'customer created successfully' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    return new Response(JSON.stringify({ error: 'Error creating customer' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}