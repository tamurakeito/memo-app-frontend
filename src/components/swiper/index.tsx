import { ReactNode, useEffect, useRef, useState } from "react";
import "./index.scss";
import classNames from "classnames";
import { useSwipeable } from "react-swipeable";
import { useTabContext } from "providers/tab-provider";
import { useNaviContext } from "providers/navi-provider";
import { putClientData } from "data/api/putClientData";
import { ClientData } from "types/types";

export const Swiper = ({
  pages,
  isCreate,
}: {
  pages: Array<ReactNode>;
  isCreate: boolean;
}) => {
  const { tab, setTabIndex } = useTabContext();
  const isNavigation = useNaviContext().isActive;
  const setIsNavigation = useNaviContext().setIsActive;

  const [isRefractory, setIsRefractory] = useState(false);
  useEffect(() => {
    if (!isNavigation) {
      setIsRefractory(true);
      setTimeout(() => {
        setIsRefractory(false);
      }, 150);
    }
  }, [isNavigation]);

  const handleSwipeLeft = () => {
    if (tab !== undefined) {
      !isNavigation
        ? tab < pages.length - 1 && !isRefractory && setTabIndex(tab + 1)
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
  const [timer, setTimer] = useState<NodeJS.Timeout | undefined>();
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isKeyDown && !isCreate) {
        // console.log("キーが押されました: ", event.key);
        switch (event.key) {
          case "ArrowLeft":
            handleSwipeRight();
            handlePressLeft();
            break;
          case "ArrowRight":
            handleSwipeLeft();
            handlePressRight();
            break;
          default:
            break;
        }
        setIsKeyDown(true);
      }
    };

    const handleKeyUp = () => {
      setIsKeyDown(false);
      timer && clearInterval(timer);
    };

    const handlePressLeft = () => {
      let counter = tab ? tab - 1 : 0;
      setTimer(
        setInterval(() => {
          if (counter >= 0) {
            setTabIndex(counter);
            counter--;
          }
        }, 100)
      );
    };

    const handlePressRight = () => {
      let counter = tab !== undefined ? tab + 1 : 0;
      setTimer(
        setInterval(() => {
          if (counter < pages.length) {
            setTabIndex(counter);
            counter++;
          }
        }, 100)
      );
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isKeyDown, isCreate]);

  // ページが捲られたときに一定時間そのページにとどまっていた場合そのページをClientDataとしてサーバーへ送信する
  const [beforeTab, setBeforeTab] = useState(tab);
  const [afterTab, setAfterTab] = useState(tab);
  const [sentTab, setSentTab] = useState(tab);
  useEffect(() => {
    setBeforeTab(tab);
    setTimeout(() => {
      setAfterTab(tab);
    }, 1000);
  }, [tab]);
  useEffect(() => {
    beforeTab === afterTab &&
      sentTab !== afterTab &&
      (async () => {
        const data: ClientData = { tab: afterTab ? afterTab : 0 };
        const response = await putClientData(data);
        response !== undefined && setSentTab(response.tab);
      })();
  }, [afterTab]);

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

  const [isScroll, setIsScroll] = useState(false);
  const scrollTimeoutRef = useRef<number | undefined>(undefined);
  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    setIsScroll(true);
    if (!isScroll) {
      if (event.deltaX < 0) {
        handleClickLeft && handleClickLeft();
      } else if (event.deltaX > 0) {
        handleClickRight && handleClickRight();
      }
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

  return (
    <div className={classes} onWheel={handleWheel}>
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
