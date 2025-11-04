import { Pool } from 'pg';
import { NextResponse } from 'next/server';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: '25052003',
});

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        g.*,
        p.nome as nome_pai,
        m.nome as nome_mae
      FROM gado g
      LEFT JOIN gado p ON g.pai_id = p.id
      LEFT JOIN gado m ON g.mae_id = m.id
      ORDER BY g.id
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { identificacao, nome, sexo, raca, data_nascimento, pai_id, mae_id } = data;
    
    const result = await pool.query(
      `INSERT INTO gado (identificacao, nome, sexo, raca, data_nascimento, pai_id, mae_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [identificacao, nome, sexo, raca, data_nascimento, pai_id || null, mae_id || null]
    );
    
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}