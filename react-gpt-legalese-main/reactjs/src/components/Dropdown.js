import React from 'react';

const Dropdown = ({ options, selectedOption, onOptionChange }) => {
  return (
    <select value={selectedOption} onChange={(e) => onOptionChange(e.target.value)}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};


export default Dropdown;