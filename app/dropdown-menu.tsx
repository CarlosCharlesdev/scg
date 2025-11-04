'use client';

import React, { useState, useRef, useEffect } from 'react';

interface DropdownMenuProps {
  title: string;
  children: React.ReactNode;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Fechar o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full  border border-transparent  px-4 py-2 bg-[2d5016] text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-600 focus:ring-white transition duration-150 ease-in-out cursor-pointer pb-5 mb-[-5] mt-[-7] "
          id={`menu-button-${title}`}
          aria-expanded={isOpen}
          aria-haspopup="true"
          onClick={toggleDropdown}
        >
          {title}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby={`menu-button-${title}`}
          tabIndex={-1}
        >
          <div className="py-1" role="none">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;

interface DropdownItemProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({ href, children, onClick }) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-200 hover:text-gray-500"
      role="menuitem"
      tabIndex={-1}
    >
      {children}
    </a>
  );
};
