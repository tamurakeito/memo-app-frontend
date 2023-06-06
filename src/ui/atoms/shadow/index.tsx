import { useSwipeable } from "react-swipeable";
import "./index.scss";
import classNames from "classnames";

export const Shadow = ({
  isActive,
  onClick,
  swipeHandler,
}: {
  isActive: boolean;
  onClick: () => void;
  swipeHandler?: () => void;
}) => {
  const classes = classNames(["Shadow", isActive && "active"]);
  const swipeHandlers = useSwipeable({
    onSwiped: (event) => {
      if (event.dir === "Left") {
        swipeHandler && swipeHandler();
      }
    },
    trackMouse: true,
  });
  return isActive ? (
    <div className={classes} onClick={onClick} {...swipeHandlers}></div>
  ) : (
    <></>
  );
};
