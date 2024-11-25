import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductsTable } from '../products-table';
import { getCustomers, getProducts } from '@/lib/db';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { CustomersTable } from '../customers-table';

export default async function ProductsPage(
  props: {
    searchParams: Promise<{ q: string; offset: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const search = searchParams.q ?? '';
  const offset = searchParams.offset ?? 0;
  let session = await auth();
  let user = session?.user;

  const { customers, newOffset, totalCustomers } = await getCustomers(
    user!.email!
  ); 
  console.log('customers', customers);

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <div className="ml-auto flex items-center gap-2">
          <Link href="/customers/create">
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Agregar Cliente
              </span>
            </Button>
          </Link>
        </div>
      </div>
      <TabsContent value="all">
        <CustomersTable
          customers={customers}
          offset={newOffset ?? 0}
          totalCustomers={totalCustomers}
        />
      </TabsContent>
    </Tabs>
  );
}
