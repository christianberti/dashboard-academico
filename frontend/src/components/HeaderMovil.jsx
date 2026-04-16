import React from 'react';
import { Menu } from 'lucide-react';
import './HeaderMovil.css';

const HeaderMovil = ({ onToggleMenu }) => {
    return (
        <header className="header-movil">
            <button className="boton-menu-movil" onClick={onToggleMenu}>
                <Menu size={24} />
            </button>
            <h1 className="titulo-movil">Estudiar en Informática</h1>
        </header>
    );
};

export default HeaderMovil;
