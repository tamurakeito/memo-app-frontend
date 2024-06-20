import { Modal } from "ui/molecules/modal";
import "./index.scss";
import { useContext } from "react";
import { Text, TextSizes } from "ui/atoms/text";
import { ChevronsUp, Trash2, XCircle } from "react-feather";
import { useMemoContext } from "providers/memo-provider";
import { useTabContext } from "providers/tab-provider";
import { deleteMemo } from "data/api/deleteMemo";
import { useToastContext } from "providers/toast-provider";
import { AppStateContext } from "pages/home";
import { useErrorContext } from "providers/error-provider";
import { getMemoDetail } from "data/api/getMemoDetail";
import { MemoDetailType } from "types/types";
import { postAddMemo } from "data/api/postAddMemo";

export const RemoveModal = ({
  isActive,
  setIsActive,
  handleReload,
}: {
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
  handleReload: () => Promise<void>;
}) => {
  const { list, setListData } = useMemoContext();
  const { tab, setTabIndex } = useTabContext();
  const { setToast } = useToastContext();
  const { setIsLoading } = useContext(AppStateContext);
  const { setIsError } = useErrorContext();

  const handleDelete = () => {
    setIsLoading(true);
    tab !== undefined
      ? (async () => {
        const id: number = list[tab].id;
        const memo = await getMemoDetail(id);
          const response = await deleteMemo(id);
          // tab == list.length - 1 && setTabIndex(tab - 1);
          tab > 0 ? setTabIndex(tab - 1):setTabIndex(tab + 1);
          !!response
            ? handleReload()
            : (() => {
                setIsError(true);
                setIsLoading(false);
              })();
          setToast({
            content: "削除したメモを元に戻す",
            isSuccess: false,
            duration: 5000,
            onClick: 
            !!memo ? async ()=>{
              const response = await postAddMemo(memo);
              if(response){
                await handleReload();
                setTabIndex(tab);
              }else{
                setToast({content: "メモも復元に失敗しました", isSuccess: false,});
              }
            } : () => setToast({
                content: "メモの復元に失敗しました",
                isSuccess: false,
              }),
          });
          setIsLoading(false);
        })()
      : (() => {
          setToast({
            content: "メモの削除に失敗しました",
            isSuccess: false,
          });
          setIsLoading(false);
        })();
  };

  const DefaultView = () => {
    return (
      <div className="RemoveModal">
        <Text size={TextSizes.text5} className={"modal-content"}>
          {list.length && tab !== undefined
            ? `『${list[tab].name}』を削除します`
            : "error"}
        </Text>
        <div className="modal-icon">
          <div className="chevrons-up">
            <ChevronsUp size={50} />
          </div>
          <div>
            <Trash2 size={50} />
          </div>
        </div>
      </div>
    );
  };

  const UpView = () => {
    return (
      <div className="RemoveModal">
        <div className="modal-icon">
          <div>
            <Trash2 size={50} />
          </div>
          <div className="chevrons-up">
            <ChevronsUp size={50} />
          </div>
        </div>
      </div>
    );
  };

  const DownView = () => {
    return (
      <div className="RemoveModal">
        <Text size={TextSizes.text5} className={"modal-content"}>
          キャンセル
        </Text>
        <div className="modal-icon">
          <div>
            <XCircle size={50} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Modal
      modalHeight={400}
      isActive={isActive}
      setIsActive={setIsActive}
      handleSlideUp={handleDelete}
      UpView={UpView()}
      DownView={DownView()}
    >
      {DefaultView()}
    </Modal>
  );
};
