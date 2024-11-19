import React, { useEffect, useState } from "react";
import axios from "axios";
import PersonIcon from "@mui/icons-material/Person";
import AndroidIcon from "@mui/icons-material/Android";
import DeleteIcon from '@mui/icons-material/Delete';
import "../styles/chat.css"

function Chat() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState([]);
  const [isChatBoxOpen, setIsChatBoxOpen] = useState(false);
  const [inputEnabled, setInputEnabled] = useState(true);

  useEffect(() => {
    //Runs only on the first render
    handleClear();
  }, []);
  
    const handleSubmit = (event) => {
      event.preventDefault();
      setInputEnabled(false);
  
      axios
      .post("http://localhost:8080/chat", {message: prompt})
      .then((res) => {
        setResponse(res.data);
        setInputEnabled(true);
        setPrompt("");
      })
      .catch((err) => {
        console.error(err);
        setInputEnabled(true);
      });
  };

  const handleClear = () => {
  
    axios
    .post("http://localhost:8080/chat", {command: "clear"})
    .then((res) => {
      setResponse(res.data);
      setPrompt("");
    })
    .catch((err) => {
      console.error(err);
    });
  }

  const handleToggleChatBox = () => {
    setIsChatBoxOpen((prevIsOpen) => !prevIsOpen);
  };

  return (
    <div className="chat-container">
      <div className={`chat-box ${isChatBoxOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <button className="close-btn" onClick={handleToggleChatBox}>
            X
          </button>
        </div>
        <div className="chat-content">
            {response.map((message, index) => (
              <div className="py-2" key={index}>
                <div className="flex space-x-4">
                  {message.role === "user"? <PersonIcon/> : <AndroidIcon/>}
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="input-area">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your message..."
            className="input-field"
            disabled={!inputEnabled}
          />
          <button type="submit" className="submit-button" style={inputEnabled? {cursor: "pointer"} : {cursor: "default"}} disabled={!inputEnabled}>Send</button>
          <button className="bg-white border border-slate-300 rounded-md hover:bg-red-500" onClick={handleClear}><DeleteIcon /></button>
        </form>
      </div>
      <div className={`chat-toggle-btn ${isChatBoxOpen ? 'open' : ''}`} onClick={handleToggleChatBox}>
      {isChatBoxOpen ? <></> : <button>Open Chat</button>}
      </div>
    </div>
  );
};


export default Chat;