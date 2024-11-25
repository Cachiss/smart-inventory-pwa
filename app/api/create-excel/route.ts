import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { db } from 'lib/db';
import ExcelJS from 'exceljs';
import { products } from 'lib/db';

export async function GET() {
  try {
    const results = await db.select().from(products).execute();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Datos');

    if (results.length > 0) {
      worksheet.columns = Object.keys(results[0]).map((key) => ({
        header: key,
        key,
        width: 20,
      }));
    }

    results.forEach((row) => {
      worksheet.addRow(row);
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="data.xlsx"',
      },
    });
  } catch (error) {
    console.error('Error generando Excel:', error);
    return NextResponse.json(
      { message: 'Error generando Excel', error: (error as Error).message },
      { status: 500 }
    );
  }
}