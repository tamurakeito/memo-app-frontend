import "./index.scss";
import classNames from "classnames";
import { ReactNode, useContext, useEffect, useState } from "react";
import { Bookmark, Circle, Plus } from "react-feather";
import { ScrollArea } from "ui/atoms/scroll-area";
import { Text } from "ui/atoms/text";
import { TextSizes } from "ui/atoms/text";
import { useSwipeable } from "react-swipeable";
import { useTabContext } from "providers/tab-provider";
import { useNaviContext } from "providers/navi-provider";
import { Shadow } from "ui/atoms/shadow";
import { useMemoContext } from "providers/memo-provider";
import { getMemoSummary } from "data/api/getMemoSummary";
import { postAddMemo } from "data/api/postAddMemo";
import { useToastContext } from "providers/toast-provider";
import { AppStateContext } from "pages/home";
import { useErrorContext } from "providers/error-provider";
import { MemoDetailType } from "types/types";
import { SortableList } from "components/sortable-list";
import { putMemoOderOverride } from "data/api/putMemoOderOverride";

export const Navigation = () => {
  const { isActive, setIsActive } = useNaviContext();
  const classes = classNames(["Navigation", isActive && "active"]);
  const { list, setListData } = useMemoContext();
  const { setTabIndex } = useTabContext();
  const { setToast } = useToastContext();
  const swipeHandlers = useSwipeable({
    onSwiped: (event) => {
      if (event.dir === "Left") {
        setIsActive(false);
      }
    },
    trackMouse: true,
  });

  const [isAddMemo, setIsAddMemo] = useState(false);
  const handleOnPlus = () => {
    setIsAddMemo(true);
  };

  const tagCount = list.filter((memo) => memo.tag).length;

  const moveItem = async (fromIndex: number, toIndex: number) => {
    const originalOder = list;
    const moveMemo = list[fromIndex];
    const spliceArr = list.filter((_, index) => index !== fromIndex);
    const newOder = [
      ...spliceArr.slice(0, toIndex),
      moveMemo,
      ...spliceArr.slice(toIndex, spliceArr.length),
    ];
    setListData(newOder);
    const response = await putMemoOderOverride(newOder.map((memo) => memo.id));
    if (response) {
      setTabIndex(toIndex);
    } else {
      setListData(originalOder);
      setToast({
        content: "エラー：メモの並べ替えに失敗しました",
        isActive: true,
        duration: 1500,
      });
    }
  };

  const [isHover, setIsHover] = useState(false);
  const handleMouseHover = () => {
    if (!isActive) {
      setIsHover(true);
      setIsActive(true);
    }
  };
  const handleMouseLeave = () => {
    if (isHover) {
      setIsHover(false);
      setIsActive(false);
    }
  };

  return (
    <>
      <div
        className={classes}
        {...swipeHandlers}
        onMouseLeave={handleMouseLeave}
      >
        {list.length > 0 ? (
          <ScrollArea className={"memo-box-container"}>
            <MemoListBox isTagged={true}>
              <SortableList
                list={list
                  .filter((memo) => memo.tag)
                  .map((memo, index) => (
                    <MemoList
                      key={index}
                      index={index}
                      length={memo.length}
                      isAddMemo={isAddMemo}
                    >
                      {memo.name}
                    </MemoList>
                  ))}
                moveItem={moveItem}
              />
            </MemoListBox>
            <MemoListBox isTagged={false} handleOnPlus={handleOnPlus}>
              {isAddMemo && <AddMemoList setIsActive={setIsAddMemo} />}
              <SortableList
                list={list
                  .filter((memo) => !memo.tag)
                  .map((memo, index) => (
                    <MemoList
                      key={index}
                      index={index + tagCount}
                      length={memo.length}
                      isAddMemo={isAddMemo}
                    >
                      {memo.name}
                    </MemoList>
                  ))}
                adjuster={tagCount}
                moveItem={(fromIndex: number, toIndex: number) =>
                  moveItem(fromIndex + tagCount, toIndex + tagCount)
                }
              />
            </MemoListBox>
          </ScrollArea>
        ) : (
          <ScrollArea className={"memo-box-container"}>
            <MemoListBox isTagged={false} handleOnPlus={handleOnPlus}>
              {isActive && <AddMemoList setIsActive={setIsActive} />}
            </MemoListBox>
          </ScrollArea>
        )}
        {/* <Line bottom={137} /> */}
        {/* <Settings className={"icon-setting"} size={16} /> */}
      </div>
      <div
        className={"navigation-hover-area"}
        onMouseEnter={handleMouseHover}
      />
      <Shadow
        isActive={isActive}
        handleClick={() => {
          setIsActive(false);
        }}
        handleSwipeLeft={() => {
          setIsActive(false);
        }}
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
          <Bookmark className={"tag-point"} size={16} />
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
  const setIsActiveNavi = useNaviContext().setIsActive;
  const { setIsLoading } = useContext(AppStateContext);
  const { setToast } = useToastContext();
  const { setIsError } = useErrorContext();
  const { setListData } = useMemoContext();
  const { setTabIndex } = useTabContext();
  const handleOnBlur = (value: string) => {
    value ? handleOnEnter() : setIsActive(false);
  };
  const handleOnEnter = async () => {
    setIsActiveNavi(false);
    setIsLoading(true);
    const data: MemoDetailType = {
      id: 0, // バックエンドで無視されるid（errで末尾にデータ挿入される）
      name: value,
      tag: false,
      tasks: [],
    };
    const response = await postAddMemo(data);
    const id = response?.id;
    response
      ? (async () => {
          const response = await getMemoSummary();
          !!response
            ? (() => {
                setListData(response);
                const index = response.findIndex((memo) => memo.id === id);
                setTabIndex(index);
                setIsLoading(false);
              })()
            : (() => {
                setIsError(true);
                setIsLoading(false);
              })();
        })()
      : (() => {
          setToast({
            content: "メモの追加に失敗しました",
            isActive: true,
            duration: 1500,
          });
          setIsLoading(false);
        })();
    setIsActive(false);
  };
  // IME入力時に確定させない
  const [isTyping, setIsTyping] = useState(false);
  return (
    <div className={"MemoList AddMemoList"}>
      <Circle className={"memo-point"} size={12} />
      <input
        className={"content-text"}
        type="text"
        value={value}
        placeholder="新規メモ"
        onChange={(event) => setValue(event.target.value)}
        autoFocus={true}
        onBlur={() => handleOnBlur(value)}
        onCompositionStart={() => setIsTyping(true)}
        onCompositionEnd={() => setIsTyping(false)}
        onKeyDown={(event) => {
          (event.key === "Enter" || event.key === "Done") &&
            !isTyping &&
            handleOnEnter();
        }}
      />
    </div>
  );
};
