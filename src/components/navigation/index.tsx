import "./index.scss";
import classNames from "classnames";
import { ReactNode, useEffect, useState } from "react";
import { Circle, Plus, Tag } from "react-feather";
import { Line } from "ui/atoms/line";
import { ScrollArea } from "ui/atoms/scroll-area";
import { Text } from "ui/atoms/text";
import { TextSizes } from "ui/atoms/text";
import { Settings } from "react-feather";
import { useSwipeable } from "react-swipeable";
import { useTabContext } from "providers/tab-provider";
import { useNaviContext } from "providers/navi-provider";
import { Shadow } from "ui/atoms/shadow";
import { useListContext } from "providers/list-provider";
import { getMemoSummary } from "data/api/getMemoSummary";

export const Navigation = () => {
  const { isActive, setIsActive } = useNaviContext();
  const classes = classNames(["Navigation", isActive && "active"]);
  const { list, setListData } = useListContext();
  const isActiveNavi = useNaviContext().isActive;
  const swipeHandlers = useSwipeable({
    onSwiped: (event) => {
      if (event.dir === "Left") {
        setIsActive(false);
      }
    },
    trackMouse: true,
  });

  useEffect(() => {
    isActiveNavi &&
      (async () => {
        const response = await getMemoSummary();
        !!response
          ? setListData(response)
          : (() => {
              // setToast("ステータス変更に失敗しました", false);
            })();
      })();
  });
  return (
    <>
      <div className={classes} {...swipeHandlers}>
        {/* <Line top={88} /> */}
        <ScrollArea className={"memo-box-container"}>
          <MemoListBox isTagged={true}>
            {list.map(
              (memo, index) =>
                memo.tag && (
                  <MemoList key={index} index={index} length={memo.length}>
                    {memo.name}
                  </MemoList>
                )
            )}
          </MemoListBox>
          <MemoListBox isTagged={false}>
            {list.map(
              (memo, index) =>
                !memo.tag && (
                  <MemoList key={index} index={index} length={memo.length}>
                    {memo.name}
                  </MemoList>
                )
            )}
          </MemoListBox>
        </ScrollArea>
        <Line bottom={137} />
        <Settings className={"icon-setting"} size={16} />
      </div>
      <Shadow
        isActive={isActive}
        handleClick={() => {
          setIsActive(false);
        }}
        isSwipe={true}
      />
    </>
  );
};

const MemoListBox = ({
  children,
  isTagged,
}: {
  children: ReactNode;
  isTagged: boolean;
}) => {
  const classes = classNames(["MemoListBox"]);
  return (
    <div className={classes}>
      <div className={"tag-box"}>
        {isTagged ? (
          <Tag className={"tag-point"} size={16} />
        ) : (
          <Circle className={"memo-point"} size={14} />
        )}
        <Text className={"tag-text"} size={TextSizes.text2}>
          {isTagged ? "固定" : "リスト"}
        </Text>
        {!isTagged && (
          <div className={"memo-add"} onClick={() => {}}>
            <Plus size={16} />
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

const MemoList = ({
  children,
  index,
  length,
}: {
  children: string;
  index: number;
  length: number;
}) => {
  const { tab, setTabIndex } = useTabContext();
  const setIsActiveNavi = useNaviContext().setIsActive;
  const classes = classNames(["MemoList", index === tab && "selected"]);
  const handleClick = () => {
    setTabIndex(index);
    setIsActiveNavi(false);
  };
  return (
    <div className={classes} onClick={handleClick}>
      <Circle className={"memo-point"} size={12} />
      <Text className={"content-text"} size={TextSizes.text1}>
        {children}
      </Text>
      <Text className={"memo-size"} size={TextSizes.text2}>
        {length}
      </Text>
    </div>
  );
};
