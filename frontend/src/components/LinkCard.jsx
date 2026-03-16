import { useState, useRef } from 'react';
import './LinkCard.css';

// Agregamos nuevas props: id, icon_path, onDelete, onUpdateIcon
function LinkCard({ id, title, url, category, icon_path, onDelete, onUpdateIcon }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const fileInputRef = useRef(null);

    // TRUCO MAGNÍFICO: Usamos el servicio de Google para traer el logo de cualquier URL.
    const getFaviconUrl = (siteUrl) => {
        try {
            const domain = new URL(siteUrl).hostname;
            return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
        } catch (error) {
            return 'https://via.placeholder.com/64?text=Link';
        }
    };

    // DECISIÓN DE IMAGEN: Si el backend nos dio un icon_path (que ahora es Texto Base64 crudo),  
    // lo usamos directo. Si no, usamos Google favicon.
    const imageSource = icon_path 
        ? icon_path 
        : getFaviconUrl(url);

    // Función para manejar el clic en "Eliminar"
    const handleDeleteClick = () => {
        if (window.confirm("¿Seguro que quieres eliminar este link?")) {
            onDelete(id);
        }
        setIsMenuOpen(false);
    };

    // Función para manejar el clic en "Cambiar Ícono"
    const handleChangeIconClick = () => {
        // Simulamos un clic en el input file oculto
        fileInputRef.current.click();
        setIsMenuOpen(false);
    };

    // Función que se ejecuta cuando el usuario selecciona un archivo de su PC
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('icon', file);
            onUpdateIcon(id, formData);
        }
        // Reseteamos el input para que pueda volver a elegir el mismo archivo si quiere
        e.target.value = null; 
    };

    return (
        <div className="link-card">
            <div className="link-card-header">
                <span className="link-category">{category}</span>
                
                {/* Menú de opciones */}
                <div className="menu-container">
                    <button 
                        className="icon-btn" 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        ⋮
                    </button>
                    
                    {isMenuOpen && (
                        <div className="dropdown-menu">
                            <button className="dropdown-item" onClick={handleChangeIconClick}>
                                Cambiar Ícono
                            </button>
                            <button className="dropdown-item delete-item" onClick={handleDeleteClick}>
                                Eliminar
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="link-card-body">
                <img
                    src={imageSource}
                    alt={`Logo de ${title}`}
                    className="link-logo"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/64?text=?' }}
                />
                <h3 className="link-title">{title}</h3>
            </div>
            
            <a href={url} target="_blank" rel="noopener noreferrer" className="link-url">
                {url}
            </a>

            {/* Input oculto para subir archivos */}
            <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept="image/png, image/jpeg, image/x-icon, image/svg+xml"
                onChange={handleFileChange}
            />
        </div>
    );
}

export default LinkCard;