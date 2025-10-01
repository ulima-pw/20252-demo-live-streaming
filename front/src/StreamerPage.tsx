import { useState, useEffect, useRef } from 'react';
import MyVideo from './components/Video';

interface Message{
    sender: string;
    text: string;
    type: string;
}
interface Gift{
    sender: string;
    type?: string;
}

const StreamerPage = () => {
    const [messages, setMessages] = useState<Message[]>([]); // Estado para almacenar los mensajes del chat
    const [lastGift, setLastGift] = useState<Gift | null>(null); // Estado para almacenar el último regalo recibido

    const [displayLastGift, setDisplayLastGift] = useState<boolean>(false);
    
    // Usamos useRef para mantener la instancia del WebSocket
    const ws = useRef<WebSocket | null>(null);

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
              const lastGift: Gift = { sender: data.payload.sender }
              setMessages([...messages, newGiftMessage]);
              setLastGift(lastGift);
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

    return <div className="container">
      <h1 className="text-center">Streamer - Live Streaming Demo</h1>
      <div className="flex flex-col h-full bg-slate-900 text-white rounded-lg p-6 shadow-2xl relative">
      <h2 className="text-3xl font-bold mb-6 text-center text-rose-300">Página del Creador</h2>
      
      {/* Sección del video del creador */}
      <div className="relative w-full aspect-video bg-gray-800 rounded-lg overflow-hidden mb-6">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-400 text-xl font-mono">Aquí iría la cámara del Creador</p>
          <MyVideo></MyVideo>
        </div>
      </div>

      {/* Animación del regalo */}
      {displayLastGift && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-bounce-in bg-yellow-400 text-black px-8 py-4 rounded-full shadow-lg text-xl font-bold z-10 transition-all duration-500">
          ¡Regalo recibido de {lastGift?.sender}!
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
    </div>
}
export default StreamerPage