import { IconButton } from "ui/molecules/icon-button";
import "./index.scss";
import { Tag, Menu, MoreVertical } from "react-feather";
import { useTabContext } from "providers/tab-provider";
import { useMemoContext } from "providers/memo-provider";
import { useEffect, useState } from "react";
import { useNaviContext } from "providers/navi-provider";
import { useMenuContext } from "providers/menu-provider";
import { MemoDetailType, MemoSummaryType } from "types/types";
import { getMemoSummary } from "data/api/getMemoSummary";
import { useErrorContext } from "providers/error-provider";
import { useToastContext } from "providers/toast-provider";
import { putRestatusMemo } from "data/api/putRestatusMemo";
import { getMemoDetail } from "data/api/getMemoDetail";
import { Line } from "ui/atoms/line";

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
  const { list, setListData } = useMemoContext();
  const { setIsError } = useErrorContext();
  const { tab, setTabIndex } = useTabContext();
  const { setToast } = useToastContext();
  useEffect(() => {
    tab !== undefined && list.length > 0 && setIsTag(list[tab].tag);
  }, [tab, list]);
  const onClickTag = async () => {
    if (tab !== undefined) {
      const id = list[tab].id;
      const data: MemoSummaryType = {
        id: id,
        name: list[tab].name,
        tag: !list[tab].tag,
        length: 0,
      };
      const response = await putRestatusMemo(data);
      !!response
        ? (async () => {
            const response = await getMemoSummary();
            !!response
              ? (() => {
                  setListData(response);
                  // そのメモのtabに変更する
                  setTabIndex(
                    response.findIndex((element) => element.id === id)
                  );
                })()
              : setIsError(true);
          })()
        : (() => {
            setToast({
              content: "ステータスの変更に失敗しました",
              isSuccess: false,
              // duration: ,
            });
          })();
    }
  };

  return (
    <div className={"TopBar"}>
      <IconButton
        className={"HamburgerIconButton"}
        defaultIcon={<Menu size={17} />}
        onClick={onClickHamburger}
      />
      {list.length > 0 && (
        <>
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
        </>
      )}
      <Line top={47} />
    </div>
  );
};
