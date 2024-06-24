import { useEffect, useState } from "react";
import "./index.scss";
import { useToastContext } from "providers/toast-provider";
import classNames from "classnames";

export type Toast = {
  content: string;
  isActive: boolean;
  duration?: number;
  onClick?: () => void;
};

export const Toast = () => {
  const { toast } = useToastContext();
  const [isActive, setIsActive] = useState(false);
  const [isAppear, setIsAppear] = useState(false);
  const classes = classNames(["Toast", isAppear && "active"]);
  useEffect(() => {
    if (toast?.isActive) {
      setIsActive(true);
      setTimeout(() => {
        setIsAppear(true);
      }, 1);
      if (toast.duration) {
        setTimeout(() => {
          setIsAppear(false);
        }, toast.duration);
        setTimeout(() => {
          setIsActive(false);
        }, toast.duration + 100);
      }
    } else {
      setIsAppear(false);
      setTimeout(() => {
        setIsActive(false);
      }, 100);
    }
  }, [toast]);
  return toast && isActive ? (
    <div className={classes} onClick={toast.onClick}>
      {toast.content}
    </div>
  ) : (
    <></>
  );
};
