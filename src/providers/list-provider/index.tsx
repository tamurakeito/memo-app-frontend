import React, { ReactNode, useContext, useState } from "react";
import { MemoSummaryType } from "types/types";

export type ListContext = {
  list: Array<MemoSummaryType>;
  setListData: (List: Array<MemoSummaryType>) => void;
};

const ListContext = React.createContext<ListContext>({
  list: [],
  setListData: () => {
    console.log("List-provider unimplement.");
  },
});

export const ListContextProvider = ({ children }: { children: ReactNode }) => {
  const [list, setList] = useState<Array<MemoSummaryType>>([]);
  const setListData = (list: Array<MemoSummaryType>) => {
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
