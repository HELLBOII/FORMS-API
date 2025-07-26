import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { rows } = req.body;
  if (!Array.isArray(rows)) return res.status(400).send('Invalid data');

  // Connect to your external MySQL database using env variables
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  await connection.query('DELETE FROM form_rows');
  if (rows.length > 0) {
    const values = rows.map(row => [row.name, row.amount]);
    await connection.query('INSERT INTO form_rows (name, amount) VALUES ?', [values]);
  }
  await connection.end();

  res.json({ success: true });
}