import { IconButton } from "ui/molecules/icon-button";
import "./index.scss";
import { Tag, Menu, MoreVertical } from "react-feather";
import { useTabContext } from "providers/tab-provider";
import { useListContext } from "providers/list-provider";
import { useEffect, useState } from "react";
import { useNaviContext } from "providers/navi-provider";
import { useMenuContext } from "providers/menu-provider";
import { putRestatusTag } from "data/api/putRestatusTag";
import { MemoTagType } from "types/types";
import { getMemoSummary } from "data/api/getMemoSummary";
import { useErrorContext } from "providers/error-provider";
import { setToast } from "components/toast";

export const TopBar = () => {
  const setIsActiveNavi = useNaviContext().setIsActive;
  const setIsActiveMenu = useMenuContext().setIsActive;
  const onClickHamburger = () => {
    setIsActiveNavi(true);
    // setIsActiveShadow(true);
    // setIsSwipe(true);
  };
  const onClickOption = () => {
    setIsActiveMenu(true);
    // setIsActiveShadow(true);
    // setIsSwipe(true);
  };

  const [isTag, setIsTag] = useState(false);
  const { list, setListData } = useListContext();
  const { setIsError } = useErrorContext();
  const { tab } = useTabContext();
  useEffect(() => {
    tab !== undefined && setIsTag(list[tab].tag);
  }, [tab]);
  const success = async () => {
    const response = await getMemoSummary();
    !!response ? setListData(response) : setIsError(true);
  };
  const failure = () => {
    setToast("ステータスの変更に失敗しました", false);
  };
  const onClickTag = async () => {
    if (tab !== undefined) {
      const data: MemoTagType = {
        id: list[tab].id,
        tag: list[tab].tag,
      };
      const response = await putRestatusTag(data);
      console.log(response);
      !!response ? success() : failure();
    }
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
