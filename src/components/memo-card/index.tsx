import { Check, ChevronUp, Circle, X } from "react-feather";
import "./index.scss";
import { Text, TextSizes } from "ui/atoms/text";
import { ReactNode, useEffect, useState } from "react";
import { Line } from "ui/atoms/line";
import classNames from "classnames";
import { IconButton } from "ui/molecules/icon-button";
import { ScrollArea } from "ui/atoms/scroll-area";
import { MemoDetailType } from "types/types";
import { Input } from "ui/atoms/input";
import { TaskType } from "types/types";
import { putRestatusTask } from "data/api/putRestatusTask";
import { deleteTask } from "data/api/deleteTask";
import {
  ExceptionDisplay,
  ExceptionIcons,
} from "ui/molecules/exception-display";
import { getMemoDetail } from "data/api/getMemoDetail";
import { memoryUsage } from "process";
import { AddModal } from "components/add-modal";
import { useTabContext } from "providers/tab-provider";
import { useMemoContext } from "providers/memo-provider";

export const MemoCard = ({
  id,
  tabIndex,
}: {
  id: number;
  tabIndex: number;
}) => {
  const { tab } = useTabContext();
  const [memo, setMemo] = useState<MemoDetailType>();
  const { list } = useMemoContext();
  const displayMemo = useMemoContext().memo;

  // 表示されている前後１枚ずつを毎度読み込む
  useEffect(() => {
    tab === tabIndex && handleMemoLoad();
    (tab === tabIndex - 1 || tab === tabIndex + 1) &&
      memo === undefined &&
      handleMemoLoad();
  }, [tab]);

  // contextで格納されているやつが変更された場合のみそれを入れる
  useEffect(() => {
    tab === tabIndex && setMemo(displayMemo);
  }, [displayMemo]);

  useEffect(() => {
    tab === tabIndex && handleMemoLoad();
  }, [list]);

  const handleMemoLoad = async () => {
    const response = await getMemoDetail(id);
    !!response && setMemo(response);
  };

  return (
    <ScrollArea className={"MemoCard"}>
      {!!memo ? (
        <div className={"memo-card"}>
          <TitleBlock>{memo.name}</TitleBlock>
          {tab !== undefined &&
          [tabIndex - 1, tabIndex, tabIndex + 1].includes(tab) &&
          !!memo.tasks &&
          memo.tasks.length > 0 ? (
            <>
              <InCompleteContainer>
                {memo.tasks.map(
                  (task, index) =>
                    !task.complete && (
                      <ListBlock
                        key={index}
                        id={task.id}
                        name={task.name}
                        memoId={memo.id}
                        complete={false}
                        handleReload={handleMemoLoad}
                      />
                    )
                )}
              </InCompleteContainer>
              {memo.tasks.filter((task) => task.complete === true).length >
                0 && (
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
                            memoId={memo.id}
                            complete={true}
                            handleReload={handleMemoLoad}
                          />
                        )
                    )}
                  </CompleteContainer>
                </>
              )}
            </>
          ) : (
            <div className={"exception-display"}>
              <ExceptionDisplay
                value="登録されているタスクがありません"
                icon={ExceptionIcons.null}
              />
            </div>
          )}
        </div>
      ) : (
        <ExceptionDisplay
          value="データの取得に失敗しました"
          icon={ExceptionIcons.fail}
        />
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

export const TitleBlock = ({ children }: { children: ReactNode }) => {
  return (
    <div className={"TitleBlock"}>
      <Circle size={16} />
      <Text size={TextSizes.title} className={"block-content"}>
        {children}
      </Text>
    </div>
  );
};

export const ListBlock = ({
  id,
  name,
  memoId,
  complete,
  handleReload = () => {},
}: {
  id: number;
  name: string;
  memoId: number;
  complete: boolean;
  handleReload?: () => void;
}) => {
  const data: TaskType = {
    id: id,
    name: name,
    memo_id: memoId,
    complete: true,
  };
  // const { list, setListData } = useMemoContext();
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
