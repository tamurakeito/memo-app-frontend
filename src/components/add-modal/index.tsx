import { HeaderModal } from "ui/molecules/header-modal";
import "./index.scss";

export const AddModal = ({
  isActive,
  setIsActive,
}: {
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
}) => {
  return (
    <HeaderModal isActive={isActive} setIsActive={setIsActive}>
      <div className={"AddModal"}>
        <input type="text" autoFocus={true} onBlur={() => setIsActive(false)} />
      </div>
    </HeaderModal>
  );
};
