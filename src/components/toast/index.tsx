import { useEffect, useState } from "react";
import "./index.scss";
import { useToastContext } from "providers/toast-provider";
import classNames from "classnames";

export type Toast = {
  content: string;
  isSuccess: boolean;
  duration?: number;
  onClick?: ()=>void
};

export const Toast = () => {
  const { toast } = useToastContext();
  const [isActive, setIsActive] = useState(false);
  const [isAppear, setIsAppear] = useState(false);
  const classes = classNames(["Toast", isAppear && "active"]);
  const duration = toast?.duration === undefined ? 1500 : toast.duration;
  useEffect(() => {
    toast && setIsActive(true);
    setTimeout(() => {
      setIsAppear(true);
    }, 1);
    setTimeout(() => {
      setIsAppear(false);
    }, duration);
    setTimeout(() => {
      setIsActive(false);
    }, duration + 100);
  }, [toast]);
  return toast && isActive ? (
    <div className={classes} onClick={toast.onClick}>{toast.content}</div>
  ) : (
    <></>
  );
};
