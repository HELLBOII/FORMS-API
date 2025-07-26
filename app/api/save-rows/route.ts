import mysql from 'mysql2/promise';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface FormRow {
  name: string;
  amount: number;
}

export async function POST(request: NextRequest) {
  try {
    const { rows }: { rows: FormRow[] } = await request.json();

    if (!Array.isArray(rows)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Connect to your external MySQL database using env variables
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT)
    });

    // Clear existing data
    await connection.query('DELETE FROM form_rows');

    // Insert new data if any
    if (rows.length > 0) {
      const values = rows.map(row => [row.name, row.amount]);
      await connection.query('INSERT INTO form_rows (name, amount) VALUES ?', [values]);
    }

    await connection.end();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Database operation failed' },
      { status: 500 }
    );
  }
}