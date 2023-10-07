import { HeaderModal } from "ui/molecules/header-modal";
import "./index.scss";
import { InputBox, InputButton, InputIcon } from "ui/molecules/input-box";
import { useContext, useState } from "react";
import { LoadStateContext } from "pages/home";

export const AddModal = ({
  isActive,
  setIsActive,
}: {
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
}) => {
  const [value, setValue] = useState("");
  const { setIsLoading } = useContext(LoadStateContext);
  const handleExec = async () => {
    setIsActive(false);
    console.log(value);
    setValue("");
    setIsLoading(true);
    await setTimeout(() => {
      setIsLoading(false);
    }, 3000);
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
        />
      </div>
    </HeaderModal>
  );
};
