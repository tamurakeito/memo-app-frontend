import "./index.scss";

import { MemoCard } from "components/memo-card";
import { TopBar } from "components/top-bar";
import { Swiper } from "components/swiper";
import { PlusButton } from "ui/molecules/plus-button";
import { Navigation } from "components/navigation";
import { useEffect, useState } from "react";
import { Shadow } from "ui/atoms/shadow";
import { Menu } from "components/menu";
import { ListSummaryType } from "types/types";
import { getListSummary } from "data/api/getListSummary";
import { useListContext } from "provider/list-provider";

export const Home = () => {
  // const [list, setList] = useState<Array<ListSummaryType>>([]);
  const { list, setListData } = useListContext();
  useEffect(() => {
    (async () => {
      const response = await getListSummary();
      !!response && setListData(response);
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
  return (
    <div className={"Home"}>
      <TopBar
        onClickHamburger={handleClickNavigation}
        onClickTag={handleClickTag}
        onClickOption={handleClickMenu}
      />
      <Swiper
        pages={list.map((memo, index) => (
          <MemoCard key={index} id={memo.id} />
        ))}
      />
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
