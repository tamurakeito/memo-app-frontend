import "./index.scss";
import { KeyboardModal } from "ui/molecules/keyborad-modal";

export const AddModal = ({
  isActive,
  setIsActive,
}: {
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
}) => {
  return (
    <KeyboardModal isActive={isActive} setIsActive={setIsActive}>
      <div className={"AddModal"}></div>
    </KeyboardModal>
  );
};
