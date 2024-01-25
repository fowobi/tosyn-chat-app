import React, { useEffect, useState } from "react";
import MessageList from "./MessageList";
import MessageForm from "./MessageForm";
import "./styles.css";
import config from "./config";


const apiUrl = process.env.REACT_APP_API_URL || config.apiUrl;

const App = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/messages`)
      .then((response) => response.json())
      .then((data) => setMessages(data))
      .catch((error) => console.error("Error fetching messages:", error));
  }, []);

  const handleDelete = (id) => {
    fetch(`${apiUrl}/messages/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Filter out the deleted message
        const updatedMessages = messages.filter((message) => message.id !== id);
        setMessages(updatedMessages);
      })
      .catch((error) => console.error("Error deleting message:", error));
  };


  const handleMessageSubmit = (newMessage) => {
    fetch(`${apiUrl}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMessage),
    })
      .then((response) => response.json())
      .then((data) => setMessages([...messages, data]))
      .catch((error) => console.error("Error submitting message:", error));
  };

  return (
    <div className="chat-name">
      <h1>Tosin's CYF Chat</h1>
      <MessageForm onMessageSubmit={handleMessageSubmit} />
      <MessageList messages={messages} onDelete={handleDelete} />
    </div>
  );
};

export default App;
