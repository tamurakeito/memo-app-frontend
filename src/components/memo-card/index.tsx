import { Check, ChevronUp, Circle, X } from "react-feather";
import "./index.scss";
import { Text, TextSizes } from "ui/atoms/text";
import { ReactNode, useEffect, useState } from "react";
import { Line } from "ui/atoms/line";
import classNames from "classnames";
import { IconButton } from "ui/molecules/icon-button";
import { ScrollArea } from "ui/atoms/scroll-area";
import { ListDetailType, TaskType } from "types/types";
import { getListDetail } from "data/api/getListDetail";
import { putRestatusTask } from "data/api/putRestatusTask";
import { useListContext } from "providers/list-provider";
import { getListSummary } from "data/api/getListSummary";
import { deleteTask } from "data/api/deleteTask";
import { log } from "console";

export const MemoCard = ({ id }: { id: number }) => {
  const [memo, setMemo] = useState<ListDetailType>();
  useEffect(() => {
    handleMemoLoad();
  }, []);

  const handleMemoLoad = async () => {
    const response = await getListDetail(id);
    !!response && setMemo(response);
  };

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
                  <ListBlock
                    key={index}
                    id={task.id}
                    name={task.name}
                    complete={false}
                    handleReload={handleMemoLoad}
                  />
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
                      <ListBlock
                        key={index}
                        id={task.id}
                        name={task.name}
                        complete={true}
                        handleReload={handleMemoLoad}
                      />
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
  id,
  name,
  complete,
  handleReload,
}: {
  id: number;
  name: string;
  complete: boolean;
  handleReload: () => void;
}) => {
  const data: TaskType = { id: id, name: name, complete: true };
  // const { list, setListData } = useListContext();
  const success = async () => {
    console.log("success");
  };
  const failure = () => {
    // setToast("ステータス変更に失敗しました", false);
  };
  const handleClickCheck = async () => {
    const response = await putRestatusTask(data);
    !!response ? handleReload() : failure();
  };
  const handleClickDelete = async () => {
    const response = await deleteTask(id);
    !!response ? handleReload() : failure();
  };
  return (
    <div className={"ListBlock"}>
      {!complete ? (
        <Circle className={"point-icon"} size={16} />
      ) : (
        <Check className={"point-icon complete"} size={16} />
      )}
      <Text
        size={!complete ? TextSizes.text1 : TextSizes.text2}
        className={"block-content"}
      >
        {name}
      </Text>
      {!complete ? (
        <IconButton
          className={"complete-icon"}
          defaultIcon={<Check size={18} />}
          onClick={handleClickCheck}
        />
      ) : (
        <IconButton
          className={"delete-icon"}
          defaultIcon={<X size={18} />}
          onClick={handleClickDelete}
        />
      )}
    </div>
  );
};
