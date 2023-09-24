import { ReactNode, useEffect, useState } from "react";
import { Shadow } from "ui/atoms/shadow";
import "./index.scss";
import React from "react";
import classNames from "classnames";

export const Modal = ({
  children,
  modalHeight,
  isActive,
  setIsActive,
  handleSlideUp,
  UpView,
  DownView,
}: {
  children: ReactNode;
  modalHeight: number;
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
  handleSlideUp?: () => void;
  UpView?: ReactNode;
  DownView?: ReactNode;
}) => {
  const [isShadowActive, setIsShadowActive] = useState(isActive);
  const [isTransparent, setIsTransparent] = useState(false);
  const classes = classNames(
    ["modal-scroll", isActive && "active"],
    isTransparent && "transparent"
  );

  const [initialPosition, setInitialPosition] = useState(0);
  const [bottomPosition, setBottomPosition] = useState(modalHeight);
  const [transition, setTransition] = useState(0.2);

  const modalSlideDown = async () => {
    setBottomPosition(modalHeight);
    setIsShadowActive(false);
    setTimeout(() => {
      setIsActive(false);
    }, 200);
  };
  const modalSlideUp = async () => {
    setTransition(0.5);
    setBottomPosition(-2 * window.innerHeight + modalHeight);
    setIsShadowActive(false);
    setIsTransparent(true);
    setTimeout(() => {
      setTransition(0.2);
      setIsActive(false);
      setIsTransparent(false);
      setBottomPosition(modalHeight);
    }, 500);
  };

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
    initialPosition < event.changedTouches[0].clientY
      ? setBottomPosition(event.changedTouches[0].clientY - initialPosition)
      : handleSlideUp !== undefined &&
        setBottomPosition(event.changedTouches[0].clientY - initialPosition);
  };
  const handleEnd = () => {
    setTransition(0.2);
    setInitialPosition(0);
    if (modalHeight / 3 < bottomPosition) {
      modalSlideDown();
    } else if (modalHeight / 3 < -1 * bottomPosition) {
      modalSlideUp();
    } else {
      setBottomPosition(0);
    }
  };

  return (
    <>
      {isActive && (
        <div
          className="Modal"
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          onClick={modalSlideDown}
        >
          <div
            className={classes}
            style={{
              transform: `translateY(${
                2 * window.innerHeight - modalHeight + bottomPosition
              }px)`,
              transition: `${transition}s`,
            }}
          >
            {UpView && (
              <ModalContentView
                isActive={modalHeight / 3 < -1 * bottomPosition}
              >
                {UpView}
              </ModalContentView>
            )}
            <ModalContentView
              isActive={
                modalHeight / 3 > bottomPosition &&
                modalHeight / 3 > -1 * bottomPosition
              }
            >
              {children}
            </ModalContentView>
            {DownView && (
              <ModalContentView isActive={modalHeight / 3 < bottomPosition}>
                {DownView}
              </ModalContentView>
            )}
          </div>
        </div>
      )}
      <Shadow isActive={isShadowActive} />
    </>
  );
};

const ModalContentView = ({
  children,
  isActive,
}: {
  children: ReactNode;
  isActive: boolean;
}) => {
  const classes = classNames(["ModalContentView", isActive && "active"]);
  return <div className={classes}>{children}</div>;
};
