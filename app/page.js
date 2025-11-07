'use client';
import { useState, useEffect } from 'react';
import DropdownMenu, { DropdownItem } from './dropdown-menu';
import ModalGado from './modal-gado.tsx';

export default function Home() {
  const [gados, setGados] = useState([]);
  const [form, setForm] = useState({
    identificacao: '',
    sexo: 'M',
    raca: '',
    data_nascimento: '',
    pai_id: '',
    mae_id: ''
  });
  const [editando, setEditando] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState('');

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
        setModalAberto(false); // Fecha a modal após sucesso
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
      sexo: gado.sexo,
      raca: gado.raca || '',
      data_nascimento: gado.data_nascimento || '',
      pai_id: gado.pai_id || '',
      mae_id: gado.mae_id || ''
    });
    setEditando(gado.id);
    setModalAberto(true); // Abre a modal ao editar
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
    setModalAberto(false); // Fecha a modal ao limpar o formulário
    setForm({
      identificacao: '',
      sexo: 'M',
      raca: '',
      pai_id: '',
      mae_id: ''
    });
    setEditando(null);
  };
  
return ( 
<div className="flex flex-col min-h-screen bg-[#F7ECE1]">
  <header className="bg-gradient-to-r from-[#2d5016] to-[#4a7c2c] w-full mb-10">
    <div className="flex justify-between items-center p-4">
      <h1 className="text-4xl font-bold text-white">
        Sistema de Vacinação de Gado
      </h1>
      <button className="cursor-pointer text-white p-2 rounded-lg transition border border-white duration-200 ease-in-out hover:ring hover:ring-white hover:ring-offset-1 hover:bg-white hover:text-black ">
         Sair
      </button>
    </div>
    <hr className="border-[#2d5016] flex"></hr>
    <nav className="bg-gradient-to-r from-[#2d5016] to-[#4a7c2c] p-2 pl-1 pt-0">
      <div className="mx-auto flex space-x-1">
        
	        <DropdownMenu title="Gado">
	          <DropdownItem href="#">Cadastrar Gado</DropdownItem>
	        </DropdownMenu>
    
        <DropdownMenu title="Vacinas">
          <DropdownItem href="/vacinas">Vacinas</DropdownItem>
          <DropdownItem href="/gado-vacinados">Gados Vacinados</DropdownItem>
        </DropdownMenu>

      </div>
    </nav>
  </header>

		      {/* Formulário */}
		      
		      <div className="flex-grow">
		      <div className="max-w-6xl mx-auto">
	        {/* Barra de Busca e Botão Nova Vacina (Adaptado para Gado) */}
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
	              className="bg-[#4a7c2c] hover:bg-[#2d5016] text-white font-bold py-2 px-6 rounded-lg transition whitespace-nowrap"
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
	                  <th className="px-4 py-3 text-left">Nascimento</th>
	                  <th className="px-4 py-3 text-left">Pai</th>
	                  <th className="px-4 py-3 text-left">Mãe</th>
	                </tr>
              </thead>
	              <tbody>
	                {/* Filtrar gados pela identificação */}
	                {gados
	                  .filter(gado => gado.identificacao.toLowerCase().includes(busca.toLowerCase()))
	                  .length === 0 ? (
	                  <tr>
	                    <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
	                      {busca ? 'Nenhum gado encontrado com essa identificação' : 'Nenhum gado cadastrado ainda'}
	                    </td>
	                  </tr>
	                ) : (
	                  gados
	                    .filter(gado => gado.identificacao.toLowerCase().includes(busca.toLowerCase()))
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
			                            className="text-white px-3 py-1 rounded transition text-sm cursor-pointer cursor-pointer"
			                            title="Deletar"
			                          >
			                            <img src="lixo.png" alt="Deletar" className="w-4 h-4"></img>
			                          </button>
			                        </div>
			                      </td>
		                      <td className="px-4 py-3 text-gray-700">{gado.identificacao}</td>
		                      <td className="px-4 py-3 text-gray-700">{gado.sexo === 'M' ? '♂️' : '♀️'}</td>
		                      <td className="px-4 py-3 text-gray-700">{gado.raca || '-'}</td>
		                      <td className="px-4 py-3 text-gray-700">
		                        {gado.data_nascimento ? new Date(gado.data_nascimento).toLocaleDateString('pt-BR') : '-'}
		                      </td>
		                      <td className="px-4 py-3 text-gray-700">{gado.id_pai || '-'}</td>
		                      <td className="px-4 py-3 text-gray-700">{gado.id_mae || '-'}</td>
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
	      <ModalGado
	        isOpen={modalAberto}
	        onClose={() => setModalAberto(false)}
	        form={form}
	        setForm={setForm}
	        editando={editando}
	        loading={loading}
	        handleSubmit={handleSubmit}
	        limparForm={limparForm}
	      />

		      <footer className="bg-gradient-to-r from-[#2d5016] to-[#4a7c2c] w-full p-4">
		        <div className="max-w-6xl mx-auto">
		          <p className="text-white text-center">
		            Sistema de Vacinação de Gado - Desenvolvido por Carlos Charles & Vinicius Alexander
		          </p>
		        </div>
		      </footer>
		    </div>
		  );
}
