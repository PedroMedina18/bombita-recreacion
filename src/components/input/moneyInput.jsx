import React, { useState, useRef } from 'react';

function MoneyInput() {
  const [value, setValue] = useState('0,00');
  const inputRef = useRef(null);

  function handleChange(event) {
    const inputValue = event.target.value.replace(/[^\d]/g, ''); // allow only digits
    let formattedValue = '0,00';
    let integerPart = '';
    let decimalPart = '';

    // separate integer and decimal parts
    if (inputValue.length > 2) {
      integerPart = inputValue.slice(0, -2);
      decimalPart = inputValue.slice(-2);
    } else {
      integerPart = inputValue;
    }

    // format integer part
    integerPart = integerPart.replace(/^0/, ''); // remove leading zeros
    if (integerPart.length > 3) {
      integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    } else if (integerPart.length < 3) {
      integerPart = integerPart.padStart(3, '0'); // add leading zeros if less than 3 digits
    }

    // combine integer and decimal parts
    if (decimalPart) {
      formattedValue = `${integerPart},${decimalPart}`;
    } else {
      formattedValue = `${integerPart},00`;
    }

    // update state and input value
    setValue(formattedValue);

    // move cursor to the end of the input field
    const cursorPosition = formattedValue.length;
    inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
  }

  function handleFocus() {
    // move cursor to the end of the input field on focus
    const cursorPosition = value.length;
    inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
  }

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      onFocus={handleFocus}
      ref={inputRef}
      style={{
        textAlign: 'right',
        fontSize: '1.5em',
      }}
    />
  );
}

export default MoneyInput;




// import React, { useState, useRef } from 'react';

// function MoneyInput() {
//   const [value, setValue] = useState('0.00');
//   const inputRef = useRef(null);

//   function handleChange(event) {
//     const inputValue = event.target.value.replace(/[^\d\.]/g, ''); // allow only digits and dot
//     let formattedValue = '';
//     let decimalPart = '';

//     // separate integer and decimal parts
//     const parts = inputValue.split('.');
//     if (parts.length > 1) {
//       decimalPart = '.' + parts[1];
//     }

//     // format integer part with commas
//     const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

//     // combine integer and decimal parts
//     formattedValue = integerPart + decimalPart;

//     // update state and input value
//     setValue(formattedValue);

//     // move cursor to the end of the input field
//     const cursorPosition = formattedValue.length;
//     inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
//   }

//   function handleFocus() {
//     // move cursor to the end of the input field on focus
//     const cursorPosition = value.length;
//     inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
//   }

//   return (
//     <input
//       type="text"
//       value={value}
//       onChange={handleChange}
//       onFocus={handleFocus}
//       ref={inputRef}
//     />
//   );
// }

// export default MoneyInput;