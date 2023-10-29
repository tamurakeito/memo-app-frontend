import { HeaderModal } from "ui/molecules/header-modal";
import "./index.scss";
import { InputBox, InputButton, InputIcon } from "ui/molecules/input-box";
import { useContext, useState } from "react";
import { LoadStateContext } from "pages/home";
import { putRestatusMemo } from "data/api/putRestatusMemo";
import { MemoDetailType } from "types/types";
import { useListContext } from "providers/list-provider";
import { useTabContext } from "providers/tab-provider";
import { getMemoDetail } from "data/api/getMemoDetail";
import { useErrorContext } from "providers/error-provider";
import { getMemoSummary } from "data/api/getMemoSummary";
import { useToastContext } from "providers/toast-provider";

export const EditModal = ({
  isActive,
  setIsActive,
}: {
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
}) => {
  const [value, setValue] = useState("");
  const { setIsLoading } = useContext(LoadStateContext);
  const { list, setListData } = useListContext();
  const { tab } = useTabContext();
  const { setIsError } = useErrorContext();
  const { setToast } = useToastContext();
  const handleExec = async () => {
    setIsLoading(true);
    if (tab !== undefined) {
      setIsActive(false);
      console.log(value);
      setIsLoading(true);
      const id = list[tab].id;
      const detail = await getMemoDetail(id);
      const data: MemoDetailType = {
        id: tab,
        name: value,
        tag: list[tab].tag,
        tasks: detail ? detail.tasks : [],
      };
      const response = await putRestatusMemo(data);
      !!response
        ? (async () => {
            const response = await getMemoSummary();
            !!response
              ? (() => {
                  setListData(response);
                })()
              : (() => {
                  setIsError(true);
                })();
            setIsLoading(false);
          })()
        : (() => {
            setToast({
              content: "メモの編集に失敗しました",
              isSuccess: false,
            });
            setIsLoading(false);
          })();
    }
    setValue("");
  };
  return (
    <HeaderModal isActive={isActive} setIsActive={setIsActive}>
      <div className={"EditModal"}>
        <InputBox
          value={value}
          onChange={setValue}
          icon={InputIcon.edit3}
          button={InputButton.check}
          handleOnBlur={() => setIsActive(false)}
          handleOnEnter={handleExec}
          placeholder={"新しいタイトルを入力"}
        />
      </div>
    </HeaderModal>
  );
};
