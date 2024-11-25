import 'server-only';

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import {
  pgTable,
  text,
  numeric,
  integer,
  timestamp,
  pgEnum,
  serial,
} from 'drizzle-orm/pg-core';
import { count, eq, ilike, and } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';

export const db = drizzle(neon(process.env.POSTGRES_URL!));

export const statusEnum = pgEnum('status', ['active', 'inactive', 'archived']);

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  imageUrl: text('image_url').notNull(),
  name: text('name').notNull(),
  status: statusEnum('status').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').notNull(),
  availableAt: timestamp('available_at').notNull(),
  userId: text('userid').notNull(),
});

export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  address: text('address'),
  phone: text('phone'),
  sellerId: text('sellerid').notNull(),
});

export const sales = pgTable('sales', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull(),
  customerId: integer('customer_id').notNull(),
  user_id: text('user_id').notNull(),
  quantity: integer('quantity')
});

export type SelectProduct = typeof products.$inferSelect;
export const insertProductSchema = createInsertSchema(products);

export async function getProducts(
  search: string,
  offset: number,
  email: string
): Promise<{
  products: SelectProduct[];
  newOffset: number | null;
  totalProducts: number;
}> {
  if (search) {
    return {
      products: await db
        .select()
        .from(products)
        .where(and(eq(products.userId, email), ilike(products.name, `%${search}%`)))
        .limit(1000),
      newOffset: null,
      totalProducts: 0
    };
  }

  if (offset === null) {
    return { products: [], newOffset: null, totalProducts: 0 };
  }

  let totalProducts = await db.select({ count: count() }).from(products);
  let moreProducts = await db.select().from(products).offset(offset);
  let newOffset = moreProducts.length >= 5 ? offset + 5 : null;

  return {
    products: moreProducts,
    newOffset,
    totalProducts: totalProducts[0].count
  };
}

export async function deleteProductById(id: number) {
  await db.delete(products).where(eq(products.id, id));
}


export async function insertProduct(product: any) {
  console.log('product', product);
  await db.insert(products).values([product]);
}

export async function updateProductById(id: number, product: any) {
  await db.update(products).set(product).where(eq(products.id, id));
}

export async function getProductById(id: number) {
  return await db.select().from(products).where(eq(products.id, id));
}

export async function getCustomers(email: string) {
  // return customers, newOffset, totalCustomers
  return {
    customers: await db.select().from(customers),
    newOffset: null,
    totalCustomers: 0
  };
}


export async function getSales(email: string) {
  // Asumimos que tienes una relación entre las tablas sales, customers y products
  const salesData = await db
    .select({
        id: sales.id,
        quantity: sales.quantity,
        customerId: customers.id,
        productId: products.id,
        customerName: customers.name,
        productName: products.name
    })
    .from(sales)
    .leftJoin(customers, eq(sales.customerId, customers.id)) // Unión con la tabla customers
    .leftJoin(products, eq(sales.productId, products.id)) // Unión con la tabla products
  return {
    sales: salesData,
    newOffset: null,
    totalSales: salesData.length
  };
}

export async function insertCustomer(customer: any) {
  await db.insert(customers).values([customer]);
}