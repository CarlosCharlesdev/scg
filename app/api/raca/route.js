import { Pool } from 'pg';
import { NextResponse } from 'next/server';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'scg01',
  user: 'postgres',
  password: '25052003',
});

// GET - Buscar todas as raças
export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM raca ORDER BY id ASC');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Criar nova raça
export async function POST(request) {
  try {
    const { nome } = await request.json();

    if (!nome || nome.trim() === '') {
      return NextResponse.json({ error: 'O campo nome da raça é obrigatório.' }, { status: 400 });
    }

    const result = await pool.query(
      'INSERT INTO raca (nome) VALUES ($1) RETURNING *',
      [nome]
    );
    return NextResponse.json(result.rows[0], { status: 201 });

  } catch (error) {
    if (error.code === '23505') { // Código de erro para violação de UNIQUE
      return NextResponse.json({ 
        error: `A raça "${nome}" já existe.` 
      }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Atualizar raça
export async function PUT(request) {
  try {
    const { id, nome } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'O ID da raça é obrigatório para atualização.' }, { status: 400 });
    }
    if (!nome || nome.trim() === '') {
      return NextResponse.json({ error: 'O campo nome da raça é obrigatório.' }, { status: 400 });
    }

    const result = await pool.query(
      'UPDATE raca SET nome = $1 WHERE id = $2 RETURNING *',
      [nome, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: `Raça com ID ${id} não encontrada.` }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);

  } catch (error) {
    if (error.code === '23505') { // Código de erro para violação de UNIQUE
      return NextResponse.json({ 
        error: `A raça "${nome}" já existe.` 
      }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Deletar raça
export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'O ID da raça é obrigatório para exclusão.' }, { status: 400 });
    }

    // Verifica se a raça está sendo usada por algum gado
    const usageCheck = await pool.query('SELECT 1 FROM gado WHERE id_raca = $1 LIMIT 1', [id]);
    if (usageCheck.rows.length > 0) {
      return NextResponse.json({ error: 'Não é possível excluir esta raça, pois ela está associada a um ou mais gados.' }, { status: 400 });
    }

    const result = await pool.query('DELETE FROM raca WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: `Raça com ID ${id} não encontrada.` }, { status: 404 });
    }

    return NextResponse.json({ message: 'Raça excluída com sucesso.' });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}