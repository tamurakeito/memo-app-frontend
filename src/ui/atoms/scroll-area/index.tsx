import { ReactNode, useRef } from "react";
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
  const scrollRef = useRef<HTMLElement>(null);
  return (
    <div ref={scrollRef as React.RefObject<HTMLDivElement>} className={classes}>
      {children}
    </div>
  );
};
