import React, { useState } from "react";
import axios from "axios";
import "./Chatbot.css";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ service: "", name: "", phone: "", email: "" });
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hi! What type of property are you looking for?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = async (customInput) => {
    const userInput = customInput || input;
    if (!userInput) return;

    const newMessages = [...messages, { from: "user", text: userInput }];
    let botMessage = "";

    if (step === 0) {
      setData({ ...data, service: userInput });
      botMessage = "🔤 Great! What's your full name?";
      setStep(1);
    } else if (step === 1) {
      setData({ ...data, name: userInput });
      botMessage = "📞 Got it! Please enter your 10-digit phone number.";
      setStep(2);
    } else if (step === 2) {
      if (!/^\d{10}$/.test(userInput)) {
        botMessage = "❌ Please enter a valid 10-digit phone number.";
        setMessages([...newMessages, { from: "bot", text: botMessage }]);
        setInput("");
        return;
      }
      setData({ ...data, phone: userInput });
      botMessage = "📧 Awesome! Now please enter your email address.";
      setStep(3);
    } else if (step === 3) {
      if (!userInput.includes("@")) {
        botMessage = "❌ Please enter a valid email address.";
        setMessages([...newMessages, { from: "bot", text: botMessage }]);
        setInput("");
        return;
      }
      const finalData = { ...data, email: userInput };
      setData(finalData);

      try {
        // ✅ Only WhatsApp integration
        await axios.post("https://decovista-backecnd-final-2.onrender.com/landbot-submit", finalData);
        botMessage = "✅ Thanks! Your info has been sent. We'll contact you on WhatsApp.";
        setStep(4);
      } catch {
        botMessage = "❌ Something went wrong while sending to WhatsApp.";
      }
    } else {
      botMessage = `Thank you! You can close the chat now.\nYou can call on 7042...`;
    }

    setMessages([...newMessages, { from: "bot", text: botMessage }]);
    setInput("");
  };

  return (
    <div>
      <div className="chat-toggle" onClick={() => setOpen(!open)} title="Chat with us!">
  🤖
</div>


      {open && (
        <div className="chat-window">
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-message ${m.from}`}>
                <span className="chat-bubble">{m.text}</span>
              </div>
            ))}
            {step === 0 && (
              <div className="chat-options">
                {["2BHK", "3BHK", "Villa"].map((opt) => (
                  <button key={opt} className="chat-option-btn" onClick={() => handleSend(opt)}>
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {step > 0 && step < 4 && (
            <div className="chat-input">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your reply..."
              />
              <button onClick={() => handleSend()}>Send</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Chatbot;
