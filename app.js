import { useState, useEffect, useRef } from 'react';

// Estilos del demo
const style = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');

  body {
    font-family: 'Inter', sans-serif;
    background-color: #0f172a;
  }
  
  .app-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 2rem;
    gap: 2rem;
    flex-wrap: wrap;
  }
  
  .page-container {
    flex: 1;
    min-width: 350px;
    max-width: 600px;
    height: 90vh;
  }

  /* Estilo personalizado para la barra de desplazamiento */
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: #334155;
    border-radius: 10px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #64748b;
    border-radius: 10px;
    transition: background 0.3s ease;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
  
  /* Animación para el regalo */
  @keyframes bounce-in {
    0% { transform: scale(0.5); opacity: 0; }
    50% { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(1); }
  }
  
  .animate-bounce-in {
    animation: bounce-in 0.5s ease-out;
  }
`;

// Componente para simular la página del espectador
function ViewerPage({ ws, messages, lastGift }) {
  const [inputMessage, setInputMessage] = useState('');
  
  // Manejador para el envío del mensaje
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() !== '' && ws && ws.readyState === WebSocket.OPEN) {
      const message = {
        type: 'chatMessage',
        sender: 'Espectador',
        text: inputMessage,
      };
      ws.send(JSON.stringify(message));
      setInputMessage('');
    }
  };

  // Manejador para el envío de un regalo
  const handleSendGift = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const gift = {
        type: 'gift',
        sender: 'Espectador',
      };
      ws.send(JSON.stringify(gift));
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white rounded-lg p-6 shadow-2xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-teal-300">Página del Espectador</h2>
      
      {/* Sección del video simulado */}
      <div className="relative w-full aspect-video bg-gray-800 rounded-lg overflow-hidden mb-6">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-400 text-xl font-mono">Video de vdo.ninja embebido aquí</p>
        </div>
      </div>

      {/* Área del chat */}
      <div className="flex-grow bg-slate-800 p-4 rounded-lg overflow-y-auto mb-4 custom-scrollbar">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2 p-2 rounded-lg transition-all duration-300 transform hover:scale-105"
               style={{ backgroundColor: msg.type === 'gift' ? '#3B0764' : (msg.sender === 'Creador' ? '#2A4365' : '#1A202C') }}>
            <span className={`font-semibold ${msg.type === 'gift' ? 'text-pink-400' : 'text-yellow-400'}`}>
              {msg.sender}:
            </span>
            <span className={`${msg.type === 'gift' ? 'text-pink-200' : 'text-gray-200'} ml-2`}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      {/* Formulario de entrada de chat */}
      <form onSubmit={handleSendMessage} className="flex gap-4 mb-4">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-grow p-3 rounded-lg border-none focus:ring-2 focus:ring-teal-500 bg-slate-700 text-gray-200 placeholder-gray-500"
        />
        <button
          type="submit"
          className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
        >
          Enviar
        </button>
      </form>
      
      {/* Botón para enviar un regalo */}
      <button
        onClick={handleSendGift}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
      >
        Enviar Regalo Único
      </button>
    </div>
  );
}

// Componente para simular la página del creador de contenido
function CreatorPage({ messages, lastGift }) {
  const [displayLastGift, setDisplayLastGift] = useState(false);

  // Efecto para mostrar el regalo recibido en la pantalla
  useEffect(() => {
    if (lastGift) {
      setDisplayLastGift(true);
      const timer = setTimeout(() => {
        setDisplayLastGift(false);
      }, 5000); // Muestra el regalo por 5 segundos
      return () => clearTimeout(timer);
    }
  }, [lastGift]);

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white rounded-lg p-6 shadow-2xl relative">
      <h2 className="text-3xl font-bold mb-6 text-center text-rose-300">Página del Creador</h2>
      
      {/* Sección del video del creador */}
      <div className="relative w-full aspect-video bg-gray-800 rounded-lg overflow-hidden mb-6">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-400 text-xl font-mono">Aquí iría la cámara del Creador</p>
        </div>
      </div>

      {/* Animación del regalo */}
      {displayLastGift && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-bounce-in bg-yellow-400 text-black px-8 py-4 rounded-full shadow-lg text-xl font-bold z-10 transition-all duration-500">
          ¡Regalo recibido de {lastGift.sender}!
        </div>
      )}

      {/* Área del chat */}
      <div className="flex-grow bg-slate-800 p-4 rounded-lg overflow-y-auto custom-scrollbar">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2 p-2 rounded-lg transition-all duration-300 transform hover:scale-105"
               style={{ backgroundColor: msg.type === 'gift' ? '#3B0764' : (msg.sender === 'Espectador' ? '#1A202C' : '#2A4365') }}>
            <span className={`font-semibold ${msg.type === 'gift' ? 'text-pink-400' : 'text-yellow-400'}`}>
              {msg.sender}:
            </span>
            <span className={`${msg.type === 'gift' ? 'text-pink-200' : 'text-gray-200'} ml-2`}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente principal de la aplicación
export default function App() {
  const [messages, setMessages] = useState([]);
  const [lastGift, setLastGift] = useState(null);
  
  // Usamos useRef para mantener la instancia del WebSocket
  const ws = useRef(null);

  useEffect(() => {
    // Conectar al servidor WebSocket.
    // Usamos window.location.host para que funcione tanto en desarrollo como en producción.
    // La URL de ws es ws:// y la de wss:// en producción.
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    ws.current = new WebSocket(`${protocol}//${window.location.host}/`);

    ws.current.onopen = () => {
      console.log('Conexión WebSocket establecida.');
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Mensaje recibido:', data);

      if (data.type === 'chatMessage') {
        const newMessage = {
          sender: data.payload.sender,
          text: data.payload.text,
          type: 'message'
        };
        setMessages(prevMessages => [...prevMessages, newMessage]);
      } else if (data.type === 'gift') {
        const giftMessage = '¡Ha enviado un regalo! 🎉';
        const newGiftMessage = {
          sender: data.payload.sender,
          text: giftMessage,
          type: 'gift'
        };
        setMessages(prevMessages => [...prevMessages, newGiftMessage]);
        setLastGift({ sender: data.payload.sender });
      }
    };

    ws.current.onclose = () => {
      console.log('Conexión WebSocket cerrada.');
    };

    ws.current.onerror = (error) => {
      console.error('Error de WebSocket:', error);
    };

    // Función de limpieza para cerrar la conexión cuando el componente se desmonte
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []); // Se ejecuta solo una vez al montar el componente

  return (
    <>
      <style>{style}</style>
      <div className="app-container">
        <div className="page-container">
          <ViewerPage ws={ws.current} messages={messages} />
        </div>
        <div className="page-container">
          <CreatorPage messages={messages} lastGift={lastGift} />
        </div>
      </div>
    </>
  );
}
