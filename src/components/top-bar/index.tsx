import { IconButton } from "ui/molecules/icon-button";
import "./index.scss";
import { Tag, Menu, MoreVertical } from "react-feather";
import { useTabContext } from "providers/tab-provider";
import { useListContext } from "providers/list-provider";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { log } from "console";
import { useNaviContext } from "providers/navi-provider";
import { useShadowContext } from "providers/shadow-provider";
import { useMenuContext } from "providers/menu-provider";

export const TopBar = () => {
  const setIsActiveNavi = useNaviContext().setIsActive;
  const setIsActiveMenu = useMenuContext().setIsActive;
  const setIsActiveShadow = useShadowContext().setIsActive;
  const { setIsSwipe } = useShadowContext();
  const onClickHamburger = () => {
    setIsActiveNavi(true);
    setIsActiveShadow(true);
    setIsSwipe(true);
  };
  const onClickOption = () => {
    setIsActiveMenu(true);
    setIsActiveShadow(true);
    setIsSwipe(true);
  };

  const [isTag, setIsTag] = useState(false);
  const onClickTag = () => {
    setIsTag(!isTag);
  };

  return (
    <div className={"TopBar"}>
      <IconButton
        className={"HamburgerIconButton"}
        defaultIcon={<Menu size={17} />}
        onClick={onClickHamburger}
      />
      <IconButton
        className={`TagIconButton ${isTag && "tagged"}`}
        defaultIcon={<Tag size={17} />}
        onClick={onClickTag}
      />
      <IconButton
        className={"OptionIconButton"}
        defaultIcon={<MoreVertical size={17} />}
        onClick={onClickOption}
      />
    </div>
  );
};
