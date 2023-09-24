import { useSwipeable } from "react-swipeable";
import "./index.scss";
import classNames from "classnames";
import { useEffect, useState } from "react";

export const Shadow = ({
  isActive,
  handleClick = () => {},
  isSwipe,
}: {
  isActive: boolean;
  handleClick?: () => void;
  isSwipe?: "left" | "up" | undefined;
}) => {
  const swipeHandlers = useSwipeable({
    onSwiped: (event) => {
      if (event.dir === "Up") {
        isSwipe === "up" && handleClick();
      }
      if (event.dir === "Left") {
        isSwipe === "left" && handleClick();
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
