import { Check, ChevronUp, Circle, X } from "react-feather";
import "./index.scss";
import { Text, TextSizes } from "ui/atoms/text";
import { ReactNode, useEffect, useState } from "react";
import { Line } from "ui/atoms/line";
import classNames from "classnames";
import { IconButton } from "ui/molecules/icon-button";
import { ScrollArea } from "ui/atoms/scroll-area";
import { ListDetailType } from "types/types";
import { getListDetail } from "data/api/getListDetail";

export const MemoCard = ({ id }: { id: number }) => {
  const [memo, setMemo] = useState<ListDetailType>();
  useEffect(() => {
    (async () => {
      const response = await getListDetail(id);
      !!response && setMemo(response);
    })();
  }, []);
  return (
    <ScrollArea className={"MemoCard"}>
      <Line top={0} />
      {!!memo ? (
        <div className={"memo-card"}>
          <InCompleteContainer>
            <TitleBlock>{memo.name}</TitleBlock>
            {memo.tasks.map(
              (task, index) =>
                !task.complete && (
                  <ListBlock key={index} isComplete={false}>
                    {task.name}
                  </ListBlock>
                )
            )}
          </InCompleteContainer>
          {memo.tasks.filter((task) => task.complete === true).length > 0 && (
            <>
              <Line />
              <CompleteContainer>
                {memo.tasks.map(
                  (task, index) =>
                    task.complete && (
                      <ListBlock key={index} isComplete={true}>
                        {task.name}
                      </ListBlock>
                    )
                )}
              </CompleteContainer>
            </>
          )}
        </div>
      ) : (
        <div>エラー</div>
      )}
    </ScrollArea>
  );
};

const InCompleteContainer = ({ children }: { children: ReactNode }) => {
  return <div className={"InCompleteContainer"}>{children}</div>;
};

const CompleteContainer = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);
  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  const classesContainer = classNames([
    "CompleteContainer",
    !isOpen && "close",
  ]);
  const classesArrow = classNames(["arrow", isOpen && "open"]);
  const classesBox = classNames(["complete-box", isOpen && "open"]);
  return (
    <div className={classesContainer}>
      <div className={"toggle"} onClick={handleClick}>
        <Text className={"kanryou"} size={TextSizes.text2}>
          完了
        </Text>
        <div className={classesArrow}>
          <ChevronUp />
        </div>
      </div>
      <div className={classesBox}>{children}</div>
    </div>
  );
};

const TitleBlock = ({ children }: { children: ReactNode }) => {
  return (
    <div className={"TitleBlock"}>
      <Circle size={16} />
      <Text size={TextSizes.title} className={"block-content"}>
        {children}
      </Text>
    </div>
  );
};

const ListBlock = ({
  children,
  isComplete,
}: {
  children: ReactNode;
  isComplete: boolean;
}) => {
  return (
    <div className={"ListBlock"}>
      {!isComplete ? (
        <Circle className={"point-icon"} size={16} />
      ) : (
        <Check className={"point-icon complete"} size={16} />
      )}
      <Text
        size={!isComplete ? TextSizes.text1 : TextSizes.text2}
        className={"block-content"}
      >
        {children}
      </Text>
      {isComplete && (
        <IconButton
          className={"delete-icon"}
          defaultIcon={<X size={18} />}
          onClick={() => {}}
        />
      )}
    </div>
  );
};
