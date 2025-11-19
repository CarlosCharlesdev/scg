import { Pool } from 'pg';
import { NextResponse } from 'next/server';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'scg01',
  user: 'postgres',
  password: '25052003',
});

// GET - Buscar todas as qualidades
export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM qualidade ORDER BY id ASC');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Criar nova qualidade
export async function POST(request) {
  try {
    const { qualidade } = await request.json();

    if (!qualidade || qualidade.trim() === '') {
      return NextResponse.json({ error: 'O campo qualidade é obrigatório.' }, { status: 400 });
    }

    const result = await pool.query(
      'INSERT INTO qualidade (qualidade) VALUES ($1) RETURNING *',
      [qualidade]
    );
    return NextResponse.json(result.rows[0], { status: 201 });

  } catch (error) {
    if (error.code === '23505') { // Código de erro para violação de UNIQUE
      return NextResponse.json({ 
        error: `A qualidade "${qualidade}" já existe.` 
      }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Atualizar qualidade
export async function PUT(request) {
  try {
    const { id, qualidade } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'O ID da qualidade é obrigatório para atualização.' }, { status: 400 });
    }
    if (!qualidade || qualidade.trim() === '') {
      return NextResponse.json({ error: 'O campo qualidade é obrigatório.' }, { status: 400 });
    }

    const result = await pool.query(
      'UPDATE qualidade SET qualidade = $1 WHERE id = $2 RETURNING *',
      [qualidade, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: `Qualidade com ID ${id} não encontrada.` }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);

  } catch (error) {
    if (error.code === '23505') { // Código de erro para violação de UNIQUE
      return NextResponse.json({ 
        error: `A qualidade "${qualidade}" já existe.` 
      }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Deletar qualidade
export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'O ID da qualidade é obrigatório para exclusão.' }, { status: 400 });
    }

    // Verifica se a qualidade está sendo usada por algum gado
    const usageCheck = await pool.query('SELECT 1 FROM gado WHERE qualidade_id = $1 LIMIT 1', [id]);
    if (usageCheck.rows.length > 0) {
      return NextResponse.json({ error: 'Não é possível excluir esta qualidade, pois ela está associada a um ou mais gados.' }, { status: 400 });
    }

    const result = await pool.query('DELETE FROM qualidade WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: `Qualidade com ID ${id} não encontrada.` }, { status: 404 });
    }

    return NextResponse.json({ message: 'Qualidade excluída com sucesso.' });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}