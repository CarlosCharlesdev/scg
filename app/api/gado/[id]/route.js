import { Pool } from 'pg';
import { NextResponse } from 'next/server';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'projetTest',
  user: 'postgres',
  password: '25052003',
});

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();
    const { identificacao, sexo, raca, data_nascimento, pai_id, mae_id } = data;
    
    const result = await pool.query(
      `UPDATE gado 
       SET identificacao = $1, sexo = $2, raca = $3, 
           data_nascimento = $4, pai_id = $5, mae_id = $6
       WHERE id = $7 RETURNING *`,
      [identificacao, sexo, raca, data_nascimento, pai_id || null, mae_id || null, id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Gado não encontrado' }, { status: 404 });
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Deletar gado
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const result = await pool.query('DELETE FROM gado WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Gado não encontrado' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Gado deletado com sucesso' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}