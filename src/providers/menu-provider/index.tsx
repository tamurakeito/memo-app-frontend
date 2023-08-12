import React, { ReactNode, useContext, useState } from "react";

export type MenuContext = {
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
};

const MenuContext = React.createContext<MenuContext>({
  isActive: false,
  setIsActive: () => {
    console.log("menu-provider unimplement.");
  },
});

export const MenuContextProvider = ({ children }: { children: ReactNode }) => {
  const [isActive, setIsActive] = useState(false);
  return (
    <MenuContext.Provider value={{ isActive, setIsActive }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenuContext = (): MenuContext => {
  return useContext(MenuContext);
};
