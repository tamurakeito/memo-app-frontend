import { ReactNode, useState } from "react";
import "./index.scss";
import classNames from "classnames";
import { Button } from "ui/atoms/button";

export const IconButton = ({
  className,
  defaultIcon,
  pressedIcon,
  onClick,
}: {
  className: string;
  defaultIcon: ReactNode;
  pressedIcon?: ReactNode;
  onClick: () => void;
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const toggle = () => {
    setIsPressed(!isPressed);
  };
  const handleClick = () => {
    onClick();
    toggle();
  };
  const classes = classNames(["IconButton", className]);
  const defaultIconClass = classNames([!isPressed ? "active" : "inActive"]);
  const pressedIconClass = classNames([isPressed ? "active" : "inActive"]);
  return (
    <Button className={classes} onClick={handleClick}>
      <div className={defaultIconClass}>{defaultIcon}</div>
      {!!pressedIcon && <div className={pressedIconClass}>{pressedIcon}</div>}
    </Button>
  );
};
