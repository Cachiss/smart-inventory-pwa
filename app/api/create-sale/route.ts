import { db, products, sales } from 'lib/db';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { productId, customerId, quantity, userId } = data;

    // Validar los campos requeridos
    if (!productId || !customerId || !quantity || !userId || quantity <= 0) {
      return new Response(
        JSON.stringify({ error: 'Todos los campos son requeridos y la cantidad debe ser mayor a 0.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Verificar stock disponible
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .then(res => res[0]);

    if (!product) {
      return new Response(
        JSON.stringify({ error: 'Producto no encontrado.' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (product.stock < quantity) {
      return new Response(
        JSON.stringify({ error: 'Stock insuficiente.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Actualizar stock
    const updatedStock = product.stock - quantity;

    const stockUpdateResult = await db
      .update(products)
      .set({ stock: updatedStock })
      .where(eq(products.id, productId));

    if (!stockUpdateResult) {
      return new Response(
        JSON.stringify({ error: 'Error al actualizar el stock del producto.' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Registrar venta
    const saleInsertResult = await db.insert(sales).values({
      productId: productId,
      customerId: customerId,
      quantity,
      user_id: userId,
    });

    if (!saleInsertResult) {
      return new Response(
        JSON.stringify({
          error: 'Error al registrar la venta. Stock revertido.',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Venta registrada exitosamente.' }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error al registrar la venta:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}