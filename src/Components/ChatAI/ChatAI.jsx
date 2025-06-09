import { useState, useRef, useEffect } from "react";
import { FiSend, FiSmile } from "react-icons/fi";
import { BsCheckAll, BsCheck } from "react-icons/bs";
import { v4 as uuidv4 } from "uuid"; // Import uuid for unique IDs
import { ExceptionMap } from "antd/es/result";

const ChatAI = () => {
    const [isStart, setIsStart] = useState(false)
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isOpen, setIsOpen] = useState(false); // Control visibility of chat window
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (newMessage.trim()) {
            const userMessage = {
                id: uuidv4(),
                text: newMessage,
                sender: "self",
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                status: "sent",
                avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
            };
            setMessages((prevMessages) => [...prevMessages, userMessage]);
            setNewMessage("");
            setIsTyping(true);

            // Gửi tin nhắn đến API chatbot
            handleAsk(newMessage);
        }
    };

    const handleStart = async () => {
        setIsTyping(true);
        try {
            const response = await fetch("http://localhost:8080/chatai/start", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const res = await response.json();

            if (res.answer != null) {
                const botMessage = {
                    id: uuidv4(),
                    text: res.answer,
                    sender: "other",
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    status: "read",
                    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                };
                setMessages((prevMessages) => [...prevMessages, botMessage]);
            }
            else throw Error
        } catch (error) {
            const errorMessage = {
                id: uuidv4(),
                text: "Lỗi khi kết nối chatbot",
                sender: "other",
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                status: "read",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
            };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        } finally {
            setIsTyping(false)
        }
    };

    const handleAsk = async (userMessage) => {
        try {
            const response = await fetch("http://localhost:8080/chatai/ask", {
                method: "POST",
                body: JSON.stringify({ question: userMessage }),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const res = await response.json();

            if (res.answer != null) {
                const botMessage = {
                    id: uuidv4(),
                    text: res.answer,
                    sender: "other",
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    status: "read",
                    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                };
                setMessages((prevMessages) => [...prevMessages, botMessage]);
            }
            else throw Error
        } catch (error) {
            const errorMessage = {
                id: uuidv4(),
                text: "Lỗi khi kết nối chatbot",
                sender: "other",
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                status: "read",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
            };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        } finally {
            setIsTyping(false)
        }
    };

    const MessageStatus = ({ status }) => {
        return status === "read" ? (
            <BsCheckAll className="text-blue-500" />
        ) : (
            <BsCheck className="text-gray-500" />
        );
    };

    const toggleChatWindow = () => {
        setIsOpen((prev) => !prev);
        if (isStart == false) {
            handleStart();
            setIsStart(true);
        }
    };

    return (
        <>
            {/* Sticky chat icon */}
            {!isOpen && (
                <button
                    onClick={toggleChatWindow}
                    className="fixed bottom-6 right-6 p-4 bg-blue-500 text-white rounded-full shadow-lg"
                    aria-label="Open chat"
                >
                    <FiSmile className="w-6 h-6" />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-20 right-6 w-96 h-[500px] bg-white shadow-xl rounded-lg flex flex-col">
                    <div className="bg-white p-4 border-b">
                        <h2 className="text-lg font-semibold">Chatbot tư vấn sản phẩm</h2>
                        <button onClick={toggleChatWindow} className="absolute top-2 right-2 text-gray-600">
                            X
                        </button>
                    </div>

                    <div
                        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                        style={{ maxHeight: "calc(100% - 160px)" }}
                    >
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === "self" ? "justify-end" : "justify-start"}`}
                            >
                                <div className="flex items-end space-x-2">
                                    {message.sender !== "self" && (
                                        <img
                                            src={message.avatar}
                                            alt="avatar"
                                            className="w-8 h-8 rounded-full"
                                            onError={(e) => {
                                                e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde";
                                            }}
                                        />
                                    )}
                                    <div
                                        className={`max-w-xs px-4 py-2 rounded-lg ${message.sender === "self" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
                                    >
                                        <p className="text-sm">{message.text}</p>
                                        <div className="flex items-center justify-end space-x-1 mt-1">
                                            <span className="text-xs opacity-75">{message.timestamp}</span>
                                            {message.sender === "self" && <MessageStatus status={message.status} />}
                                        </div>
                                    </div>
                                    {message.sender === "self" && (
                                        <img
                                            src={message.avatar}
                                            alt="avatar"
                                            className="w-8 h-8 rounded-full"
                                            onError={(e) => {
                                                e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde";
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex items-center space-x-2">
                                <div className="flex space-x-1 bg-gray-200 px-4 py-2 rounded-full">
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="bg-white p-4 border-t">
                        <div className="flex items-center space-x-2">
                            <button
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Add emoji"
                            >
                                <FiSmile className="w-6 h-6 text-gray-500" />
                            </button>
                            <textarea
                                value={newMessage}
                                onChange={(e) => {
                                    setNewMessage(e.target.value);
                                }}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder="Bạn cần tư vấn gì thêm ?"
                                className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                rows="1"
                                aria-label="Message input"
                            />
                            <button
                                onClick={handleSend}
                                className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!newMessage.trim()}
                                aria-label="Send message"
                            >
                                <FiSend className="w-6 h-6 text-white" />
                            </button>
                        </div>
                        <div className="flex justify-end mt-1">
                            <span className="text-xs text-gray-500">
                                {newMessage.length}/1000 characters
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatAI;
