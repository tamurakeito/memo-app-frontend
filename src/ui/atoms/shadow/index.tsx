import { useSwipeable } from "react-swipeable";
import "./index.scss";
import classNames from "classnames";
import { ReactNode, useEffect, useRef, useState } from "react";

export const Shadow = ({
  children,
  isActive,
  handleClick = () => {},
  handleSwipeUp = () => {},
  handleSwipeLeft = () => {},
}: {
  children?: ReactNode;
  isActive: boolean;
  handleClick?: () => void;
  handleSwipeUp?: () => void;
  handleSwipeLeft?: () => void;
}) => {
  const swipeHandlers = useSwipeable({
    onSwiped: (event) => {
      if (event.dir === "Up") {
        handleSwipeUp();
      }
      if (event.dir === "Left") {
        handleSwipeLeft();
      }
    },
    trackMouse: true,
  });
  const [isShadow, setIsShadow] = useState(isActive);
  useEffect(() => {
    isActive
      ? setIsShadow(isActive)
      : setTimeout(() => {
          setIsShadow(isActive);
        }, 100);
  }, [isActive]);

  const [isScroll, setIsScroll] = useState(false);
  const scrollTimeoutRef = useRef<number | undefined>(undefined);
  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    setIsScroll(true);
    if (!isScroll && handleSwipeLeft && event.deltaX > 0) {
      handleSwipeLeft && handleSwipeLeft();
    }
    // 前のタイマーをクリア
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    // スクロール終了を検出するためのタイマーを設定
    scrollTimeoutRef.current = window.setTimeout(() => {
      setIsScroll(false);
    }, 100);
  };

  const classes = classNames(["Shadow", isActive && "active"]);
  return isShadow ? (
    <div
      className={classes}
      onClick={handleClick}
      {...swipeHandlers}
      onWheel={handleWheel}
    >
      {children}
    </div>
  ) : (
    <></>
  );
};
