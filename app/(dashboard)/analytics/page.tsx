// app/sales/page.tsx
import { auth } from "@/lib/auth";
import { getSales } from "@/lib/db";
import SalesChart from "./SalesChart";

export default async function SalesPage() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return <p>No autorizado</p>;
  }

  const { sales } = await getSales(user.email!);

  return (
    <div className="">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Analíticas</h1>
      
      <SalesChart sales={sales} />
    </div>
  );
}