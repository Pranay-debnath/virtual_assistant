import React, { createContext, useRef, useState } from "react";
import { getResponse } from "../gemini";

export const datacontext = createContext();

function UserContext({ children }) {
  // ===========================
  // STATES
  // ===========================
  const [speaking, setSpeaking] = useState(false);
  const [response, setResponse] = useState(false);

  // User speech
  const [userPrompt, setUserPrompt] = useState("");

  // AI response
  const [prompt, setPrompt] = useState(
    "Click the Start button and ask me anything...",
  );

  // ===========================
  // SPEECH RECOGNITION
  // ===========================

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognitionRef = useRef(null);

  if (SpeechRecognition && !recognitionRef.current) {
    recognitionRef.current = new SpeechRecognition();

    recognitionRef.current.lang = "en-US";
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.maxAlternatives = 1;

    // ===========================
    // USER SPOKE
    // ===========================

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      // Show user's question
      setUserPrompt(transcript);

      // AI is thinking
      setPrompt("Thinking...");

      recognitionRef.current.stop();

      takeCommand(transcript.toLowerCase());
    };

    // ===========================
    // ERROR
    // ===========================

    recognitionRef.current.onerror = (event) => {
      console.log(event.error);

      setSpeaking(false);
      setResponse(false);

      if (event.error === "no-speech") {
        setPrompt("I didn't hear anything.");
      } else if (event.error === "not-allowed") {
        setPrompt("Please allow microphone permission.");
      } else {
        setPrompt("Microphone Error.");
      }
    };

    // ===========================
    // LISTENING FINISHED
    // ===========================

    recognitionRef.current.onend = () => {
      setSpeaking(false);
    };
  }

  // ========= PART 2 STARTS BELOW =========

  // ===========================
  // SPEAK FUNCTION
  // ===========================

  function speak(text) {
    // Stop any previous speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.volume = 1;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.lang = "en-US";

    // Select the best available voice
    const voices = window.speechSynthesis.getVoices();

    const preferredVoice =
      voices.find((voice) =>
        voice.name.toLowerCase().includes("google us english"),
      ) ||
      voices.find((voice) =>
        voice.name.toLowerCase().includes("google uk english female"),
      ) ||
      voices.find((voice) => voice.lang.startsWith("en"));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setResponse(true);
      setSpeaking(false);
    };

    utterance.onend = () => {
      setResponse(false);
      setSpeaking(false);
    };

    utterance.onerror = () => {
      setResponse(false);
      setSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }

  // ===========================
  // STOP SPEAKING
  // ===========================

  function stopSpeaking() {
    // Stop AI voice
    window.speechSynthesis.cancel();

    // Stop microphone
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }

    setSpeaking(false);
    setResponse(false);

    setPrompt("Assistant stopped.");
  }

  // ===========================
  // GEMINI RESPONSE
  // ===========================

  async function aiResponse(question) {
    try {
      setPrompt("Thinking...");

      const answer = await getResponse(question);

      if (!answer) {
        setPrompt("Sorry, I couldn't generate a response.");
        return;
      }

      const cleanAnswer = String(answer)
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace(/Google/gi, "Pranay Debnath")
        .trim();

      setPrompt(cleanAnswer);

      speak(cleanAnswer);
    } catch (error) {
      console.error(error);

      const errorMessage =
        "Sorry, something went wrong while connecting to Gemini.";

      setPrompt(errorMessage);

      speak(errorMessage);
    }
  }

  // ===========================
  // PART 3 STARTS BELOW
  // ===========================

  // ===========================
  // COMMAND HANDLER
  // ===========================

  function takeCommand(command) {
    command = command.toLowerCase().trim();

    // ---------- Open Websites ----------
    if (command.includes("open")) {
      if (command.includes("youtube")) {
        window.open("https://www.youtube.com", "_blank");
        setPrompt("Opening YouTube...");
        speak("Opening YouTube");
      } else if (command.includes("google")) {
        window.open("https://www.google.com", "_blank");
        setPrompt("Opening Google...");
        speak("Opening Google");
      } else if (command.includes("instagram")) {
        window.open("https://www.instagram.com", "_blank");
        setPrompt("Opening Instagram...");
        speak("Opening Instagram");
      } else if (command.includes("facebook")) {
        window.open("https://www.facebook.com", "_blank");
        setPrompt("Opening Facebook...");
        speak("Opening Facebook");
      } else if (command.includes("github")) {
        window.open("https://github.com", "_blank");
        setPrompt("Opening GitHub...");
        speak("Opening GitHub");
      } else if (command.includes("linkedin")) {
        window.open("https://www.linkedin.com", "_blank");
        setPrompt("Opening LinkedIn...");
        speak("Opening LinkedIn");
      } else {
        const website = command.replace("open", "").trim();

        if (website) {
          const url = `https://www.${website.replace(/\s+/g, "")}.com`;

          window.open(url, "_blank");

          setPrompt(`Opening ${website}...`);

          speak(`Opening ${website}`);
        } else {
          speak("Please tell me which website you want to open.");
        }
      }

      return;
    }

    // ---------- Time ----------
    if (command.includes("time")) {
      const time = new Date().toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      });

      setPrompt(time);

      speak(`The current time is ${time}`);

      return;
    }

    // ---------- Date ----------
    if (command.includes("date")) {
      const date = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      setPrompt(date);

      speak(`Today's date is ${date}`);

      return;
    }

    // ---------- Greeting ----------
    if (
      command.includes("hello") ||
      command.includes("hi") ||
      command.includes("hey")
    ) {
      const msg = "Hello . How can I help you today?";

      setPrompt(msg);

      speak(msg);

      return;
    }

    // ---------- AI ----------
    aiResponse(command);
  }

  // ===========================
  // CONTEXT PROVIDER
  // ===========================

  const value = {
    recognition: recognitionRef.current,

    speaking,
    setSpeaking,

    response,
    setResponse,

    prompt,
    setPrompt,

    userPrompt,
    setUserPrompt,

    speak,
    stopSpeaking,
  };

  return <datacontext.Provider value={value}>{children}</datacontext.Provider>;
}

export default UserContext;
