'use client';
import { useState, useEffect } from 'react';
import DropdownMenu, { DropdownItem } from '../dropdown-menu';

// Modal para Cadastro/Edição de Vacinas
const ModalVacina = ({ isOpen, onClose, form, setForm, editando, loading, handleSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-[2px] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="bg-gradient-to-r from-[#2d5016] to-[#4a7c2c] text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-2xl font-semibold">
            {editando ? '✏️ Editar Vacina' : '➕ Nova Vacina'}
          </h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Nome da Vacina *
              </label>
              <input 
                type="text"
                required
                value={form.nome}
                onChange={(e) => setForm({...form, nome: e.target.value})}
                disabled={editando ? true : false}
                className={`w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none ${editando ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                title={editando ? 'O nome não pode ser alterado ao editar' : ''}
              />
              {editando && (
                <p className="text-xs text-gray-500 mt-1">
                  ⚠️ O nome da vacina não pode ser alterado
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Periodicidade (dias)
              </label>
              <input
                type="number"
                value={form.periodicidade_dias}
                onChange={(e) => setForm({...form, periodicidade_dias: e.target.value})}
                className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 hover:bg-[#2d5016] bg-[#4a7c2c] text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-gray-400"
            >
              {loading ? 'Processando...' : (editando ? 'Atualizar' : 'Cadastrar')}
            </button>
            
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente Principal
export default function VacinasPage() {
  const [vacinas, setVacinas] = useState([]);
  const [form, setForm] = useState({
    nome: '',
    periodicidade_dias: ''
  });
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    carregarVacinas();
  }, []);

  const carregarVacinas = async () => {
    try {
      const res = await fetch('/api/vacina');
      const data = await res.json();
      setVacinas(data);
    } catch (error) {
      alert('Erro ao carregar vacinas: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editando ? `/api/vacina/${encodeURIComponent(editando)}` : '/api/vacina';
      const method = editando ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        alert(editando ? 'Vacina atualizada!' : 'Vacina cadastrada!');
        limparForm();
        setModalAberto(false);
        carregarVacinas();
      } else {
        const error = await res.json();
        alert('Erro: ' + (error.error || 'Erro desconhecido'));
      }
    } catch (error) {
      alert('Erro: ' + error.message);
    }
    setLoading(false);
  };

  const handleEditar = (vacina) => {
    setForm({
      nome: vacina.nome,
      periodicidade_dias: vacina.periodicidade_dias || ''
    });
    setEditando(vacina.nome);
    setModalAberto(true);
  };

  const handleDeletar = async (nomeVacina) => {
    if (!confirm(`Tem certeza que deseja deletar a vacina "${nomeVacina}"?`)) return;

    try {
      const res = await fetch(`/api/vacina/${encodeURIComponent(nomeVacina)}`, { method: 'DELETE' });
      
      if (res.ok) {
        alert('Vacina deletada!');
        carregarVacinas();
      } else {
        const error = await res.json();
        alert('Erro ao deletar: ' + (error.error || 'Erro desconhecido'));
      }
    } catch (error) {
      alert('Erro ao deletar: ' + error.message);
    }
  };

  const limparForm = () => {
    setForm({
      nome: '',
      periodicidade_dias: ''
    });
    setEditando(null);
  };

  const abrirModalNovo = () => {
    limparForm();
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    limparForm();
  };

  // Filtrar vacinas pela busca
  const vacinasFiltradas = vacinas.filter(vacina =>
    vacina.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F7ECE1]">
      <header className="bg-gradient-to-r from-[#2d5016] to-[#4a7c2c] w-full mb-10">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-4xl font-bold text-white">
            Sistema de Vacinação de Gado
          </h1>
          <button className="cursor-pointer text-white hover:text-gray-300 transition duration-150 ease-in-out">
            Sair
          </button>
        </div>
        <hr />
        <nav className="bg-gradient-to-r from-[#2d5016] to-[#4a7c2c] p-2">
          <div className="max-w-7xl mx-auto flex space-x-4">
            <DropdownMenu title="Gado">
              <DropdownItem href="/">Cadastrar Gado</DropdownItem>
              <DropdownItem href="/">Lista de Gados</DropdownItem>
            </DropdownMenu>
        
            <DropdownMenu title="Vacinas">
              <DropdownItem href="/vacinas">Vacinas</DropdownItem>
              <DropdownItem href="/gado-vacinados">Gados Vacinados</DropdownItem>
            </DropdownMenu>
          </div>
        </nav>
      </header>

      <div className="max-w-6xl mx-auto px-4">
        {/* Barra de Busca e Botão Nova Vacina */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar vacina..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none text-gray-700"
                />
                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
              </div>
            </div>
            <button
              onClick={abrirModalNovo}
              className="bg-[#4a7c2c] hover:bg-[#2d5016] text-white font-bold py-2 px-6 rounded-lg transition whitespace-nowrap"
            >
              + Nova Vacina
            </button>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-t from-[#2d5016] to-[#4a7c2c] text-white">
                <tr>
                  <th className="px-4 py-3 text-left">AÇÕES</th>
                  <th className="px-4 py-3 text-left">NOME</th>
                  <th className="px-4 py-3 text-left">PERIODICIDADE (DIAS)</th>
                </tr>
              </thead>
              <tbody>
                {vacinasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                      {busca ? 'Nenhuma vacina encontrada' : 'Nenhuma vacina cadastrada ainda'}
                    </td>
                  </tr>
                ) : (
                  vacinasFiltradas.map((vacina, index) => (
                    <tr key={vacina.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditar(vacina)}
                            className=" text-white px-3 py-1 rounded transition text-sm"
                            title={`Editar ${vacina.nome}`}
                          >
                             <img src="lapis.png" alt="Editar" className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletar(vacina.nome)}
                            className=" text-white px-3 py-1 rounded transition text-sm"
                            title={`Deletar ${vacina.nome}`}
                          >
                            <img src="lixo.png" alt="Deletar" className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-700">{vacina.nome}</td>
                      <td className="px-4 py-3 text-gray-700">{vacina.periodicidade_dias || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      <ModalVacina
        isOpen={modalAberto}
        onClose={fecharModal}
        form={form}
        setForm={setForm}
        editando={editando}
        loading={loading}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}