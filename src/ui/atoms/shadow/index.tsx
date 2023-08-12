import { useSwipeable } from "react-swipeable";
import "./index.scss";
import classNames from "classnames";
import { useShadowContext } from "providers/shadow-provider";
import { useNaviContext } from "providers/navi-provider";
import { useMenuContext } from "providers/menu-provider";

export const Shadow = () => {
  const { isActive, setIsActive, isSwipe } = useShadowContext();
  const setIsActiveNavi = useNaviContext().setIsActive;
  const setIsActiveMenu = useMenuContext().setIsActive;
  const classes = classNames(["Shadow", isActive && "active"]);
  const handleClick = () => {
    setIsActiveNavi(false);
    setIsActiveMenu(false);
    setIsActive(false);
  };
  const swipeHandlers = useSwipeable({
    onSwiped: (event) => {
      if (event.dir === "Left") {
        isSwipe && handleClick();
      }
    },
    trackMouse: true,
  });
  return isActive ? (
    <div className={classes} onClick={handleClick} {...swipeHandlers}></div>
  ) : (
    <></>
  );
};
