import { ReactNode, useContext, useEffect, useState } from "react";
import { Shadow } from "ui/atoms/shadow";
import "./index.scss";
import React from "react";
import classNames from "classnames";
import { AppStateContext } from "pages/home";

export const HeaderModal = ({
  children,
  isActive,
  setIsActive,
  handleExec,
}: {
  children: ReactNode;
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
  handleExec?: () => void;
}) => {
  const [isModalActive, setIsModalActive] = useState(isActive);
  const [isShadowActive, setIsShadowActive] = useState(isActive);
  const classes = classNames(["modal-scroll", isModalActive && "active"]);
  const [opacity, setOpacity] = useState(0);

  const topDefalut = 50;

  const [initialPosition, setInitialPosition] = useState(0);
  const [topPosition, setTopPosition] = useState(-topDefalut);
  const [transition, setTransition] = useState(0.2);

  const modalSlideIn = async () => {
    setOpacity(1);
    await setTopPosition(-topDefalut);
    setIsModalActive(true);
    setIsShadowActive(true);
    setTimeout(() => {
      topPosition === -topDefalut && setTopPosition(0);
    }, 20);
  };

  const modalSlideOut = async () => {
    setOpacity(0);
    setTopPosition(-topDefalut);
    setIsShadowActive(false);
    setTimeout(() => {
      setIsModalActive(false);
      setIsActive(false);
    }, 200);
  };

  useEffect(() => {
    isActive ? modalSlideIn() : modalSlideOut();
  }, [isActive]);

  const handleStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setInitialPosition(event.changedTouches[0].clientY);
    setTransition(0);
  };
  const handleMove = (event: React.TouchEvent<HTMLDivElement>) => {
    initialPosition > event.changedTouches[0].clientY &&
      setTopPosition(event.changedTouches[0].clientY - initialPosition);
  };
  const handleEnd = () => {
    setTransition(0.2);
    setInitialPosition(0);
    -topDefalut / 3 < topPosition ? setTopPosition(0) : setIsActive(false);
  };

  return (
    <>
      {isModalActive && (
        <div
          className="HeaderModal"
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        >
          <div
            className={classes}
            style={{
              transform: `translateY(${topPosition}px)`,
              transition: `${transition}s`,
              opacity: `${opacity}`,
            }}
          >
            <div className="header-modal-content">{children}</div>
          </div>
        </div>
      )}
      <Shadow
        isActive={isShadowActive}
        handleClick={() => {
          handleExec && handleExec();
          setIsActive(false);
        }}
        handleSwipeUp={handleExec}
      />
    </>
  );
};
