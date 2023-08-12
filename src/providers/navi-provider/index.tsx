import React, { ReactNode, useContext, useState } from "react";

export type NaviContext = {
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
};

const NaviContext = React.createContext<NaviContext>({
  isActive: false,
  setIsActive: () => {
    console.log("navi-provider unimplement.");
  },
});

export const NaviContextProvider = ({ children }: { children: ReactNode }) => {
  const [isActive, setIsActive] = useState(false);
  return (
    <NaviContext.Provider value={{ isActive, setIsActive }}>
      {children}
    </NaviContext.Provider>
  );
};

export const useNaviContext = (): NaviContext => {
  return useContext(NaviContext);
};
