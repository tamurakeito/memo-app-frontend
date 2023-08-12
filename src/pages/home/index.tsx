import "./index.scss";

import { MemoCard } from "components/memo-card";
import { TopBar } from "components/top-bar";
import { Swiper } from "components/swiper";
import { PlusButton } from "ui/molecules/plus-button";
import { Navigation } from "components/navigation";
import { useEffect, useState } from "react";
import { getListSummary } from "data/api/getListSummary";
import { useListContext } from "providers/list-provider";
import { useTabContext } from "providers/tab-provider";
import {
  ExceptionDisplay,
  ExceptionIcons,
} from "ui/molecules/exception-display";
import { useNaviContext } from "providers/navi-provider";

export const Home = () => {
  const { list, setListData } = useListContext();
  const { tab } = useTabContext();
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    (async () => {
      const response = await getListSummary();
      !!response ? setListData(response) : setIsError(true);
    })();
  }, []);
  const setIsActiveNavi = useNaviContext().setIsActive;
  const [isActiveMenu, setIsActiveMenu] = useState(false);
  const [isActiveShadow, setIsActiveShadow] = useState(false);
  const [isTag, setIsTag] = useState(false);
  const handleClickTag = () => {
    setIsTag(!isTag);
  };
  useEffect(() => {
    list.length > 0 && setIsTag(list[tab].tag);
  }, [tab]);
  return (
    <div className={"Home"}>
      {!isError ? (
        list.length > 0 ? (
          <>
            <TopBar />
            <Swiper
              pages={list.map((memo, index) => (
                <MemoCard key={index} id={memo.id} />
              ))}
            />
          </>
        ) : (
          <ExceptionDisplay
            value="登録されているメモがありません"
            icon={ExceptionIcons.null}
          />
        )
      ) : (
        <ExceptionDisplay
          value="データの取得に失敗しました"
          icon={ExceptionIcons.fail}
        />
      )}
      <PlusButton />
      <Navigation list={list} />
    </div>
  );
};
