import React from 'react';

type FormDataProps = {
  id?: string;
  name?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const FormDataComponent: React.FC<FormDataProps> = ({
  id = "1", 
  name = "field",
  placeholder = "Placeholder", 
  type = "text",
  value = "",
  onChange
}) => {
  return (
    <div>
      <label htmlFor={id} className="block mb-2">
        {placeholder}
      </label>
      <input
        type={type}
        className="border-2 border-b-4 text-left p-2 bg-gray-100 w-full"
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default FormDataComponent;
