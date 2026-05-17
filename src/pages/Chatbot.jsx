import { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "¡Hola! Soy el asistente de PoliRed. ¿En qué puedo ayudarte?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { from: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const response = await axios.post(
        "https://backendv2-as6n.onrender.com/api/chatbot",
        { message: input },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const botReply = response.data.reply;
      setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Lo siento, ocurrió un error. Intenta más tarde."
        }
      ]);
    }

    setIsTyping(false);
  };

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 bg-gray-700 hover:bg-red-700 text-white p-3 rounded-full shadow-lg z-50"
      >
        💬
      </button>

      {/* Ventana del chat */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 h-96 bg-white/40 bg-opacity-10 backdrop-blur-md  border-none rounded-lg shadow-2xl z-50 flex flex-col">
          <div className="bg-gray-700 text-white flex justify-between items-center px-3 py-2 font-semibold rounded-t-lg">
            <span>Asistente PoliRed</span>
            <button
              onClick={toggleChat}
              className="text-white hover:text-red-400 text-xl font-bold leading-none"
            >
              &times;
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2 text-sm">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.from === "bot" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`inline-block break-words p-2 rounded-md max-w-[80%] ${
                    msg.from === "bot"
                      ? "bg-slate-100 text-left text-black"
                      : "bg-gray-700 text-white text-right"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-black px-3 py-2 rounded-md max-w-[60%] flex gap-1">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce delay-100">.</span>
                  <span className="animate-bounce delay-200">.</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex p-3 border-t border-gray-800">
            <input
              type="text"
              className="flex-1 border-b border-slate-200 rounded-l px-2 py-1 text-sm outline-none"
              placeholder="Escribe tu mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
                onClick={handleSend}
                className="relative inline-flex items-center justify-center px-2.5 py-1 overflow-hidden 
                font-medium text-gray-800 transition duration-300 ease-out border-2 border-gray-600 rounded-lg shadow-md group"
                >
                <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white 
                duration-300 -translate-x-full bg-gray-600 group-hover:translate-x-0 ease">
                    <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                    </svg>
                </span>
                <span className="absolute flex items-center bg-slate-200 text-sm font-semibold justify-center w-full h-full 
                text-gray-600 transition-all duration-300 transform group-hover:translate-x-full ease">
                Enviar
                </span>
                <span className="relative text-base invisible">Enviar</span>
                </button>

          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
