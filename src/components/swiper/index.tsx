import { ReactNode, useEffect, useState } from "react";
import "./index.scss";
import classNames from "classnames";
import { useSwipeable } from "react-swipeable";
import { useTabContext } from "provider/tab-provider";

export const Swiper = ({ pages }: { pages: Array<ReactNode> }) => {
  const [pageIndex, setPageIndex] = useState<number>(0);
  const { setTabIndex } = useTabContext();
  useEffect(() => {
    setTabIndex(0);
  }, []);
  const handleIndex = (index: number) => {
    setTabIndex(index);
    setPageIndex(index);
  };
  const handleSwipeLeft = () => {
    pageIndex > 0 && handleIndex(pageIndex - 1);
  };
  const handleSwipeRight = () => {
    pageIndex < pages.length - 1 && handleIndex(pageIndex + 1);
  };
  const swipeHandlers = useSwipeable({
    onSwiped: (event) => {
      if (event.dir === "Left") {
        handleSwipeRight();
      }
      if (event.dir === "Right") {
        handleSwipeLeft();
      }
    },
    trackMouse: true,
  });
  return (
    <div className={"Swiper"} {...swipeHandlers}>
      {pages.map((page, index) => {
        if (index === pageIndex - 1) {
          return (
            <SwipeCard key={index} position={swipeAreaPositions.left}>
              {page}
            </SwipeCard>
          );
        } else if (index === pageIndex) {
          return (
            <SwipeCard
              key={index}
              position={swipeAreaPositions.center}
              handleClickLeft={handleSwipeLeft}
              handleClickRight={handleSwipeRight}
            >
              {page}
            </SwipeCard>
          );
        } else if (index === pageIndex + 1) {
          return (
            <SwipeCard key={index} position={swipeAreaPositions.right}>
              {page}
            </SwipeCard>
          );
        }
      })}
      <SwipeIndexDisplay pageIndex={pageIndex} length={pages.length} />
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

const SwipeIndexDisplay = ({
  pageIndex,
  length,
}: {
  pageIndex: number;
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
