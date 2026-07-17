export async function getResponse(prompt) {
  try {
    const response = await fetch(
      "https://virtual-assistant-5l6w.onrender.com/ask",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
        }),
      }
    );

    const data = await response.json();

    return data.answer || "Sorry, I couldn't generate a response.";

  } catch (error) {
    console.error("Backend Error:", error);
    return "Sorry, I am having trouble connecting right now.";
  }
}