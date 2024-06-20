import { ReactNode, useContext, useEffect, useRef } from "react";
import "./index.scss";
import classNames from "classnames";
import { useTabContext } from "providers/tab-provider";
import { AppStateContext } from "pages/home";

export const ScrollArea = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const classes = classNames(["ScrollArea", className]);
  const { tab } = useTabContext();
  const { setIsOverflow } = useContext(AppStateContext);

  // スクロール有効な時にoverflowをtrueにしたい
  const scrollRef = useRef<HTMLElement>(null);
  // useEffect(() => {
  //   const element = scrollRef.current;
  //   if (element) {
  //     setIsOverflow(element.scrollHeight > element.clientHeight);
  //   }
  // }, [tab]);
  return (
    <div ref={scrollRef as React.RefObject<HTMLDivElement>} className={classes}>
      {children}
    </div>
  );
};
