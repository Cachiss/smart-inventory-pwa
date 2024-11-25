import { CustomerForm } from '@/components/customer/CreateForm';
import { ClientForm } from '@/components/products/CreateForm';
import { auth } from '@/lib/auth';
import React from 'react';

export default async function CreateClientCard() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return <div>Debes estar autenticado para crear productos.</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Crear nuevo cliente</h2>
      </div>
      <CustomerForm userId={user.email!} />
    </div>
  );
}

