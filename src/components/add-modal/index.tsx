import { HeaderModal } from "ui/molecules/header-modal";
import "./index.scss";
import { InputBox, InputButton, InputIcon } from "ui/molecules/input-box";
import { useContext, useEffect, useState } from "react";
import { AppStateContext } from "pages/home";
import { postAddTask } from "data/api/postAddTask";
import { TaskType } from "types/types";
import { useErrorContext } from "providers/error-provider";
import { useMemoContext } from "providers/memo-provider";
import { useTabContext } from "providers/tab-provider";
import { getMemoDetail } from "data/api/getMemoDetail";
import { useToastContext } from "providers/toast-provider";

export const AddModal = ({
  isActive,
  setIsActive,
}: {
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
}) => {
  const [value, setValue] = useState("");
  const { list, setMemo, setIsLoading } = useMemoContext();
  const { tab } = useTabContext();
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
    setValue("");
  }, [isActive]);

  const handleExec = () => {
    value && tab !== undefined
      ? (async () => {
          const data: TaskType = {
            id: 0, // ここは何を設定してもbackend側で処理されない
            name: value,
            memo_id: list[tab].id,
            complete: false,
          };
          setValue("");
          setIsLoading(true);
          const response = await postAddTask(data);
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
        })();
  };
  return (
    <HeaderModal
      isActive={isActive}
      setIsActive={setIsActive}
      handleExec={handleExec}
    >
      <div className={"AddModal"}>
        <InputBox
          value={value}
          onChange={onChange}
          icon={InputIcon.penTool}
          button={InputButton.plus}
          handleOnBlur={() => {
            setIsActive(false);
            handleExec();
          }}
          handleOnEnter={() => {
            setIsActive(false);
            handleExec();
          }}
          placeholder={"新しいタスク"}
        />
      </div>
    </HeaderModal>
  );
};
