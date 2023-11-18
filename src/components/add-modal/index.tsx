import { HeaderModal } from "ui/molecules/header-modal";
import "./index.scss";
import { InputBox, InputButton, InputIcon } from "ui/molecules/input-box";
import { useContext, useState } from "react";
import { LoadStateContext } from "pages/home";
import { postAddMemo } from "data/api/postAddMemo";
import { postAddTask } from "data/api/postAddTask";
import { TaskType } from "types/types";
import { useErrorContext } from "providers/error-provider";
import { useMemoContext } from "providers/memo-provider";
import { useTabContext } from "providers/tab-provider";
import { getMemoDetail } from "data/api/getMemoDetail";

export const AddModal = ({
  isActive,
  setIsActive,
}: {
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
}) => {
  const [value, setValue] = useState("");
  const { list, setMemo } = useMemoContext();
  const { tab } = useTabContext();
  const { setIsLoading } = useContext(LoadStateContext);
  const { setIsError } = useErrorContext();

  const handleReload = async () => {
    if (tab !== undefined) {
      const response = await getMemoDetail(tab);
      !!response && setMemo(response);
    }
  };

  const handleExec = () => {
    value && tab !== undefined
      ? (async () => {
          const data: TaskType = {
            id: 0, // ここは何を設定してもbackend側で処理されない
            name: value,
            memo_id: list[tab].id,
            complete: false,
          };
          setIsActive(false);
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
          setIsActive(false);
          setValue("");
        })();
  };
  return (
    <HeaderModal isActive={isActive} setIsActive={setIsActive}>
      <div className={"AddModal"}>
        <InputBox
          value={value}
          onChange={setValue}
          icon={InputIcon.penTool}
          button={InputButton.plus}
          handleOnBlur={() => setIsActive(false)}
          handleOnEnter={handleExec}
          placeholder={"新しいタスク"}
        />
      </div>
    </HeaderModal>
  );
};
