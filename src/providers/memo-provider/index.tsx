import React, { ReactNode, useContext, useState } from "react";
import { MemoDetailType, MemoSummaryType } from "types/types";

export type MemoContext = {
  list: Array<MemoSummaryType>;
  setListData: (list: Array<MemoSummaryType>) => void;
  memo: MemoDetailType | undefined;
  setMemo: (memo: MemoDetailType) => void;
};

const MemoContext = React.createContext<MemoContext>({
  list: [],
  setListData: () => {
    console.log("memo-provider unimplement.");
  },
  memo: undefined,
  setMemo: () => {
    console.log("memo-provider unimplement.");
  },
});

export const MemoContextProvider = ({ children }: { children: ReactNode }) => {
  const [list, setList] = useState<Array<MemoSummaryType>>([]);
  const setListData = (list: Array<MemoSummaryType>) => {
    setList(list);
  };
  const [memo, setMemo] = useState<MemoDetailType>();
  return (
    <MemoContext.Provider value={{ list, setListData, memo, setMemo }}>
      {children}
    </MemoContext.Provider>
  );
};

export const useMemoContext = (): MemoContext => {
  return useContext(MemoContext);
};
