import { ReactNode, useEffect, useState } from "react";
import { Shadow } from "ui/atoms/shadow";
import "./index.scss";
import React from "react";
import classNames from "classnames";

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

  const [initialPosition, setInitialPosition] = useState(0);
  const [topPosition, setTopPosition] = useState(-50);
  const [transition, setTransition] = useState(0.2);

  const modalSlideOut = async () => {
    setTopPosition(-50);
    setIsShadowActive(false);
    setTimeout(() => {
      setIsModalActive(false);
      setIsActive(false);
    }, 200);
  };

  useEffect(() => {
    isActive
      ? (() => {
          setIsModalActive(true);
          setIsShadowActive(true);
        })()
      : modalSlideOut();
  }, [isActive]);

  useEffect(() => {
    isModalActive && setTopPosition(0);
  }, [isModalActive]);

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
    -50 / 3 < topPosition ? setTopPosition(0) : setIsActive(false);
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
