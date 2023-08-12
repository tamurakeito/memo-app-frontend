import React from "react";
import toast, { Toaster } from "react-hot-toast";

export const setToast = (
  message: string,
  success?: boolean,
  duration?: number
) => {
  success === undefined
    ? toast(message, {
        duration: !!duration ? duration : 1000,
      })
    : success
    ? toast.success(message, {
        duration: !!duration ? duration : 1000,
      })
    : toast.error(message, {
        duration: !!duration ? duration : 1000,
      });
};

export const ToastProvider = () => {
  return <Toaster />;
};
