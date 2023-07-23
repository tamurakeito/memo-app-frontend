import "./index.scss";

import { MemoCard } from "components/memo-card";
import { TopBar } from "components/top-bar";
import { Swiper } from "components/swiper";
import { PlusButton } from "ui/molecules/plus-button";
import { Navigation } from "components/navigation";
import { useEffect, useState } from "react";
import { Shadow } from "ui/atoms/shadow";
import { Menu } from "components/menu";
import { getListSummary } from "data/api/getListSummary";
import { useListContext } from "providers/list-provider";
import { useTabContext } from "providers/tab-provider";
import {
  ExceptionDisplay,
  ExceptionIcons,
} from "ui/molecules/exception-display";

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
  const [isActiveNavigation, setIsActiveNavigation] = useState(false);
  const [isActiveMenu, setIsActiveMenu] = useState(false);
  const [isActiveShadow, setIsActiveShadow] = useState(false);
  const handleClickNavigation = () => {
    setIsActiveNavigation(!isActiveNavigation);
    setIsActiveShadow(!isActiveShadow);
  };
  const handleClickMenu = () => {
    setIsActiveMenu(!isActiveMenu);
    setIsActiveShadow(!isActiveShadow);
  };
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
            <TopBar
              onClickHamburger={handleClickNavigation}
              isTag={isTag}
              onClickTag={handleClickTag}
              onClickOption={handleClickMenu}
            />
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
      <Navigation
        list={list}
        active={isActiveNavigation}
        swipeHandler={handleClickNavigation}
      />
      <Menu active={isActiveMenu} />
      <Shadow
        isActive={isActiveShadow}
        onClick={isActiveNavigation ? handleClickNavigation : handleClickMenu}
        swipeHandler={isActiveNavigation ? handleClickNavigation : () => {}}
      />
    </div>
  );
};
