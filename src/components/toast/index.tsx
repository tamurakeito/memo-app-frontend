import { useState } from "react";
import "./index.scss";

export const Toaster = () => {
  const [content, setContent] = useState("");
  return <div className="Toast">{content}</div>;
};

export const setToast = (
  content: string,
  isSuccess?: boolean,
  duration?: number
) => {
  console.log();
};
