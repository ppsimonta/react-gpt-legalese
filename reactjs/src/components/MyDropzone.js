import React, { useCallback, useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import Context from "../context/common";
import LoadingView from "./LoadingView";
import { useNavigate } from "react-router";


function MyDropzone() {
 
 
  const navigate = useNavigate();
  
  const { createDocument } = useContext(Context);

  const [file, setFile] = useState(null); 
  const [response, setResponse] = useState("Response");

  const handleNavigate = (questionId) => {
    const url = `/datahistory/${questionId}`
    navigate(url);
  }

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
  }, []);

  const sendImage = () => {
    if (file) {
      setResponse("");
      const formData = new FormData();
      formData.append("img", file);
  
      fetch("http://localhost:8080/upload", {
        method: "post",
        body: formData,
      })
        .then((res) => {
          if (res.ok) {
            return res.json(); // Parse response as JSON
          } else {
            throw new Error("File upload failed");
          }
        })
        .then((resBody) => {
          console.log(resBody);
          setResponse(resBody);
          createDocument(resBody);
          handleNavigate(resBody.last_inserted_id);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });



  return (
    <div>
      <div
        {...getRootProps()}
        style={{
          border: "2px dashed #ccc",
          padding: "20px",
          textAlign: "center",
          backgroundColor: "#f8f8f8",
        }}
      >
        <input {...getInputProps()} />
        <p style={{ fontSize: "18px" }}>
          Drag 'n' drop some files here, or click to select files
        </p>
      </div>
      {file && (
        <div>
          <p>Selected File: {file.name}</p>
          <button
            onClick={sendImage}
            style={{
              backgroundColor: "#4caf50",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Upload
          </button>
        </div>
      )}
      {response? <></> : <LoadingView />}
    </div>
  );
}
export default MyDropzone;