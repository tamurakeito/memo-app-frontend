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
  handleSlideUp: () => void;
  UpView?: ReactNode;
  DownView?: ReactNode;
}) => {
  const [isModalActive, setIsModalActive] = useState(false);
  const [isShadowActive, setIsShadowActive] = useState(isActive);
  const [isTransparent, setIsTransparent] = useState(false);
  const classes = classNames(
    ["modal-scroll", isModalActive && "active"],
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
      setIsModalActive(false);
    }, 100);
  };
  const modalSlideUp = async () => {
    setTransition(0.5);
    setBottomPosition(-2 * window.outerHeight + modalHeight);
    setIsShadowActive(false);
    setIsTransparent(true);
    setTimeout(() => {
      setTransition(0.2);
      setIsModalActive(false);
      setIsTransparent(false);
      setBottomPosition(modalHeight);
    }, 500);
  };

  useEffect(() => {
    isActive
      ? (() => {
          setIsModalActive(true);
          setIsShadowActive(true);
          setTimeout(() => {
            setBottomPosition(0);
          }, 20);
        })()
      : (() => {
          modalSlideDown();
        })();
  }, [isActive]);

  const [isMouseDown, setIsMouseDown] = useState(false);

  const handleStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setInitialPosition(event.changedTouches[0].clientY);
    setTransition(0);
  };
  const handleStartPC = (event: React.MouseEvent<HTMLDivElement>) => {
    setInitialPosition(event.clientY);
    setTransition(0);
    setIsMouseDown(true);
  };
  const handleMove = (event: React.TouchEvent<HTMLDivElement>) => {
    initialPosition < event.changedTouches[0].clientY
      ? setBottomPosition(event.changedTouches[0].clientY - initialPosition)
      : handleSlideUp !== undefined &&
        setBottomPosition(event.changedTouches[0].clientY - initialPosition);
  };
  const handleMovePC = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isMouseDown) {
      initialPosition < event.clientY
        ? setBottomPosition(event.clientY - initialPosition)
        : handleSlideUp !== undefined &&
          setBottomPosition(event.clientY - initialPosition);
    }
  };
  const handleEnd = () => {
    setTransition(0.2);
    setInitialPosition(0);
    if (modalHeight / 3 < bottomPosition) {
      modalSlideDown();
    } else if (modalHeight / 3 < -1 * bottomPosition) {
      modalSlideUp();
      handleSlideUp();
    } else {
      setBottomPosition(0);
    }
    setIsMouseDown(false);
  };

  return (
    <>
      {isModalActive && (
        <div
          className="Modal"
          onTouchStart={handleStart}
          onMouseDown={handleStartPC}
          onTouchMove={handleMove}
          onMouseMove={handleMovePC}
          onTouchEnd={handleEnd}
          onMouseUp={handleEnd}
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
