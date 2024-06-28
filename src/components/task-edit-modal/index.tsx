import { HeaderModal } from "ui/molecules/header-modal";
import "./index.scss";
import { InputBox, InputButton, InputIcon } from "ui/molecules/input-box";
import { useContext, useEffect, useState } from "react";
import { AppStateContext } from "pages/home";
import { TaskType } from "types/types";
import { useMemoContext } from "providers/memo-provider";
import { useTabContext } from "providers/tab-provider";
import { getMemoDetail } from "data/api/getMemoDetail";
import { useErrorContext } from "providers/error-provider";
import { useToastContext } from "providers/toast-provider";
import { useTaskContext } from "providers/task-provider";
import { putRestatusTask } from "data/api/putRestatusTask";

export const TaskEditModal = () => {
  const { task, setTask, isActive, setIsActive } = useTaskContext();
  const [value, setValue] = useState("");
  const { list, setMemo } = useMemoContext();
  const { tab } = useTabContext();
  const { setIsLoading } = useContext(AppStateContext);
  const { setIsError } = useErrorContext();
  const { setToast } = useToastContext();

  const handleReload = async () => {
    if (tab !== undefined) {
      const response = await getMemoDetail(list[tab].id);
      !!response && setMemo(response);
    }
  };

  const chaLimit = 100;
  const onChange = (value: string) => {
    value.length > chaLimit
      ? setToast({
          content: "100文字以内で登録してください",
          isActive: true,
          duration: 1500,
        })
      : setValue(value);
  };

  useEffect(() => {
    isActive && task !== undefined && setValue(task.name);
  }, [isActive]);

  const handleExec = async () => {
    value && task !== undefined && value !== task.name
      ? (async () => {
          const data: TaskType = {
            id: task?.id,
            name: value,
            memo_id: task.memo_id,
            complete: task.complete,
          };
          setValue("");
          setIsLoading(true);
          const response = await putRestatusTask(data);
          !!response
            ? (async () => {
                await handleReload();
                setIsLoading(false);
              })()
            : (() => {
                setIsError(true);
                setIsLoading(false);
              })();
        })()
      : (() => {
          setValue("");
          setTask();
        })();
  };
  return (
    <HeaderModal
      isActive={isActive}
      setIsActive={setIsActive}
      handleExec={handleExec}
    >
      <div className={"TaskEditModal"}>
        <InputBox
          value={value}
          onChange={onChange}
          icon={InputIcon.edit3}
          button={InputButton.check}
          handleOnBlur={() => {
            setIsActive(false);
            handleExec();
          }}
          handleOnEnter={() => {
            setIsActive(false);
            handleExec();
          }}
          placeholder={"タスクの内容を入力してください"}
        />
      </div>
    </HeaderModal>
  );
};
