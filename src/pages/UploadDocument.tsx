import { useState } from "react";

const UploadDocument = () => {
  const [file, setFile] = useState(null);
  const [qaPairs, setQaPairs] = useState([
    // {
    //   question: "What is the capital of France?",
    //   options: ["Paris", "London", "Berlin", "Madrid"],
    //   answer: 1,
    // },
  ]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loadQa, setLoadQa] = useState(false);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleResponseData = (rawData) => {
    try {
      const cleanData = rawData
        .replace(/\\n/g, "")
        .replace(/\\/g, "")
        .replace(/^data:\s*/, "")
        .replace(/^"/, "")
        .replace(/"$/, "");

      console.log("Cleaned Data:", cleanData);

      const parsedObject = JSON.parse(cleanData);

      let qaArray = [];
      if (Array.isArray(parsedObject)) {
        qaArray = parsedObject;
      } else {
        qaArray = [parsedObject];
      }

      console.log("Final QA Array:", qaArray);
      return qaArray;
    } catch (error) {
      console.error("Error parsing response data:", error);
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setError(null);
      setQaPairs([]);

      const res = await fetch("http://127.0.0.1:5005/generate-qa", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        setLoading(false);
        setError(errorData.error || "An unknown error occurred.");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let result = "";

      const stream = new ReadableStream({
        start(controller) {
          function push() {
            reader
              .read()
              .then(({ done, value }) => {
                if (done) {
                  controller.close();
                  setLoading(false);
                  return;
                }

                result += decoder.decode(value, { stream: true });

                const dataRegex = /^data: (.*)/;
                const matches = result.match(dataRegex);

                if (matches && matches[1]) {
                  let rawData = matches[1];

                  console.log("Raw Data before cleaning:", rawData);

                  const qaArray = handleResponseData(rawData);

                  if (qaArray.length === 0) {
                    setError("Failed to parse JSON response.");
                    setLoading(false);
                    return;
                  }

                  setQaPairs((prev) => [...prev, ...qaArray]);
                  result = "";
                }

                push();
              })
              .catch((err) => {
                console.error("Error reading the stream:", err);
                setError(err.message || "Error during stream processing.");
                setLoading(false);
              });
          }
          push();
        },
      });

      await new Response(stream);
    } catch (err) {
      console.error("File upload failed:", err);
      setError(err.message || "An error occurred while processing the file.");
      setLoading(false);
    }
  };

  const save = async () => {
    try {
      const Qa = qaPairs.slice(0, 10);

      console.log("Split QA Pairs:", Qa);

      const res = await fetch("http://127.0.0.1:5005/save-qa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Qa),
      });
      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || "An unknown error occurred.");
        return;
      }

      const data = await res.json();
      console.log("Data saved successfully:", data);
    } catch (err) {
      console.error("Failed to save data:", err);
      setError(err.message || "An error occurred while saving the data.");
    }
  };

  const renderQA = (qa, index) => {
    if (qa && qa.question) {
      return (
        <div
          key={index}
          style={{
            marginBottom: "20px",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#fafafa",
          }}
        >
          <h3
            style={{
              backgroundColor: "#f4f4f4",
              padding: "5px",
              borderRadius: "5px",
              fontSize: "16px",
              marginBottom: "10px",
            }}
          >
            <span>
              <strong>{index + 1}:</strong>
            </span>
            {qa.question}
          </h3>
          <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
            {qa.options &&
              qa.options.map((option, i) => (
                <li key={i} style={{ marginBottom: "10px" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "14px",
                    }}
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={i}
                      checked={
                        selectedOption &&
                        selectedOption.question === index &&
                        selectedOption.answer === i
                      }
                      onChange={() =>
                        setSelectedOption({
                          question: index,
                          answer: i,
                        })
                      }
                      style={{
                        marginRight: "10px",
                        accentColor: i === qa.answer - 1 ? "green" : "red",
                      }}
                    />
                    {option}
                  </label>
                  {selectedOption &&
                    selectedOption.question === index &&
                    selectedOption.answer === i && (
                      <span
                        style={{
                          color: i === qa.answer - 1 ? "green" : "red",
                          marginLeft: "5px",
                          fontSize: "14px",
                        }}
                      >
                        {i === qa.answer - 1 ? "Correct" : "Incorrect"}
                      </span>
                    )}
                </li>
              ))}
          </ul>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ccc",
        maxWidth: "500px",
        margin: "0 auto",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#333" }}>
        Upload PDF for QA Generation
      </h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          style={{
            marginBottom: "10px",
            padding: "8px",
            border: "1px solid #ccc",
            width: "100%",
            maxWidth: "400px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
            width: "100%",
            maxWidth: "400px",
          }}
        >
          Submit
        </button>
      </form>

      {error && (
        <p style={{ color: "red", textAlign: "center", fontSize: "14px" }}>
          {error}
        </p>
      )}
      {qaPairs && qaPairs.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          {qaPairs.map((qa, index) => renderQA(qa, index))}
        </div>
      )}
      {loading && (
        <p style={{ textAlign: "center", color: "#777" }}>Loading...</p>
      )}

      {qaPairs && qaPairs.length >= 10 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
            onClick={save}
          >
            Save Question
          </button>
        </div>
      )}

      {loadQa && <LoadQa />}

      <button
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer",
          marginTop: "20px",
        }}
        onClick={() => {
          setLoadQa(!loadQa);
        }}
      >
        {loadQa ? "Hide QA" : "Load QA"}
      </button>
    </div>
  );
};

export default UploadDocument;
