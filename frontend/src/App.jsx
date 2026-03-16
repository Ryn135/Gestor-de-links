import { useState, useEffect } from 'react'; // 1. Agregamos useEffect
import './App.css';
import Sidebar from './layout/Sidebar';
import LinkCard from './components/LinkCard';
import NewLinkModal from './components/NewLinkModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function App() {
  // 2. Iniciamos la memoria de links VACÍA (como un arreglo vacío [])
  const [links, setLinks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 1. NUEVO: Estado para Modo Oscuro, lee del localStorage si hay preferencia previa
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // 2. NUEVO: Cuando cambie isDarkMode, aplicamos la clase al <body>
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // 3. NUEVO: Función para alternar el tema
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // 3. NUEVO: useEffect para pedir los links al backend apenas carga la página
  useEffect(() => {
    // Le tocamos la puerta al servidor Node.js (Local o Nube)
    fetch(`${API_URL}/api/links`)
      .then(respuesta => respuesta.json()) // Transformamos la respuesta a JSON
      .then(datos => setLinks(datos)) // Guardamos esos datos en nuestra "memoria" de React
      .catch(error => console.error('Error cargando los links rápidos:', error));
  }, []); // Los corchetes vacíos [] significan "haz esto SOLO UNA VEZ al cargar la app"
  // 4. MODIFICADO: Ahora enviamos el nuevo link al backend antes de mostrarlo
  const handleAddLink = (newLink) => {
    // Configuramos el envío (POST) al servidor
    fetch(`${API_URL}/api/links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Convertimos los datos de newLink (que vienen del Modal) en texto para enviarlos
      body: JSON.stringify({
        title: newLink.title,
        url: newLink.url,
        category: newLink.category
      }),
    })
      .then(respuesta => respuesta.json()) // El servidor nos responde con el link guardado (y su ID real)
      .then(linkGuardadoEnBaseDeDatos => {
        // Y recién ahora, lo sumamos a la pantalla
        setLinks([linkGuardadoEnBaseDeDatos, ...links]);
      })
      .catch(error => console.error('Error guardando el link:', error));
  };

  // 5. NUEVO: Función para eliminar un link
  const handleDeleteLink = (id) => {
    fetch(`${API_URL}/api/links/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(() => {
        // Filtramos y quitamos el link borrado de la pantalla
        setLinks(links.filter(link => link.id !== id));
      })
      .catch(error => console.error('Error eliminando link:', error));
  };

  // 6. NUEVO: Función para cambiar el icono
  const handleUpdateIcon = (id, formData) => {
    fetch(`${API_URL}/api/links/${id}/icon`, {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(updatedData => {
        // Actualizamos solo la tarjeta que cambió su foto
        setLinks(links.map(link =>
          link.id === id ? { ...link, icon_path: updatedData.icon_path } : link
        ));
      })
      .catch(error => console.error('Error actualizando icono:', error));
  };

  return (
    <div className="app-container">
      <Sidebar 
        onOpenModal={() => setIsModalOpen(true)} 
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
      />
      <main className="main-content">
        <h1>Gestor de links</h1>

        <div className="links-grid">
          {links.map((link) => (
            <LinkCard
              key={link.id}
              id={link.id}
              title={link.title}
              url={link.url}
              category={link.category}
              icon_path={link.icon_path}
              onDelete={handleDeleteLink}
              onUpdateIcon={handleUpdateIcon}
            />
          ))}
        </div>
      </main>
      {isModalOpen && (
        <NewLinkModal
          onClose={() => setIsModalOpen(false)}
          onAddLink={handleAddLink}
        />
      )}

    </div>
  );
}
export default App;