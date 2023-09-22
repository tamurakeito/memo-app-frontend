import { HeaderModal } from "ui/molecules/header-modal";
import "./index.scss";
import { InputBox, InputButton, InputIcon } from "ui/molecules/input-box";
import { useState } from "react";

export const AddModal = ({
  isActive,
  setIsActive,
}: {
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
}) => {
  const [value, setValue] = useState("");
  return (
    <HeaderModal isActive={isActive} setIsActive={setIsActive}>
      <div className={"AddModal"}>
        <InputBox
          value={value}
          onChange={setValue}
          icon={InputIcon.penTool}
          button={InputButton.plus}
          handleOnBlur={() => setIsActive(false)}
          handleOnEnter={() => {
            setIsActive(false);
            console.log(value);
            setValue("");
          }}
        />
      </div>
    </HeaderModal>
  );
};
