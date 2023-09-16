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
  const modalHeight = window.innerHeight - 20;

  const [initialPosition, setInitialPosition] = useState(0);
  const [bottomPosition, setBottomPosition] = useState(modalHeight);
  const [transition, setTransition] = useState(0.2);

  useEffect(() => {
    isActive &&
      (() => {
        setIsShadowActive(true);
        setBottomPosition(0);
      })();
  }, [isActive]);

  const handleStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setInitialPosition(event.changedTouches[0].clientY);
    setTransition(0);
  };
  const handleMove = (event: React.TouchEvent<HTMLDivElement>) => {
    initialPosition < event.changedTouches[0].clientY &&
      setBottomPosition(event.changedTouches[0].clientY - initialPosition);
  };
  const handleEnd = () => {
    setTransition(0.2);
    setInitialPosition(0);
    (modalHeight - 20) / 3 > bottomPosition
      ? setBottomPosition(0)
      : (async () => {
          setBottomPosition(modalHeight);
          setIsShadowActive(false);
          setTimeout(() => {
            setIsActive(false);
          }, 200);
        })();
  };

  return (
    <>
      {isActive && (
        <div
          className="Modal"
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        >
          <div
            className={classes}
            style={{
              transform: `translateY(${bottomPosition}px)`,
              transition: `${transition}s`,
            }}
          >
            {children}
          </div>
        </div>
      )}
      <Shadow isActive={isShadowActive} />
    </>
  );
};
