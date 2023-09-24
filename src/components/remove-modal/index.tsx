import { Modal } from "ui/molecules/modal";
import "./index.scss";
import { useState } from "react";
import { Text, TextSizes } from "ui/atoms/text";
import { ChevronsUp, Trash, Trash2, XCircle } from "react-feather";
import { useListContext } from "providers/list-provider";
import { useTabContext } from "providers/tab-provider";

export const RemoveModal = ({
  isActive,
  setIsActive,
}: {
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
}) => {
  const { list } = useListContext();
  const { tab } = useTabContext();

  const DefaultView = () => {
    return (
      <div className="RemoveModal">
        <Text size={TextSizes.text4} className={"modal-content"}>
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
        <Text size={TextSizes.text4} className={"modal-content"}>
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
      modalHeight={(1 / 2) * window.innerHeight}
      isActive={isActive}
      setIsActive={setIsActive}
      handleSlideUp={() => {}}
      UpView={UpView()}
      DownView={DownView()}
    >
      {DefaultView()}
    </Modal>
  );
};
