import { ReactNode } from "react";
import "./index.scss";
import classNames from "classnames";

export const ScrollArea = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const classes = classNames(["ScrollArea", className]);
  return <div className={classes}>{children}</div>;
};
