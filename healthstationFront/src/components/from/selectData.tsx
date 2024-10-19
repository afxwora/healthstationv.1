// src/components/SelectData.tsx
import React from 'react';

type FormDataProps = {
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  options: { value: string; label: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; // เพิ่มพร็อพเพอร์ onChange
};

const SelectData: React.FC<FormDataProps> = ({
  id = "1",
  name = "เลือก",
  placeholder = "เลือกตัวเลือก",
  value = "",
  options,
  onChange, // เพิ่มพร็อพเพอร์ onChange
}) => {
  return (
    <div>
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-700">
        {name}
        <select
          id={id}
          name={id}
          className="form-select block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-base"
          value={value}
          onChange={onChange} 
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
    
  );
};

export default SelectData;
