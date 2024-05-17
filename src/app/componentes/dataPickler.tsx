'use client'
import React, { useState } from 'react';

const DateSelector: React.FC = () => {
  // Estado para armazenar a data selecionada
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Manipulador de evento para a mudança na seleção da data
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
    var dataArray:string[] = (event.target.value.split("-")) ?? '';
    // Aqui você pode fazer o que quiser com a data selecionada, como enviar para a API, etc.
    console.log(`Data selecionada: ${dataArray[2]}/${dataArray[1]}/${dataArray[0]}`);
  };

  return (
    <div>
      <label htmlFor="datePicker">Selecione uma data:</label>
      <input
        type="date"
        id="datePicker"
        name="datePicker"
        value={selectedDate}
        onChange={handleDateChange}
      />
    </div>
  );
};

export default DateSelector;
