import { useState, useEffect, useRef } from 'react';
import MyVideo from './components/Video';

interface Message{
    sender: string;
    text: string;
    type: string;
}

const ViewerPage = () => {
    const [messages, setMessages] = useState<Message[]>([]); // Estado para almacenar los mensajes del chat

    // Usamos useRef para mantener la instancia del WebSocket
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        // Conectar al servidor WebSocket.
        // Usamos window.location.host para que funcione tanto en desarrollo como en producción.
        // La URL de ws es ws:// y la de wss:// en producción.
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        //const host = window.location.host;
        const host = 'localhost:3001'
        ws.current = new WebSocket(`${protocol}//${host}/`);

        ws.current.onopen = () => {
            console.log('Conexión WebSocket establecida.');
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Mensaje recibido:', data);

            if (data.type === 'chatMessage') {
              const newMessage:Message = {
                  sender: data.payload.sender,
                  text: data.payload.text,
                  type: 'message'
              };
              setMessages([...messages, newMessage]);
            } else if (data.type === 'gift') {
              const giftMessage = '¡Ha enviado un regalo! 🎉';
              const newGiftMessage:Message = {
                  sender: data.payload.sender,
                  text: giftMessage,
                  type: 'gift'
              };
              setMessages([...messages, newGiftMessage]);
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
    }, [messages]);

    const [inputMessage, setInputMessage] = useState<string>('');
      
      // Manejador para el envío del mensaje
      const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim() !== '' && ws.current && ws.current.readyState === WebSocket.OPEN) {
          const message = {
            type: 'chatMessage',
            sender: 'Espectador',
            text: inputMessage,
          };
          ws.current.send(JSON.stringify(message));
          setInputMessage('');
        }
      };
    
      // Manejador para el envío de un regalo
    const handleSendGift = () => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            const gift = {
                type: 'gift',
                sender: 'Espectador',
            };
            ws.current.send(JSON.stringify(gift));
        }
    };

    
    return (
    <div className="container flex flex-col h-full bg-slate-900 text-white rounded-lg p-6 shadow-2xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-teal-300">Página del Espectador</h2>
      
      {/* Sección del video simulado */}
      <div className="relative w-full aspect-video bg-gray-800 rounded-lg overflow-hidden mb-6">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-400 text-xl font-mono">Video de vdo.ninja embebido aquí</p>
          <MyVideo url="https://vdo.ninja/?view=Qu98Sx7"></MyVideo>
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
  )
}

export default ViewerPage