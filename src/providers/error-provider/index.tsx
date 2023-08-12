import React, { ReactNode, useContext, useState } from "react";

export type ErrorContext = {
  isError: boolean;
  setIsError: (isError: boolean) => void;
};

const ErrorContext = React.createContext<ErrorContext>({
  isError: false,
  setIsError: () => {
    console.log("error-provider unimplement.");
  },
});

export const ErrorContextProvider = ({ children }: { children: ReactNode }) => {
  const [isError, setIsError] = useState(false);
  return (
    <ErrorContext.Provider value={{ isError, setIsError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useErrorContext = (): ErrorContext => {
  return useContext(ErrorContext);
};
