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
  }, []);

  const [isAddMemo, setIsAddMemo] = useState(false);
  const handleOnPlus = () => {
    setIsAddMemo(true);
    // setTabIndex(undefined);
  };
  return (
    <>
      <div className={classes} {...swipeHandlers}>
        {/* <Line top={88} /> */}
        <ScrollArea className={"memo-box-container"}>
          <MemoListBox isTagged={true}>
            {list.map(
              (memo, index) =>
                memo.tag && (
                  <MemoList
                    key={index}
                    index={index}
                    length={memo.length}
                    isAddMemo={isAddMemo}
                  >
                    {memo.name}
                  </MemoList>
                )
            )}
          </MemoListBox>
          <MemoListBox isTagged={false} handleOnPlus={handleOnPlus}>
            {isAddMemo && <AddMemoList setIsActive={setIsAddMemo} />}
            {list.map(
              (memo, index) =>
                !memo.tag && (
                  <MemoList
                    key={index}
                    index={index}
                    length={memo.length}
                    isAddMemo={isAddMemo}
                  >
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
        isSwipe={"left"}
      />
    </>
  );
};

const MemoListBox = ({
  children,
  isTagged,
  handleOnPlus,
}: {
  children: ReactNode;
  isTagged: boolean;
  handleOnPlus?: () => void;
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
          {isTagged ? "固定" : "メモ"}
        </Text>
        {!isTagged && (
          <div className={"memo-add"} onClick={handleOnPlus}>
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
  isAddMemo,
}: {
  children: string;
  index: number;
  length: number;
  isAddMemo: boolean;
}) => {
  const { tab, setTabIndex } = useTabContext();
  const setIsActiveNavi = useNaviContext().setIsActive;
  const classes = classNames([
    "MemoList",
    index === tab && !isAddMemo && "selected",
  ]);
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

const AddMemoList = ({
  setIsActive,
}: {
  setIsActive: (value: boolean) => void;
}) => {
  const [value, setValue] = useState("");
  const { setTabIndex } = useTabContext();
  const setIsActiveNavi = useNaviContext().setIsActive;
  const handleOnBlur = (value: string) => {
    value ? handleOnEnter() : setIsActive(false);
  };
  const handleOnEnter = () => {
    setIsActiveNavi(false);
  };
  return (
    <div className={"MemoList AddMemoList"} onClick={() => {}}>
      <Circle className={"memo-point"} size={12} />
      <input
        className={"content-text"}
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        autoFocus={true}
        onBlur={() => handleOnBlur(value)}
        onKeyDown={(event) => {
          event.key === "Enter" && handleOnEnter();
        }}
      />
    </div>
  );
};
