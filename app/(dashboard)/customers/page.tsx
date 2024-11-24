import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export default function CustomersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clientes</CardTitle>
        <CardDescription>Vea todos los clientes y sus ordenes.</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
