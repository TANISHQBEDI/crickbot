import './App.css';
import { useState } from 'react';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isButtonDiasabled, setIsButtonDisabled] = useState(false);

  
  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { type: "sent", content: input };
    setMessages([...messages, newMessage]);

    if (input.startsWith("@ask-question")) {
      setIsButtonDisabled(true);
      const question = input.replace("@ask-question", "").trim();
      try {
        const response = await fetch("https://0ea6-103-131-13-205.ngrok-free.app/ask-question", { // for ngrok put - ngrok http http://127.0.0.1:5001
        // const response = await fetch("http://127.0.0.1:5000/ask-question", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
        });

        const data = await response.json();
        if (data.answer) {
          setMessages((prev) => [...prev, { type: "received", content: data.answer }]);
          setIsButtonDisabled(false);
        } else {
          setMessages((prev) => [
            ...prev,
            { type: "received", content: "Error: Could not get a response." },
          ]);
          setIsButtonDisabled(false);
        }
        
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          { type: "received", content: "Error: Unable to reach the server." },
          
        ]);
        setIsButtonDisabled(false);
      }
    }

    setInput("");
  };

  return (
    <div className="body">
      <div className='logo'>
        <img src='https://cdn.prod.website-files.com/64005d49442ed80d587380bf/64f80629c37d6742aff02312_Brand%20logo%20Black%20(3).svg' alt='Jhavtech'></img>
      </div>
      <div className="chatboxContainer">
        <div className="chatHeader">Chat App</div>
        <div className="messageArea">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.type}`}>
              <div className='markdown-content'>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
              </div>
              {/* <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown> */}
            </div>
          ))}
        </div>
        <div className="inputArea">
          <input
            type="text"
            placeholder="Type a message..."
            className="messageInput"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button disabled={isButtonDiasabled} className="sendButton" onClick={sendMessage}>
          {isButtonDiasabled ? "Loading..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
