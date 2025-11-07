'use client';
import React from 'react';

// 1. Definir a interface para o estado do formulário de Gado
interface GadoForm {
  identificacao: string;
  sexo: 'M' | 'F';
  raca: string;
  data_nascimento: string;
  pai_id: string; // Assumindo que é string por causa do input type="number" no JS, mas o valor é lido como string
  mae_id: string; // Assumindo que é string
}

// 2. Definir a interface para as propriedades do componente ModalGado
interface ModalGadoProps {
  isOpen: boolean;
  onClose: () => void;
  form: GadoForm;
  setForm: React.Dispatch<React.SetStateAction<GadoForm>>;
  editando: number | string | null; // Assumindo que o ID pode ser number ou string
  loading: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  limparForm: () => void;
}

// Modal para Cadastro/Edição de Gado
const ModalGado: React.FC<ModalGadoProps> = ({ isOpen, onClose, form, setForm, editando, loading, handleSubmit, limparForm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-[2px] bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-auto max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-[#2d5016] to-[#4a7c2c] text-white px-6 py-4 rounded-t-lg flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-2xl font-semibold">
            {editando ? 'Editar Gado' : 'Cadastrar Novo Gado'}
          </h2>
          <button 
            onClick={() => { onClose(); limparForm(); }}
            className="text-white hover:text-gray-200 text-2xl font-bold"
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
                onChange={(e) => setForm({...form, sexo: e.target.value as 'M' | 'F'})}
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
                {/* Adicione mais opções de raça conforme necessário */}
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

            {/* Identificação do pai */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Identificação do pai
              </label>
              <input
                type="number"
                value={form.pai_id}
                onChange={(e) => setForm({...form, pai_id: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none"
              />
            </div>

            {/* Identificação da mãe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Identificação da mãe
              </label>
              <input
                type="number"
                value={form.mae_id}
                onChange={(e) => setForm({...form, mae_id: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none"
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
              onClick={() => { onClose(); limparForm(); }}
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

export default ModalGado;
