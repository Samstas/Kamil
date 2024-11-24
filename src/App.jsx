import "./App.css";

import { useRef, useState } from "react";
import reactLogo from "./assets/react.svg";

const URL = "";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);

  function handleFileChange(e) {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  }

  async function sendFile() {
    if (!file) {
      alert("Выберите файл перед отправкой!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      setIsLoading(true);
      const response = await fetch(URL, {
        method: "POST",
        body: formData,
        signal: abortController.signal,
      });

      if (response.ok) {
        alert("Файл успешно отправлен!✅");
        setFile(null);
        fileInputRef.current.value = "";
      } else {
        alert("Ошибка при отправке файла.✖️");
      }
    } catch (error) {
      if (error.name === "AbortError") {
        alert("Отправка файла была остановлена.");
      } else {
        console.log("Ошибка: ", error);
        alert("Произошла ошибка при отправке файла.");
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }

  function stopFileSend() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }

  return (
    <main>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      {isLoading ? (
        <p>Отправка файла...</p>
      ) : (
        <input
          type="file"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="selectFile"
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <button onClick={sendFile}>Отправить файл</button>

        <button className="abortBtn" onClick={stopFileSend}>
          Остановить отправку файла
        </button>
      </div>
    </main>
  );
}

export default App;
