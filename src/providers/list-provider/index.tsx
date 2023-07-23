import React, { ReactNode, useContext, useState } from "react";
import { ListSummaryType } from "types/types";

export type ListContext = {
  list: Array<ListSummaryType>;
  setListData: (List: Array<ListSummaryType>) => void;
};

const ListContext = React.createContext<ListContext>({
  list: [],
  setListData: () => {
    console.log("List-provider unimplement.");
  },
});

export const ListContextProvider = ({ children }: { children: ReactNode }) => {
  const [list, setList] = useState<Array<ListSummaryType>>([]);
  const setListData = (list: Array<ListSummaryType>) => {
    setList(list);
  };
  return (
    <ListContext.Provider value={{ list, setListData }}>
      {children}
    </ListContext.Provider>
  );
};

export const useListContext = (): ListContext => {
  return useContext(ListContext);
};
