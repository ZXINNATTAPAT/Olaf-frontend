import React from "react";
import Label from "../atoms/Label";
import Input from "../atoms/Input";

export default function FormField({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  invalid = false,
  errorMessage,
  icon,
  ...props
}) {
  return (
    <div className="mb-4">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        {/* {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none flex items-center">
            {icon}
          </span>
        )} */}
        <Input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          invalid={invalid}
          className={icon ? "pl-14" : ""}
          {...props}
        />
      </div>
      {invalid && errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}
