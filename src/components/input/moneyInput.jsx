import React, { useState, useRef } from 'react';

function MoneyInput() {
  const [value, setValue] = useState('0.00');

  const handleChange = (event) => {
    const inputValue = event.target.value.replace(/[^\d]/g, ''); // allow only digits
    let formattedValue = '0.00';
    let integerPart = '';
    let decimalPart = '';

    // separate integer and decimal parts
    if (inputValue.length > 2) {
      integerPart = inputValue.slice(0, -2);
      decimalPart = inputValue.slice(-2);
    } else {
      decimalPart = inputValue;
    }

    // format integer part
    integerPart = integerPart.replace(/^0/, ''); // remove leading zeros
    if (integerPart === '') {
      integerPart = '0';
    }

    // combine integer and decimal parts
    if (decimalPart) {
      formattedValue = `${integerPart}.${decimalPart}`;
    } else {
      formattedValue = `${integerPart}.00`;
    }

    // update state and input value
    setValue(formattedValue);

    // move cursor to the end of the input field
    const cursorPosition = formattedValue.length;
    event.target.setSelectionRange(cursorPosition, cursorPosition);
  }

  const setSelectionRange = (e) => {
    const texto = e.target.value
    e.target.setSelectionRange(texto.length, texto.length);
  }

  return (
    <>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={setSelectionRange}
        onClick={setSelectionRange}
        style={{
          textAlign: 'right',
          fontSize: '1.5em',
        }}
      />
    </>
  );
}

export default MoneyInput;

// necesito que modifiques esta funcion para cambiar el formato solo separa la parte entera de la decimal 