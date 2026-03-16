import './Sidebar.css'
// 1. Recibimos la función onOpenModal usando destructuración ({ onOpenModal })
function Sidebar({ onOpenModal, toggleTheme, isDarkMode }) {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2>Notion de Agustin</h2>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    <li className="active"> 🏠 Inicio</li>
                    <li>⭐ Favoritos</li>
                    <li>💼 Trabajo</li>
                    <li>📚 Estudio</li>
                </ul>
            </nav>
            <div className="sidebar-footer">
                {/* 2. Le decimos al botón que escuche el evento 'onClick' y use la función */}
                <button className="new-link-btn" onClick={onOpenModal}> + Nuevo Link </button>
                
                {/* 3. NUEVO: Botón para Modo Noche/Día */}
                <button className="theme-toggle-btn" onClick={toggleTheme} style={{marginTop: '10px'}}>
                    {isDarkMode ? '☀️ Modo Día' : '🌙 Modo Noche'}
                </button>
            </div>
        </aside>
    );
}
export default Sidebar;