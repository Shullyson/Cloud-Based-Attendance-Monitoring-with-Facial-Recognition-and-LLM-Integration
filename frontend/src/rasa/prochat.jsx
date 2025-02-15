import DOMPurify from "dompurify"; // For sanitizing HTML content
import parse from "html-react-parser";
import React, { useState } from "react";

import "src/components/style/admin.css";

const ChatBot = () => {
  const [currentAnswer, setCurrentAnswer] = useState(
    "Hello! Select a question to get started."
  );

  const questions = [
    { title: "How do I start a face recognition session?", payload: "/faq_start_face_recognition" },
    { title: "Why is the camera feed not showing?", payload: "/faq_camera_feed_not_showing" },
    { title: "What happens during a face recognition session?", payload: "/faq_face_recognition_process" },
    { title: "How do I stop a face recognition session?", payload: "/faq_stop_face_recognition" },
    { title: "Can I manually update a student’s attendance?", payload: "/faq_view_attendance_reports" },
    { title: "How do I view attendance reports?", payload: "/faq_view_attendance_reports" },
    { title: "What should I do if a student’s name is not appearing in the list?", payload: "/faq_missing_student_name" },
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
