import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ResultView from "../components/ResultView";

function DataHistoryPage() {
  const { questionId } = useParams();
  const [data, setData] = useState(null);
  const [document, setDocument] = useState(
    {
      original_layer: [],
      explanation_layer: [],
      action_layer: []
    }
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`http://localhost:8080/datahistory/${questionId}`);
      const jsonData = await res.json();
      setData(jsonData);
      setDocument(
        {
          original_layer: Array.of(jsonData.original_text),
          explanation_layer: Array.of(jsonData.explanation_text),
          action_layer: Array.of(jsonData.action_text)
        }
        );
        console.log(document);;
    } catch (error) {
      console.error('Virhe datan haussa:', error);
    }
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
  <ResultView document={document} />
    );
}


export default DataHistoryPage;