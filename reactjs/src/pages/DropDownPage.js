import Dropdown from "../components/Dropdown";
import { useState } from "react";

function DropDownPage() {
    const [selectedOption, setSelectedOption] = useState('openai');

    const options = ['openai', 'local'];

    const handleOptionChange = (selectedOption) => {
        setSelectedOption(selectedOption);

        fetch('http://localhost:8080/selectedOption', {
            method: 'POST', // Voit käyttää myös GET- tai muuta metodia tarpeen mukaan
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selectedOption: selectedOption }),
          })
            .then((response) => response.json())
            .then((data) => {
              // Voit käsitellä vastauksen dataa tarpeen mukaan
            })
            .catch((error) => {
              // Käsittely virheitä varten
            });
    };

    return (
        <div>
            <h1>Choose model</h1>
            <Dropdown options={options} selectedOption={selectedOption} onOptionChange={handleOptionChange} />
            <p>Selected Option: {selectedOption}</p>
        </div>

    );
}

export default DropDownPage;