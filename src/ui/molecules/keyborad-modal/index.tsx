import { ReactNode, useEffect, useState } from "react";
import { Shadow } from "ui/atoms/shadow";
import "./index.scss";
import React from "react";
import classNames from "classnames";

export const KeyboardModal = ({
  children,
  isActive,
  setIsActive,
}: {
  children: ReactNode;
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
}) => {
  const [isShadowActive, setIsShadowActive] = useState(isActive);
  const classes = classNames(["modal-scroll", isActive && "active"]);
  const windowHeight = window.innerHeight;
  const modalHeight = visualViewport
    ? windowHeight - visualViewport.height + 50
    : 50;

  const [initialPosition, setInitialPosition] = useState(0);
  const [bottomPosition, setBottomPosition] = useState(windowHeight);
  const [transition, setTransition] = useState(0.2);

  useEffect(() => {
    isActive &&
      (() => {
        setIsShadowActive(true);
        setBottomPosition(windowHeight - modalHeight);
      })();
  }, [isActive]);

  const handleStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setInitialPosition(event.changedTouches[0].clientY);
    setTransition(0);
  };
  const handleMove = (event: React.TouchEvent<HTMLDivElement>) => {
    initialPosition < event.changedTouches[0].clientY &&
      setBottomPosition(
        windowHeight -
          modalHeight +
          event.changedTouches[0].clientY -
          initialPosition
      );
  };
  const modalSlideOut = async () => {
    setBottomPosition(windowHeight);
    setIsShadowActive(false);
    setTimeout(() => {
      setIsActive(false);
    }, 200);
  };
  const handleEnd = () => {
    setTransition(0.2);
    setInitialPosition(0);
    modalHeight / 3 > bottomPosition - windowHeight + modalHeight
      ? setBottomPosition(windowHeight - modalHeight)
      : modalSlideOut();
  };

  return (
    <>
      {isActive && (
        <div className="KeyboardModal" onClick={modalSlideOut}>
          <div
            className={classes}
            style={{
              transform: `translateY(${bottomPosition}px)`,
              transition: `${transition}s`,
            }}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
          >
            {children}
          </div>
        </div>
      )}
      <Shadow isActive={isShadowActive} />
    </>
  );
};
