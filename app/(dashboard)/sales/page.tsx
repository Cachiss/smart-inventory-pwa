import { auth } from "@/lib/auth";
import { getCustomers, getProducts } from "@/lib/db";
import SalesForm from "./SalesForm";

export default async function SalesPage() {
  const session = await auth();
  const user = session?.user;

  const { products } = await getProducts("", 0, user!.email!);
  const { customers } = await getCustomers(user!.email!);

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Registrar Venta</h1>
      <SalesForm products={products} customers={customers} userId={user!.email!}  />
    </div>
  );
}