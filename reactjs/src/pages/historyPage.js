import { on } from "events";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';

function HistoryPage() {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
      }, []);
    
      const fetchData = async () => {
        try {
          const res = await fetch('http://localhost:8080/datahistoryall');
          const jsonData = await res.json();
          setData(jsonData);
          console.log(jsonData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
        console.log(data);
      };

      const handleDelete = async (questionId) => {
        try {
            const res = await fetch(`http://localhost:8080/datahistory/${questionId}`, {
                method: 'DELETE',
            });
            const jsonData = await res.json();
            console.log(jsonData);
            fetchData();
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };

      
      const handleClick = (questionId) => {
        const url = `/datahistory/${questionId}`
        navigate(url);
      }

    
      return (
     <div>
        <h1>Data from the database</h1>
        <h1>All data</h1>
        <ul>
        {Array.isArray(data) &&
          data.map((item) => (
            <li key={item.id}>
            {item.id}
            <DeleteIcon onClick={() => handleDelete(item.id)} style={{cursor: "pointer"}}></DeleteIcon>
            <button onClick={() => handleClick(item.id)}>Show Information</button>
          </li>
        ))}
        </ul>
    </div>
      );
    }

export default HistoryPage;