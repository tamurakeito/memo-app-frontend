import { Check, Edit3, PenTool, Plus } from "react-feather";
import "./index.scss";

export const InputBox = ({
  value,
  onChange,
  icon,
  button,
  handleOnBlur,
  handleOnEnter,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  icon?: InputIconType;
  button?: InputButtonType;
  handleOnBlur: () => void;
  handleOnEnter: () => void;
  placeholder?: string;
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
        placeholder={placeholder ? placeholder : ""}
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
  edit3: <Edit3 size={20} />,
};

export type InputButtonType = (typeof InputButton)[keyof typeof InputButton];
export const InputButton = {
  plus: <Plus size={20} />,
  check: <Check size={20} />,
};
