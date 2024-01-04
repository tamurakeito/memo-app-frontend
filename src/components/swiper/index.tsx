import { ReactNode, useEffect, useState } from "react";
import "./index.scss";
import classNames from "classnames";
import { useSwipeable } from "react-swipeable";
import { useTabContext } from "providers/tab-provider";
import { useNaviContext } from "providers/navi-provider";

export const Swiper = ({ pages }: { pages: Array<ReactNode> }) => {
  const { tab, setTabIndex } = useTabContext();
  const isNavigation = useNaviContext().isActive;
  const setIsNavigation = useNaviContext().setIsActive;
  const handleSwipeLeft = () => {
    if (tab !== undefined) {
      !isNavigation
        ? tab < pages.length - 1 && setTabIndex(tab + 1)
        : setIsNavigation(false);
    }
  };
  const handleSwipeRight = () => {
    if (tab !== undefined) {
      tab > 0 && setTabIndex(tab - 1);
      tab <= 0 && setIsNavigation(true);
    }
  };
  const swipeHandlers = useSwipeable({
    onSwiped: (event) => {
      if (event.dir === "Left") {
        handleSwipeLeft();
      }
      if (event.dir === "Right") {
        handleSwipeRight();
      }
    },
    trackMouse: true,
  });

  const [isKeyDown, setIsKeyDown] = useState(false);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isKeyDown) {
        // console.log("キーが押されました: ", event.key);
        switch (event.key) {
          case "ArrowLeft":
            handleSwipeRight();
            break;
          case "ArrowRight":
            handleSwipeLeft();
            break;
          default:
            break;
        }
        setIsKeyDown(true);
      }
    };

    const handleKeyUp = () => {
      setIsKeyDown(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isKeyDown]);

  return (
    <div className={"Swiper"} {...swipeHandlers}>
      {pages.map((page, index) => {
        if (tab !== undefined && index < tab) {
          return (
            <SwipeCard key={index} position={swipeAreaPositions.left}>
              {page}
            </SwipeCard>
          );
        } else if (index === tab) {
          return (
            <SwipeCard
              key={index}
              position={swipeAreaPositions.center}
              handleClickLeft={handleSwipeRight}
              handleClickRight={handleSwipeLeft}
            >
              {page}
            </SwipeCard>
          );
        } else if (tab !== undefined && index > tab) {
          return (
            <SwipeCard key={index} position={swipeAreaPositions.right}>
              {page}
            </SwipeCard>
          );
        }
      })}
      <SwipeIndexDisplay pageIndex={tab} length={pages.length} />
    </div>
  );
};

const SwipeCard = ({
  children,
  position,
  handleClickLeft,
  handleClickRight,
}: {
  children: ReactNode;
  position: swipeAreaPosition;
  handleClickLeft?: () => void;
  handleClickRight?: () => void;
}) => {
  const classes = classNames(["SwipeCard", position]);
  return (
    <div className={classes}>
      {children}
      {handleClickLeft && (
        <SwipeTapArea
          handleClick={handleClickLeft}
          influence={influences.left}
        />
      )}
      {handleClickRight && (
        <SwipeTapArea
          handleClick={handleClickRight}
          influence={influences.right}
        />
      )}
    </div>
  );
};

const influences = {
  left: "left",
  right: "right",
};
type influence = (typeof influences)[keyof typeof influences];

const SwipeTapArea = ({
  handleClick,
  influence,
}: {
  handleClick: () => void;
  influence: influence;
}) => {
  const classes = classNames(["SwipeTapArea", influence]);
  return <div className={classes} onClick={handleClick} />;
};

const swipeAreaPositions = {
  left: "left",
  center: "center",
  right: "right",
};
type swipeAreaPosition =
  (typeof swipeAreaPositions)[keyof typeof swipeAreaPositions];

export const SwipeIndexDisplay = ({
  pageIndex,
  length,
}: {
  pageIndex: number | undefined;
  length: number;
}) => {
  const circles: Array<ReactNode> = [];
  for (let i = 0; i < length; i++) {
    circles.push(<></>);
  }
  const Circle = ({ isActive }: { isActive: boolean }) => {
    const classes = classNames(["Circle", isActive && "active"]);
    return <div className={classes}></div>;
  };
  return (
    <div className="SwipeIndexDisplay">
      {circles.map((_, index) => (
        <Circle key={index} isActive={index === pageIndex} />
      ))}
    </div>
  );
};
