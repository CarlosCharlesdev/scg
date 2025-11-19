'use client';
import { useState, useEffect } from 'react';
import DropdownMenu, { DropdownItem } from '../dropdown-menu';

export default function Home() {
  const [gados, setGados] = useState([]);
  const [qualidades, setQualidades] = useState([]);
  const [form, setForm] = useState({
    identificacao: '',
    sexo: 'M',
    raca: '',
    data_nascimento: '',
    qualidade_id: '',
    pai_identificador: '',
    mae_identificador: '',
    peso: ''
  });
  const [editando, setEditando] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalQualidadeAberto, setModalQualidadeAberto] = useState(false);
  const [novaQualidade, setNovaQualidade] = useState('');
  const [editandoQualidade, setEditandoQualidade] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingQualidade, setLoadingQualidade] = useState(false);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    carregarGados();
    carregarQualidades();
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

  const carregarQualidades = async () => {
    try {
      const res = await fetch('/api/qualidade');
      const data = await res.json();
      setQualidades(data);
    } catch (error) {
      alert('Erro ao carregar qualidades: ' + error.message);
    }
  };

  // Criar ou atualizar gado
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
        setModalAberto(false);
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

  // Criar ou atualizar qualidade
  const handleSubmitQualidade = async (e) => {
    e.preventDefault();
    setLoadingQualidade(true);

    try {
      const url = editandoQualidade ? `/api/qualidade` : '/api/qualidade';
      const method = editandoQualidade ? 'PUT' : 'POST';
      const body = editandoQualidade 
        ? { id: editandoQualidade, qualidade: novaQualidade }
        : { qualidade: novaQualidade };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        const qualidadeCriada = await res.json();
        alert(editandoQualidade ? 'Qualidade atualizada!' : 'Qualidade cadastrada com sucesso!');
        setNovaQualidade('');
        setEditandoQualidade(null);
        await carregarQualidades();
        // Seleciona automaticamente a qualidade recém-criada/atualizada
        setForm({...form, qualidade_id: qualidadeCriada.id});
      } else {
        const error = await res.json();
        alert('Erro: ' + error.error);
      }
    } catch (error) {
      alert('Erro: ' + error.message);
    }
    setLoadingQualidade(false);
  };

  // Deletar qualidade
  const handleDeletarQualidade = async (id) => {
    if (!confirm('Tem certeza que deseja deletar esta qualidade?')) return;

    try {
      const res = await fetch('/api/qualidade', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (res.ok) {
        alert('Qualidade deletada com sucesso!');
        await carregarQualidades();
        // Se a qualidade deletada estava selecionada, limpa a seleção
        if (form.qualidade_id === id.toString()) {
          setForm({...form, qualidade_id: ''});
        }
      } else {
        const error = await res.json();
        alert('Erro: ' + error.error);
      }
    } catch (error) {
      alert('Erro ao deletar: ' + error.message);
    }
  };

  // Editar qualidade
  const handleEditarQualidade = (qualidade) => {
    setNovaQualidade(qualidade.qualidade);
    setEditandoQualidade(qualidade.id);
  };

  // Função auxiliar para formatar a data para YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return '';
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) return dateString;
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  // Editar
  const handleEditar = (gado) => {
    const formattedDate = formatDate(gado.data_nascimento);
    
    setForm({
      identificacao: gado.identificacao,
      sexo: gado.sexo,
      raca: gado.raca || '',
      data_nascimento: formattedDate,
      qualidade_id: gado.qualidade_id || '',
      pai_identificador: gado.pai_identificador || '',
      mae_identificador: gado.mae_identificador || '',
      peso: gado.peso || ''
    });
    setEditando(gado.id);
    setModalAberto(true);
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
    setModalAberto(false);
    setForm({
      identificacao: '',
      sexo: 'M',
      raca: '',
      data_nascimento: '',
      qualidade_id: '',
      pai_identificador: '',
      mae_identificador: '',
      peso: ''
    });
    setEditando(null);
  };

  const limparFormQualidade = () => {
    setNovaQualidade('');
    setEditandoQualidade(null);
  };
  
  return ( 
    <div className="flex flex-col min-h-screen bg-[#F7ECE1]">
      <header className="bg-gradient-to-r from-[#2d5016] to-[#4a7c2c] w-full mb-10">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-4xl font-bold text-white">
            Sistema de Controle do Gado
          </h1>
          <button onClick={() => window.location.replace('/')} className="cursor-pointer text-white p-2 rounded-lg transition border border-white duration-200 ease-in-out hover:ring-offset-1 hover:bg-white hover:text-black pl-4 pr-4">
            Sair
          </button>
        </div>
        <hr className="border-[#2d5016] flex"></hr>
        <nav className="bg-gradient-to-r from-[#2d5016] to-[#4a7c2c] p-2 pl-1 pt-0">
          <div className="mx-auto flex space-x-1">
            <DropdownMenu title="Gado">
              <DropdownItem href="/gados">Cadastrar Gado</DropdownItem>
              <DropdownItem href="/gado-situacoes">Situação Gado</DropdownItem>
            </DropdownMenu>
            
            <DropdownMenu title="Vacinas">
              <DropdownItem href="/vacinas">Vacinas</DropdownItem>
              <DropdownItem href="/gado-vacinados">Gados Vacinados</DropdownItem>
            </DropdownMenu>
          </div>
        </nav>
      </header>

      <div className="flex-grow">
        <div className="max-w-6xl mx-auto">
          {/* Barra de Busca e Botão Novo Gado */}
          <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar gado..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="w-full px-4 py-2 pl-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none text-gray-700"
                  />
                </div>
              </div>
              <button
                onClick={() => { limparForm(); setModalAberto(true); }}
                className="bg-[#4a7c2c] hover:bg-[#2d5016] text-white font-bold py-2 px-6 rounded-lg transition whitespace-nowrap cursor-pointer"
              >
                + Novo Gado
              </button>
            </div>
          </div>

          {/* Tabela */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-10">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-t from-[#2d5016] to-[#4a7c2c] text-white">
                  <tr>
                    <th className="px-4 py-3 text-center">Ações</th>
                    <th className="px-4 py-3 text-left">Identificação</th>
                    <th className="px-4 py-3 text-left">Sexo</th>
                    <th className="px-4 py-3 text-left">Raça</th>
                    <th className="px-4 py-3 text-left">Peso (kg)</th>
                    <th className="px-4 py-3 text-left">Qualidade</th>
                    <th className="px-4 py-3 text-left">Nascimento</th>
                    <th className="px-4 py-3 text-left">Pai</th>
                    <th className="px-4 py-3 text-left">Mãe</th>
                  </tr>
                </thead>
                <tbody>
                  {gados
                    .filter(gado => gado.identificacao.toLowerCase().startsWith(busca.toLowerCase()))
                    .length === 0 ? (
                    <tr>
                      <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                        {busca ? 'Nenhum gado encontrado com essa identificação' : 'Nenhum gado cadastrado ainda'}
                      </td>
                    </tr>
                  ) : (
                    gados
                      .filter(gado => gado.identificacao.toLowerCase().startsWith(busca.toLowerCase()))
                      .map((gado, index) => (
                        <tr key={gado.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-4 py-3">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => handleEditar(gado)}
                                className="text-white px-3 py-1 rounded transition text-sm cursor-pointer"
                                title="Editar"
                              >
                                <img src="lapis.png" alt="Editar" className="w-4 h-4"></img>
                              </button>
                              <button
                                onClick={() => handleDeletar(gado.id)}
                                className="text-white px-3 py-1 rounded transition text-sm cursor-pointer"
                                title="Deletar"
                              >
                                <img src="lixo.png" alt="Deletar" className="w-4 h-4"></img>
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-700">{gado.identificacao}</td>
                          <td className="px-4 py-3 text-gray-700">{gado.sexo === 'M' ? '♂️' : '♀️'}</td>
                          <td className="px-4 py-3 text-gray-700">{gado.raca || '-'}</td>
                          <td className="px-4 py-3 text-gray-700">{gado.peso || '-'}</td>
                          <td className="px-4 py-3 text-gray-700">{gado.qualidade_nome || '-'}</td>
                          <td className="px-4 py-3 text-gray-700">
                            {gado.data_nascimento ? new Date(gado.data_nascimento).toLocaleDateString('pt-BR') : '-'}
                          </td>
                          <td className="px-4 py-3 text-gray-700">{gado.pai_identificador || '-'}</td>
                          <td className="px-4 py-3 text-gray-700">{gado.mae_identificador || '-'}</td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div> 
        </div>
      </div>

      {/* Modal de Cadastro/Edição de Gado */}
      {modalAberto && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-[2px] bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-auto max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-[#2d5016] to-[#4a7c2c] text-white px-6 py-4 rounded-t-lg flex justify-between items-center sticky top-0 z-10">
              <h2 className="text-2xl font-semibold">
                {editando ? 'Editar Gado' : 'Cadastrar Novo Gado'}
              </h2>
              <button 
                onClick={() => { setModalAberto(false); limparForm(); }}
                className="text-white hover:text-gray-200 text-2xl font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Identificação */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Identificação *
                  </label>
                  <input 
                    type="text"
                    required
                    value={form.identificacao}
                    onChange={(e) => setForm({...form, identificacao: e.target.value})}
                    className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none"
                  />
                </div>

                {/* Sexo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sexo *
                  </label>
                  <select
                    required
                    value={form.sexo}
                    onChange={(e) => setForm({...form, sexo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none">
                    <option value="M" className='text-gray-700'>Macho</option>
                    <option value="F" className='text-gray-700'>Fêmea</option>
                  </select>
                </div>

                {/* Raça */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Raça
                  </label>
                  <select
                    value={form.raca}
                    onChange={(e) => setForm({...form, raca: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none">
                    <option value="" className='text-gray-700'></option>
                    <option value="Nelore" className='text-gray-700'>Nelore</option>
                    <option value="Angus" className='text-gray-700'>Angus</option>
                  </select>
                </div>

                {/* Data de nascimento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de nascimento *
                  </label>
                  <input
                    required
                    type="date"
                    value={form.data_nascimento}
                    onChange={(e) => setForm({...form, data_nascimento: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none"
                  />
                </div>
                
                {/* Qualidade - Com botão + */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Qualidade
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={form.qualidade_id}
                      onChange={(e) => setForm({...form, qualidade_id: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none">
                      <option value="" className='text-gray-700'>Selecione...</option>
                      {qualidades.map((qual) => (
                        <option key={qual.id} value={qual.id} className='text-gray-700'>
                          {qual.qualidade}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => { limparFormQualidade(); setModalQualidadeAberto(true); }}
                      className="bg-[#4a7c2c] hover:bg-[#2d5016] text-white font-bold px-4 py-2 rounded-lg transition cursor-pointer"
                      title="Adicionar nova qualidade"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Peso */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.peso}
                    onChange={(e) => setForm({...form, peso: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none"
                    placeholder="Ex: 500.75"
                  />
                </div>

                {/* Identificação do pai */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Identificação do pai (Macho)
                  </label>
                  <select
                    value={form.pai_identificador}
                    onChange={(e) => setForm({...form, pai_identificador: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none"
                  >
                    <option value="" className='text-gray-700'></option>
                    {gados.filter(g => g.sexo === 'M' && g.id !== Number(editando)).map((gado) => (
                      <option key={gado.id} value={gado.identificacao} className='text-gray-700'>
                        {gado.identificacao} {gado.raca ? `- ${gado.raca}` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Identificação da mãe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Identificação da mãe (Fêmea)
                  </label>
                  <select
                    value={form.mae_identificador}
                    onChange={(e) => setForm({...form, mae_identificador: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none"
                  >
                    <option value="" className='text-gray-700'></option>
                    {gados.filter(g => g.sexo === 'F' && g.id !== Number(editando)).map((gado) => (
                      <option key={gado.id} value={gado.identificacao} className='text-gray-700'>
                        {gado.identificacao} {gado.raca ? `- ${gado.raca}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 hover:bg-[#2d5016] bg-[#4a7c2c] text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-gray-400 cursor-pointer"
                >
                  {loading ? 'Processando...' : (editando ? 'Atualizar' : 'Cadastrar')}
                </button>
                
                <button
                  type="button"
                  onClick={() => { setModalAberto(false); limparForm(); }}
                  className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition cursor-pointer"
                >
                  Cancelar
                </button>	
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Cadastro/Edição de Qualidade com Mini-Grid */}
      {modalQualidadeAberto && (
        <div className="fixed inset-0 backdrop-blur-[2px] bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-[#2d5016] to-[#4a7c2c] text-white px-6 py-4 rounded-t-lg flex justify-between items-center sticky top-0 z-10">
              <h2 className="text-xl font-semibold">
                {editandoQualidade ? 'Editar Qualidade' : 'Nova Qualidade'}
              </h2>
              <button 
                onClick={() => { setModalQualidadeAberto(false); limparFormQualidade(); }}
                className="text-white hover:text-gray-200 text-2xl font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {/* Formulário de Cadastro/Edição */}
              <form onSubmit={handleSubmitQualidade} className="mb-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Nome da Qualidade *
                  </label>
                  <input 
                    type="text"
                    required
                    value={novaQualidade}
                    onChange={(e) => setNovaQualidade(e.target.value)}
                    className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none"
                    placeholder="Ex: Excelente, Regular, etc."
                    autoFocus
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loadingQualidade}
                    className="flex-1 hover:bg-[#2d5016] bg-[#4a7c2c] text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-gray-400 cursor-pointer"
                  >
                    {loadingQualidade ? 'Processando...' : (editandoQualidade ? 'Atualizar' : 'Cadastrar')}
                  </button>
                  
                  {editandoQualidade && (
                    <button
                      type="button"
                      onClick={() => limparFormQualidade()}
                      className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition cursor-pointer"
                    >
                      Cancelar Edição
                    </button>
                  )}
                </div>
              </form>

              {/* Mini-Grid de Qualidades */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Qualidades Cadastradas</h3>
                
                {qualidades.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    Nenhuma qualidade cadastrada ainda
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-gray-700 font-semibold">Nome</th>
                          <th className="px-4 py-3 text-center text-gray-700 font-semibold">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {qualidades.map((qual, index) => (
                          <tr key={qual.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="px-4 py-3 text-gray-700">{qual.qualidade}</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2 justify-center">
                                <button
                                  type="button"
                                  onClick={() => handleEditarQualidade(qual)}
                                  className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded transition text-sm cursor-pointer"
                                  title="Editar"
                                >
                                  <img src="lapis.png" alt="Editar" className="w-4 h-4"></img>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeletarQualidade(qual.id)}
                                  className="text-red-600 hover:text-red-800 px-3 py-1 rounded transition text-sm cursor-pointer"
                                  title="Deletar"
                                >
                                  <img src="lixo.png" alt="Deletar" className="w-4 h-4"></img>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Botão Fechar */}
              <div className="flex gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => { setModalQualidadeAberto(false); limparFormQualidade(); }}
                  className="flex-1 px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition cursor-pointer"
                >
                  Fechar
                </button>	
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}