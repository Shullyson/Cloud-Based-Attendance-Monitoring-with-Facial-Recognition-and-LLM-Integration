import React, { useState } from 'react';
import './ChatBot.css';

const ChatBot = () => {
  const [currentAnswer, setCurrentAnswer] = useState("Hello! Select a question to get started.");

  const questions = [
    { title: "What is this service about?", payload: "/faq_about_service" },
    { title: "How do I log in to the system?", payload: "/faq_login" },
    { title: "I forgot my password. What should I do?", payload: "/faq_forgot_password" },
    { title: "Which roles have access to the system?", payload: "/faq_roles" },
    { title: "What should I do if I encounter an error during login?", payload: "/faq_error_login" },
    { title: "Can I change my role after logging in?", payload: "/faq_change_role" },
    { title: "Something Else?", payload: "/faq_something_else" },
  ];

  const handleButtonClick = (message) => {
    fetch("http://localhost:5005/webhooks/rest/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sender: "user", message: message }),
    })
      .then((res) => res.json())
      .then((data) => {
        const response = data[0]; // Assuming the first message is the response
        setCurrentAnswer(response.text || "No response received.");
      })
      .catch((error) => {
        console.error("Error:", error);
        setCurrentAnswer("An error occurred. Please try again.");
      });
  };

  return (
    <div className="chat-popup">
      <div className="chat-header">
        <h4>Suggestion Bot</h4>
      </div>
      <div className="chat-body">
        {/* Questions Section */}
        <div className="chat-questions">
          <p>Here are some things you can ask me:</p>
          {questions.map((question, index) => (
            <button
              key={index}
              className="chat-button-option"
              onClick={() => handleButtonClick(question.payload)}
            >
              {question.title}
            </button>
          ))}
        </div>

        {/* Answer Display */}
        <div
          className="chat-answer"
          dangerouslySetInnerHTML={{ __html: currentAnswer }}
        />
      </div>
    </div>
  );
};

export default ChatBot;