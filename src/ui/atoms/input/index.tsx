import React from "react";

import "./index.scss";

import classNames from "classnames";

export const Input = ({
  className,
  type,
  value,
  placeholder,
  onChange,
  onKeyDown,
  readOnly = false,
}: {
  className?: Array<string>;
  type: "text" | "number" | "email" | "password";
  value: string | number;
  placeholder: string;
  // onChange: React.Dispatch<React.SetStateAction<string>>;
  onChange: (value: string) => void;
  onKeyDown?: () => void;
  readOnly?: boolean;
}) => {
  const classes = classNames(className && className);
  return !readOnly ? (
    <input
      className={classes}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={(event) => {
        event.key === "Enter" && !!onKeyDown && onKeyDown();
      }}
      autoFocus={true}
    />
  ) : (
    <input
      className={classes}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={(event) => {
        event.key === "Enter" && !!onKeyDown && onKeyDown();
      }}
      readOnly
    />
  );
};
