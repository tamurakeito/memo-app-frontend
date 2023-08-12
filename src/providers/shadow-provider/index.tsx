import React, { ReactNode, useContext, useState } from "react";

const handleClickNil = () => {
  console.log("shadow-provider unimplement.");
};

export type ShadowContext = {
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
  isSwipe: boolean;
  setIsSwipe: (isSwipe: boolean) => void;
};

const ShadowContext = React.createContext<ShadowContext>({
  isActive: false,
  setIsActive: handleClickNil,
  isSwipe: false,
  setIsSwipe: handleClickNil,
});

export const ShadowContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isSwipe, setIsSwipe] = useState(false);
  return (
    <ShadowContext.Provider
      value={{
        isActive,
        setIsActive,
        isSwipe,
        setIsSwipe,
      }}
    >
      {children}
    </ShadowContext.Provider>
  );
};

export const useShadowContext = (): ShadowContext => {
  return useContext(ShadowContext);
};
