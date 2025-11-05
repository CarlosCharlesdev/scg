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
    const { id } = params;
    const data = await request.json();
    const { identificacao, nome, sexo, raca, data_nascimento, pai_id, mae_id } = data;
    
    const result = await pool.query(
      `UPDATE gado 
       SET identificacao = $1, nome = $2, sexo = $3, raca = $4, 
           data_nascimento = $5, pai_id = $6, mae_id = $7
       WHERE id = $8 RETURNING *`,
      [identificacao, nome, sexo, raca, data_nascimento, pai_id || null, mae_id || null, id]
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
    const { id } = params;
    const result = await pool.query('DELETE FROM gado WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Gado não encontrado' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Gado deletado com sucesso' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}