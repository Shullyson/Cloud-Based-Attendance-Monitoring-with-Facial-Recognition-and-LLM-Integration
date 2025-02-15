import DOMPurify from "dompurify"; // For sanitizing HTML content
import parse from "html-react-parser";
import React, { useState } from "react";

import "src/components/style/admin.css";

const ChatBot = () => {
  const [currentAnswer, setCurrentAnswer] = useState(
    "Hello! Select a question to get started."
  );

  const questions = [
    { title: "How do I log in to the Student Dashboard?", payload: "/faq_login_student_dashboard" },
    { title: "How do I view my attendance records?", payload: "/faq_view_attendance_records" },
    { title: "What does each attendance status mean?", payload: "faq_attendance_status_meaning" },
    { title: "How do I know if my attendance has been marked correctly?", payload: "faq_verify_attendance_status" },
    { title: "Can I update my attendance status if it’s incorrect?", payload: "/faq_update_attendance_status" },
    { title: "Why can’t I see my attendance records for a course?", payload: "/faq_missing_attendance_records" },
    { title: "What happens if I join the session late?", payload: "/faq_join_session_late" },
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
