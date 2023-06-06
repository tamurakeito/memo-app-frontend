import React, { ReactNode, useContext, useState } from "react";

export type TabContext = {
  tab: number;
  setTabIndex: (tab: number) => void;
};

const TabContext = React.createContext<TabContext>({
  tab: 0,
  setTabIndex: () => {
    console.log("tab-provider unimplement.");
  },
});

export const TabContextProvider = ({ children }: { children: ReactNode }) => {
  const [tab, setTab] = useState(0);
  const setTabIndex = (tabIndex: number) => {
    setTab(tabIndex);
  };
  return (
    <TabContext.Provider value={{ tab, setTabIndex }}>
      {children}
    </TabContext.Provider>
  );
};

export const useTabContext = (): TabContext => {
  return useContext(TabContext);
};
