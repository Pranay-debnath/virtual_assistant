import React, { useContext } from "react";
import "./App.css";

import { FaMicrophone, FaStop } from "react-icons/fa";

import aiImage from "./assets/ai.png";
import speakGif from "./assets/speak.gif";
import aiVoiceGif from "./assets/aivoice.gif";

import { datacontext } from "./context/UserContext";

function App() {
  const {
    recognition,
    speaking,
    setSpeaking,
    prompt,
    setPrompt,
    userPrompt,
    response,
    setResponse,
    stopSpeaking,
  } = useContext(datacontext);

  const startListening = () => {
    if (!recognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    // Stop any previous speech
    window.speechSynthesis.cancel();

    setPrompt("🎤 Listening...");
    setSpeaking(true);
    setResponse(false);

    recognition.start();
  };

  return (
    <div className="main">
      {/* Assistant Image */}

      {!speaking && !response && <img src={aiImage} id="Siya" alt="Alex AI" />}

      {speaking && <img src={speakGif} id="speak" alt="Listening" />}

      {!speaking && response && (
        <img src={aiVoiceGif} id="aigif" alt="Speaking" />
      )}

      {/* Heading */}

      <span>I'm Alex, Your Advanced Virtual Assistant</span>

      {/* Status */}

      <h3 style={{ color: "#00ffff", fontWeight: "500" }}>
        {speaking
          ? "🎤 Listening..."
          : response
            ? "🤖 Alex is Speaking..."
            : "💤 Waiting for your command"}
      </h3>

      {/* Response */}

      <div className="response">
        {userPrompt && (
          <>
            <h3 style={{ color: "#00ffcc" }}>👤 You</h3>
            <p>{userPrompt}</p>
          </>
        )}

        <h3 style={{ color: "#00ffff" }}>🤖 Alex</h3>
        <p>{prompt}</p>
      </div>

      {/* Buttons */}

      <div className="button-container">
        <button
          className="start-btn"
          onClick={startListening}
          disabled={speaking}
        >
          <FaMicrophone />
          Start
        </button>

        <button className="stop-btn" onClick={stopSpeaking}>
          <FaStop />
          Stop
        </button>
      </div>
    </div>
  );
}

export default App;
