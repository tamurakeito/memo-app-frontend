import React, { ReactNode, useContext, useState } from "react";

export type TabContext = {
  tab: number | undefined;
  setTabIndex: (tab: number | undefined) => void;
};

const TabContext = React.createContext<TabContext>({
  tab: 0,
  setTabIndex: () => {
    console.log("tab-provider unimplement.");
  },
});

export const TabContextProvider = ({ children }: { children: ReactNode }) => {
  const [tab, setTab] = useState<number | undefined>(0);
  const setTabIndex = (tabIndex: number | undefined) => {
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
