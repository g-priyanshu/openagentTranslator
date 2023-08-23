import React, { useState } from "react";
import Myself from "./Myself";
import "./App.css";
import { Configuration, OpenAIApi } from "openai";
import { BeatLoader } from "react-spinners";

const App = () => {
  const [formData, setFormData] = useState({ language: "Hindi", message: "" });
  const [error, setError] = useState("");
  const [translation, setTranslation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const configuration = new Configuration({
    apiKey: import.meta.env.VITE_OPENAI_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const translate = async () => {
    const { language, message } = formData;
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Translate ${message} into ${language}`,
      temperature: 0.3,
      max_tokens: 100,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

    const translatedText = response.data.choices[0].text.trim();
    setIsLoading(false);
    setTranslation(translatedText);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (!formData.message) {
      setError("Please enter the message.");
      return;
    }
    setIsLoading(true);
    translate();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translation).then(alert('text copied'))
  }
     

  

  return (
    <>
    <div className="container">
      <h1>OpenAgent Translator</h1>

      <form onSubmit={handleOnSubmit}>
        <div className="choices">
          <input
            type="radio"
            id="hindi"
            name="language"
            value="Hindi"
            defaultChecked={formData.language}
            onChange={handleInputChange}
          />
          <label htmlFor="hindi">Hindi</label>

          <input
            type="radio"
            id="spanish"
            name="language"
            value="Spanish"
            onChange={handleInputChange}
          />
          <label htmlFor="spanish">Spanish</label>

          <input
            type="radio"
            id="japanese"
            name="language"
            value="Japanese"
            onChange={handleInputChange}
          />
          <label htmlFor="japanese">Japanese</label>
        </div>

        <textarea
          name="message"
          placeholder="Type your message here.."
          onChange={handleInputChange}
        ></textarea>

        {error && <div className="error">{error}</div>}

        <button type="submit">Translate</button>
      </form>

      <div className="translation">
        <div className="copy-btn" onClick={handleCopy}>
            copy
        </div>
        {isLoading ? <BeatLoader size={12} color={"red"} /> : translation}
      </div>
    </div>
    <Myself/>
    </>
  );
};

export default App;