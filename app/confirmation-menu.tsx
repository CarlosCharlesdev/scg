import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  icon?: React.ReactNode;
  confirmButtonColor?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = 'Sim, deletar!',
  cancelButtonText = 'Cancelar',
  icon,
  confirmButtonColor = 'bg-red-600 hover:bg-red-700',
}) => {
  if (!isOpen) return null;

  // Ícone de exclamação estilizado (semelhante à imagem de referência)
  const defaultIcon = (
    <svg className="h-10 w-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-auto transform transition-all duration-300 scale-100">
        
        {/* Conteúdo do Modal */}
        <div className="p-8 text-center">
          
          {/* Ícone */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
            {icon || defaultIcon}
          </div>

          {/* Título */}
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h3>
          
          {/* Mensagem */}
          <p className="text-sm text-gray-500 mb-6">{message}</p>

          {/* Botões de Ação */}
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg transition duration-150 ease-in-out hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              onClick={onClose}
            >
              {cancelButtonText}
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition duration-150 ease-in-out ${confirmButtonColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
              onClick={onConfirm}
            >
              {confirmButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
