import { useState, useRef, useEffect } from "react";
import { FiMessageSquare, FiArrowUp} from "react-icons/fi";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";

export default function ChatbotPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState("");
  const chatBodyRef = useRef(null);

  // Inisialisasi session_id saat komponen mount
  useEffect(() => {
    const storedId = localStorage.getItem("chat_session_id");
    if (storedId) {
      setSessionId(storedId);
    } else {
      const newId = uuidv4();
      localStorage.setItem("chat_session_id", newId);
      setSessionId(newId);
    }
  }, []);

  const togglePopup = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_CHATBOT_API_URL}/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input, session_id: sessionId }),
        }
      );

      const data = await response.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Terjadi kesalahan saat menghubungi server." },
      ]);
    }
  };

  useEffect(() => {
    chatBodyRef.current?.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <>
      {/* FAB Button */}
      <button
        onClick={togglePopup}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-white/10 backdrop-blur-md shadow-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
      >
        <FiMessageSquare className="text-white" size={24} />
      </button>

      {/* Popup Chat */}
      <div
        className={`fixed bottom-20 right-6 w-80 md:w-96 h-[480px] rounded-2xl overflow-hidden z-50 backdrop-blur-2xl bg-white/10 text-white shadow-2xl transition-all duration-500 ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 bg-slate-700 opacity-80 flex justify-between items-center backdrop-blur-xl">
          <h2 className="text-lg font-semibold">Chatbot</h2>
          <button
            onClick={togglePopup}
            className="text-xl hover:text-red-400 cursor-pointer transition-all"
          >
            ✖
          </button>
        </div>

        <div
          ref={chatBodyRef}
          className="flex-1 overflow-y-auto p-4 space-y-2 text-sm"
        >
          {messages.length === 0 && (
            <div className="max-w-[75%] px-3 py-2 rounded-xl mr-auto bg-white/10 text-white border border-white/10">
              Hello, how can I assist you ?
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[75%] px-3 py-2 rounded-xl ${
                msg.sender === "user"
                  ? "ml-auto bg-blue-500/30 text-white backdrop-blur-sm"
                  : "mr-auto bg-white/10 text-white border border-white/10"
              }`}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex items-end border-t border-white/10 bg-white/5 px-3 py-2 pb-3">
          <textarea
            className="flex-1 bg-transparent outline-none text-white placeholder:text-gray-300 resize-none max-h-40"
            placeholder="Type your message..."
            value={input}
            rows={1}
            style={{ height: "auto", overflow: "hidden" }}
            onChange={(e) => {
              setInput(e.target.value);
              const textarea = e.target;
              textarea.style.height = "auto";
              textarea.style.height = textarea.scrollHeight + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button
            onClick={sendMessage}
            className="ml-2 px-3 py-1 bg-color1 text-dark hover:bg-color1/80 cursor-pointer rounded-lg transition-all text-md"
          >
            <FiArrowUp />
          </button>
        </div>
      </div>
    </>
  );
}
