'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [gados, setGados] = useState([]);
  const [form, setForm] = useState({
    identificacao: '',
    nome: '',
    sexo: 'M',
    raca: '',
    data_nascimento: '',
    pai_id: '',
    mae_id: ''
  });
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarGados();
  }, []);

  const carregarGados = async () => {
    try {
      const res = await fetch('/api/gado');
      const data = await res.json();
      setGados(data);
    } catch (error) {
      alert('Erro ao carregar gados: ' + error.message);
    }
  };

  // Criar ou atualizar
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editando ? `/api/gado/${editando}` : '/api/gado';
      const method = editando ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        alert(editando ? 'Gado atualizado!' : 'Gado cadastrado!');
        limparForm();
        carregarGados();
      } else {
        const error = await res.json();
        alert('Erro: ' + error.error);
      }
    } catch (error) {
      alert('Erro: ' + error.message);
    }
    setLoading(false);
  };

  // Editar
  const handleEditar = (gado) => {
    setForm({
      identificacao: gado.identificacao,
      nome: gado.nome || '',
      sexo: gado.sexo,
      raca: gado.raca || '',
      data_nascimento: gado.data_nascimento || '',
      pai_id: gado.pai_id || '',
      mae_id: gado.mae_id || ''
    });
    setEditando(gado.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Deletar
  const handleDeletar = async (id) => {
    if (!confirm('Tem certeza que deseja deletar?')) return;

    try {
      const res = await fetch(`/api/gado/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Gado deletado!');
        carregarGados();
      }
    } catch (error) {
      alert('Erro ao deletar: ' + error.message);
    }
  };

  const limparForm = () => {
    setForm({
      identificacao: '',
      nome: '',
      sexo: 'M',
      raca: '',
      data_nascimento: '',
      pai_id: '',
      mae_id: ''
    });
    setEditando(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          🐄 Gestão de Gado
        </h1>

        {/* Formulário */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {editando ? '✏️ Editar Gado' : '➕ Cadastrar Novo Gado'}
          </h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Identificação *
              </label>
              <input
                type="text"
                required
                value={form.identificacao}
                onChange={(e) => setForm({...form, identificacao: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <input
                type="text"
                value={form.nome}
                onChange={(e) => setForm({...form, nome: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sexo *
              </label>
              <select
                required
                value={form.sexo}
                onChange={(e) => setForm({...form, sexo: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="M">Macho</option>
                <option value="F">Fêmea</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Raça
              </label>
              <input
                type="text"
                value={form.raca}
                onChange={(e) => setForm({...form, raca: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Nascimento
              </label>
              <input
                type="date"
                value={form.data_nascimento}
                onChange={(e) => setForm({...form, data_nascimento: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID do Pai
              </label>
              <input
                type="number"
                value={form.pai_id}
                onChange={(e) => setForm({...form, pai_id: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID da Mãe
              </label>
              <input
                type="number"
                value={form.mae_id}
                onChange={(e) => setForm({...form, mae_id: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-gray-400"
              >
                {loading ? 'Processando...' : (editando ? 'Atualizar' : 'Cadastrar')}
              </button>
              
              {editando && (
                <button
                  type="button"
                  onClick={limparForm}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Identificação</th>
                  <th className="px-4 py-3 text-left">Nome</th>
                  <th className="px-4 py-3 text-left">Sexo</th>
                  <th className="px-4 py-3 text-left">Raça</th>
                  <th className="px-4 py-3 text-left">Nascimento</th>
                  <th className="px-4 py-3 text-left">Pai</th>
                  <th className="px-4 py-3 text-left">Mãe</th>
                  <th className="px-4 py-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {gados.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                      Nenhum gado cadastrado ainda
                    </td>
                  </tr>
                ) : (
                  gados.map((gado, index) => (
                    <tr key={gado.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-4 py-3">{gado.id}</td>
                      <td className="px-4 py-3 font-semibold">{gado.identificacao}</td>
                      <td className="px-4 py-3">{gado.nome || '-'}</td>
                      <td className="px-4 py-3">{gado.sexo === 'M' ? '♂️ Macho' : '♀️ Fêmea'}</td>
                      <td className="px-4 py-3">{gado.raca || '-'}</td>
                      <td className="px-4 py-3">
                        {gado.data_nascimento ? new Date(gado.data_nascimento).toLocaleDateString('pt-BR') : '-'}
                      </td>
                      <td className="px-4 py-3">{gado.nome_pai || '-'}</td>
                      <td className="px-4 py-3">{gado.nome_mae || '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleEditar(gado)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition text-sm"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeletar(gado.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition text-sm"
                          >
                            Deletar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}