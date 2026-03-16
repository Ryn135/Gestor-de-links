import { useState } from 'react';
import './NewLinkModal.css';
// Este componente recibe dos funciones como props:
// - onClose: para cerrar la ventana emergente
// - onAddLink: la función que de verdad guardará el link en la "memoria" de App.jsx
function NewLinkModal({ onClose, onAddLink }) {
    // Estos tres estados son la "memoria" interna de este pequeño formulario:
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [category, setCategory] = useState('Favoritos');

    // Qué hacer cuando el usuario presiona "Guardar"
    const handleSubmit = (e) => {
        e.preventDefault(); // Evita que la página se recargue (comportamiento por defecto del formulario)

        // Si no puso ni título ni URL, no hacemos nada (validación simple)
        if (!title || !url) return;

        // Ejecutamos la función onAddLink pasándole los datos que el usuario escribió
        onAddLink({
            id: Date.now(), // Un truco para tener un ID único temporal
            title: title,
            url: url,
            category: category
        });

        // Cerramos el modal cuando termine de guardar
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Nuevo Link</h2>
                    {/* Al hacer clic en la X, ejecutaremos la función onClose() para cerrar */}
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Título:</label>
                        <input
                            type="text"
                            placeholder="Ej: Google"
                            value={title}
                            // Cuando el usuario escribe, guardamos el texto en la variable 'title'
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>URL:</label>
                        <input
                            type="url"
                            placeholder="Ej: https://google.com"
                            value={url}
                            // El mismo truco: guardar cada letra que teclea en la memoria
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Categoría:</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="Favoritos">⭐ Favoritos</option>
                            <option value="Trabajo">💼 Trabajo</option>
                            <option value="Estudio">📚 Estudio</option>
                        </select>
                    </div>
                    <button type="submit" className="save-btn">Guardar Link</button>
                </form>
            </div>
        </div>
    );
}

export default NewLinkModal;