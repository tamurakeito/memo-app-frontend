import { IconButton } from "ui/molecules/icon-button";
import "./index.scss";
import { Tag, Menu, MoreVertical } from "react-feather";
import { useTabContext } from "providers/tab-provider";
import { useListContext } from "providers/list-provider";
import { useEffect, useState } from "react";
import { useNaviContext } from "providers/navi-provider";
import { useMenuContext } from "providers/menu-provider";
import { MemoDetailType } from "types/types";
import { getMemoSummary } from "data/api/getMemoSummary";
import { useErrorContext } from "providers/error-provider";
import { useToastContext } from "providers/toast-provider";
import { putRestatusMemo } from "data/api/putRestatusMemo";
import { getMemoDetail } from "data/api/getMemoDetail";

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
  const { setToast } = useToastContext();
  useEffect(() => {
    tab !== undefined && setIsTag(list[tab].tag);
  }, [tab]);
  const success = async () => {
    const response = await getMemoSummary();
    !!response ? setListData(response) : setIsError(true);
  };
  const failure = () => {
    setToast({
      content: "ステータスの変更に失敗しました",
      isSuccess: false,
      // duration: ,
    });
  };
  const onClickTag = async () => {
    if (tab !== undefined) {
      const id = list[tab].id;
      const detail = await getMemoDetail(id);
      const data: MemoDetailType = {
        id: id,
        name: detail ? detail.name : list[tab].name,
        tag: !list[tab].tag,
        tasks: detail ? detail.tasks : [],
      };
      const response = await putRestatusMemo(data);
      // !!response ? success() : failure();
      failure();
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
