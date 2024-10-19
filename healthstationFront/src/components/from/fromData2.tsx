import React from 'react';

interface FormFieldProps {
  name: string;
  placeholder: string;
  type: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormData2: React.FC<FormFieldProps> = ({
  name,
  placeholder,
  type,
  value,
  onChange,
}) => (
  <div className="mb-4">
    <label htmlFor={name} className="block mb-2" >
      {placeholder }
      <span className="text-red-500 absolute">*</span>
    </label>
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="border-2 border-b-4 text-left p-2 bg-gray-100 w-full"
    />
  </div>
);

export default FormData2;
