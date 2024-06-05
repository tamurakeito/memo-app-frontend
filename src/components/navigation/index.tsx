import "./index.scss";
import classNames from "classnames";
import { ReactNode, useContext, useEffect, useState } from "react";
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
import { useMemoContext } from "providers/memo-provider";
import { getMemoSummary } from "data/api/getMemoSummary";
import { postAddMemo } from "data/api/postAddMemo";
import { useToastContext } from "providers/toast-provider";
import { log } from "console";
import { LoadStateContext } from "pages/home";
import { useErrorContext } from "providers/error-provider";
import { MemoDetailType } from "types/types";

export const Navigation = ({ handleReload }: { handleReload: () => void }) => {
  const { isActive, setIsActive } = useNaviContext();
  const classes = classNames(["Navigation", isActive && "active"]);
  const { list, setListData } = useMemoContext();
  const swipeHandlers = useSwipeable({
    onSwiped: (event) => {
      if (event.dir === "Left") {
        setIsActive(false);
      }
    },
    trackMouse: true,
  });

  // useEffect(() => {
  //   !isActive &&
  //     (() => {
  //       handleReload(); // →handleGetMemoSummary();
  //     })();
  // }, [isActive]);

  const [isAddMemo, setIsAddMemo] = useState(false);
  const handleOnPlus = () => {
    setIsAddMemo(true);
    // setTabIndex(undefined);
  };
  return (
    <>
      <div className={classes} {...swipeHandlers}>
        {/* <Line top={88} /> */}
        {list.length > 0 ? (
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
              {isAddMemo && <AddMemoList setIsActive={setIsAddMemo} />}
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
  const setIsActiveNavi = useNaviContext().setIsActive;
  const { setIsLoading } = useContext(LoadStateContext);
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
    response
      ? (async () => {
          const response = await getMemoSummary();
          !!response
            ? (() => {
                setListData(response);
                setTabIndex(response.length - 1);
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
            isSuccess: false,
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
