import { useSwipeable } from "react-swipeable";
import "./index.scss";
import classNames from "classnames";
import { useEffect, useState } from "react";

export const Shadow = ({
  isActive,
  handleClick = () => {},
  handleSwipeUp = () => {},
  handleSwipeLeft = () => {},
}: {
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

  const classes = classNames(["Shadow", isActive && "active"]);
  return isShadow ? (
    <div className={classes} onClick={handleClick} {...swipeHandlers}></div>
  ) : (
    <></>
  );
};
