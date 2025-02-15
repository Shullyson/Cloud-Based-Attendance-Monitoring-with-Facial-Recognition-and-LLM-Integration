import DOMPurify from "dompurify"; // For sanitizing HTML content
import parse from "html-react-parser";
import React, { useState } from "react";

import "src/components/style/admin.css";

const ChatBot = () => {
  const [currentAnswer, setCurrentAnswer] = useState(
    "Hello! Select a question to get started."
  );

  const questions = [
    { title: "What is the purpose of the Report Page?", payload: "/faq_report_page_purpose" },
    { title: "How do I select an academic year, course, and student for a report?", payload: "faq_select_criteria" },
    { title: "What information is included in the attendance report?", payload: "/faq_report_information" },
    { title: "How do I download a PDF report?", payload: "/faq_download_pdf" },
    { title: "Can I view a report for all students in a course?", payload: "/faq_view_all_students_report" },
    { title: "What do the statistics at the bottom of the page represent?", payload: "faq_statistics_explanation" },
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
