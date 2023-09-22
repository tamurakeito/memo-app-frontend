import { PenTool, Plus } from "react-feather";
import "./index.scss";

export const InputBox = ({
  value,
  onChange,
  icon,
  button,
  handleOnBlur,
  handleOnEnter,
}: {
  value: string;
  onChange: (value: string) => void;
  icon?: InputIconType;
  button?: InputButtonType;
  handleOnBlur: () => void;
  handleOnEnter: () => void;
}) => {
  return (
    <div className="InputBox">
      {!!icon && <div className="input-icon">{icon}</div>}
      <input
        className="input-input"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoFocus={true}
        onBlur={handleOnBlur}
        placeholder={"新しいタスク"}
        onKeyDown={(event) => {
          event.key === "Enter" && handleOnEnter();
        }}
      />
      {!!button && (
        <div className="input-button" onClick={handleOnEnter}>
          {button}
        </div>
      )}
    </div>
  );
};

export type InputIconType = (typeof InputIcon)[keyof typeof InputIcon];
export const InputIcon = {
  penTool: <PenTool size={20} />,
};

export type InputButtonType = (typeof InputButton)[keyof typeof InputButton];
export const InputButton = {
  plus: <Plus size={20} />,
};
