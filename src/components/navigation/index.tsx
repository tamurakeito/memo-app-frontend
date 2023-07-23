import "./index.scss";
import classNames from "classnames";
import { ReactNode } from "react";
import { Circle, Plus, Tag } from "react-feather";
import { Line } from "ui/atoms/line";
import { ScrollArea } from "ui/atoms/scroll-area";
import { Text } from "ui/atoms/text";
import { TextSizes } from "ui/atoms/text";
import { Settings } from "react-feather";
import { useSwipeable } from "react-swipeable";
import { ListSummaryType } from "types/types";
import { useTabContext } from "providers/tab-provider";

export const Navigation = ({
  list,
  active,
  swipeHandler,
}: {
  list: Array<ListSummaryType>;
  active: boolean;
  swipeHandler: () => void;
}) => {
  const classes = classNames(["Navigation", active && "active"]);
  const swipeHandlers = useSwipeable({
    onSwiped: (event) => {
      if (event.dir === "Left") {
        swipeHandler();
      }
    },
    trackMouse: true,
  });
  return (
    <div className={classes} {...swipeHandlers}>
      <Line top={88} />
      <ScrollArea className={"memo-box-container"}>
        <MemoListBox isTagged={true}>
          {list.map(
            (memo, index) =>
              memo.tag && (
                <MemoList key={index} index={index}>
                  {memo.name}
                </MemoList>
              )
          )}
        </MemoListBox>
        <MemoListBox isTagged={false}>
          {list.map(
            (memo, index) =>
              !memo.tag && (
                <MemoList key={index} index={index}>
                  {memo.name}
                </MemoList>
              )
          )}
        </MemoListBox>
      </ScrollArea>
      <Line bottom={137} />
      <Settings className={"icon-setting"} size={16} />
    </div>
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

const MemoList = ({ children, index }: { children: string; index: number }) => {
  const { tab } = useTabContext();
  const classes = classNames(["MemoList", index === tab && "selected"]);
  return (
    <div className={classes}>
      <Circle className={"memo-point"} size={12} />
      <Text className={"content-text"} size={TextSizes.text1}>
        {children}
      </Text>
      <Text className={"memo-size"} size={TextSizes.text2}>
        {index}
      </Text>
    </div>
  );
};
