import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import EmojiPicker from "emoji-picker-react"; // Install this package if you haven't already

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [starred, setStarred] = useState(false);
  const [activeChat, setActiveChat] = useState("New Chat");
  const [userAvatar, setUserAvatar] = useState("👤");
  const [systemAvatar, setSystemAvatar] = useState("🤖");
  const [activeAvatar, setActiveAvatar] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [reactionMessageId, setReactionMessageId] = useState(null);
  const scrollAreaRef = useRef(null);

  const previousChats = [
    "Web Development Trends",
    "JavaScript Best Practices",
    "AI and Machine Learning",
    "Project Management Tips",
    "Book and Movie Recommendations",
  ];

  const dummyResponses = [
    "Hi there! How can I help you today?",
    "That's a fascinating topic. Let me think it over for a moment.",
    "Here's a markdown example for you:\n\n# Main Title\n## Subheading\n- Item one\n- Item two\n\n```python\nprint('Hello, world!')\n```",
    "I don’t have enough information to provide a complete answer. Could you please give me more details?",
    "That's a compelling observation! I hadn't thought of it that way before.",
  ];

  const simulateTyping = (text) => {
    setIsTyping(true);
    let i = 0;
    const intervalId = setInterval(() => {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          ...prev[prev.length - 1],
          content: prev[prev.length - 1].content + text[i],
        },
      ]);
      i++;
      if (i === text.length) {
        clearInterval(intervalId);
        setIsTyping(false);
      }
    }, 50);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), type: "user", content: input },
    ]);
    setInput("");
    setActiveAvatar("system");

    setTimeout(() => {
      const response =
        dummyResponses[Math.floor(Math.random() * dummyResponses.length)];
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), type: "system", content: "" },
      ]);
      simulateTyping(response);
    }, 1000);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!isTyping) {
      setActiveAvatar(null);
    }
  }, [isTyping]);

  return (
    <div
      className={`flex h-screen ${
        darkMode
          ? "bg-gray-900 text-yellow-100"
          : "bg-gradient-to-br from-teal-400 to-blue-500"
      }`}
    >
      {/* Sidebar */}
      <div className="w-64 border-r p-4">
        <h2 className="text-xl font-bold mb-4">Previous Chats</h2>
        {previousChats.map((chat, index) => (
          <div
            key={index}
            className="cursor-pointer p-2 hover:bg-gray-200 rounded"
            onClick={() => setActiveChat(chat)}
          >
            {chat}
          </div>
        ))}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div
              className={`text-4xl ${
                activeAvatar === "system" ? "animate-bounce" : ""
              }`}
            >
              {systemAvatar}
            </div>
            <h1 className="text-2xl font-bold">{activeChat}</h1>
            <div
              className={`text-4xl ${
                activeAvatar === "user" ? "animate-bounce" : ""
              }`}
            >
              {userAvatar}
            </div>
          </div>
          <div className="flex gap-4">
            <button
              className={`p-2 rounded-full ${starred ? "text-yellow-400" : ""}`}
              onClick={() => setStarred(!starred)}
            >
              ⭐
            </button>
            <button
              className="p-2 rounded-full"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "🌞" : "🌜"}
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-grow p-4 overflow-y-auto" ref={scrollAreaRef}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-center gap-2 max-w-[70%] ${
                  message.type === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div className="text-2xl">
                  {message.type === "user" ? userAvatar : systemAvatar}
                </div>
                <div
                  className={`p-2 rounded-lg ${
                    message.type === "user"
                      ? "bg-blue-500 text-white"
                      : darkMode
                      ? "bg-gray-700 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setActiveAvatar("user");
            }}
            placeholder="Type your message..."
            className="flex-grow p-2 border rounded text-black"
          />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
