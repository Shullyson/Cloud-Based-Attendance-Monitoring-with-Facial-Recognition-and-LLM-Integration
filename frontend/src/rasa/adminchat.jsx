import DOMPurify from "dompurify"; // For sanitizing HTML content
import parse from "html-react-parser";
import React, { useState } from "react";

import "src/components/style/admin.css";

const ChatBot = () => {
  const [currentAnswer, setCurrentAnswer] = useState(
    "Hello! Select a question to get started."
  );

  const questions = [
    { title: "What can I do in the admin dashboard?", payload: "/admin_dashboard_features" },
    { title: "How do I manage professors, students, courses, or programs?", payload: "/manage_professors_students_courses" },
    { title: "How can I add multiple professors, students, courses, or programs at once?", payload: "/bulk_add_entrie" },
    { title: "What file format should I use for bulk uploads?", payload: "/file_formart-bulk_upload" },
    { title: "How do I customize permissions for professors or users?", payload: "/customize_permissions" },
    { title: "What happens if I upload invalid data?", payload: "/handle_invalid_data" },
    { title: "Something Else?", payload: "/faq_something_else" },
  ];

  const handleButtonClick = (message) => {
    fetch("http://localhost:5005/webhooks/rest/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sender: "user", message }), // Fixed shorthand warning
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
              type="button" // Fixed missing type attribute
              className="chat-button-option"
              onClick={() => handleButtonClick(question.payload)}
            >
              {question.title}
            </button>
          ))}
        </div>

        <div className="chat-answer">{parse(DOMPurify.sanitize(currentAnswer))}</div>

      </div>
    </div>
  );
};

export default ChatBot;
