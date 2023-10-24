import React, { ReactNode, useContext, useState } from "react";
import { Toast } from "components/toast";

export type ToastContext = {
  toast?: Toast;
  setToast: (toast: Toast) => void;
};

const ToastContext = React.createContext<ToastContext>({
  toast: undefined,
  setToast: (_: Toast) => {
    console.log("toast-provider unimplement");
  },
});

export const ToastContextProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<Toast | undefined>();
  return (
    <ToastContext.Provider value={{ toast, setToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToastContext = (): ToastContext => {
  return useContext(ToastContext);
};
