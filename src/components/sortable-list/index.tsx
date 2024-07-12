import "./index.scss";
import classNames from "classnames";
import { ReactNode, useEffect, useRef, useState } from "react";

export const SortableList = ({
  className,
  list,
  adjuster = 0,
  moveItem,
}: {
  className?: string;
  list: Array<ReactNode>;
  adjuster?: number;
  moveItem: (fromIndex: number, toIndex: number) => void;
}) => {
  const classes = classNames(["SortableList", className]);
  const [isDrag, setIsDrag] = useState(false);
  const [selected, setSelected] = useState(0);
  const divRef = useRef<HTMLDivElement>(null);
  const [yPosition, setYPosition] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(-1);

  useEffect(() => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      setYPosition(rect.top + window.scrollY); // ページ全体のスクロール位置を考慮
    }
  }, []);

  var [isPressed, setIsPress] = useState(false);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const [event, setEvent] =
    useState<React.MouseEvent<HTMLDivElement, MouseEvent>>();

  const handleLongPress = () => {
    if (event) {
      event.stopPropagation();
      setIsDrag(true);
      setSelected(Math.floor((event.clientY - yPosition) / 30));
      setCursorPosition(event.clientY - yPosition);
    }
  };

  useEffect(() => {
    if (isPressed) {
      timeoutIdRef.current = setTimeout(() => {
        handleLongPress();
      }, 200);
    } else {
      timeoutIdRef.current !== null && clearTimeout(timeoutIdRef.current);
    }
  }, [isPressed]);

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setIsPress(true);
    setEvent(event);
  };

  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    if (isDrag) {
      setCursorPosition(event.clientY - yPosition);
    }
  };

  const handleMouseUp = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setIsPress(false);
    if (isDrag) {
      setIsDrag(false);
      setSelected(0);
      const fromIndex = selected;
      const toIndex = Math.floor(cursorPosition / 30);
      if (fromIndex !== toIndex) {
        moveItem(fromIndex, toIndex);
      }
    }
  };

  return (
    <div
      ref={divRef}
      className={classes}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        setIsDrag(false);
        setSelected(0);
      }}
    >
      {!isDrag ? (
        list
      ) : (
        <>
          <SortableCard
            top={Math.min(
              Math.max(cursorPosition - 12, 0),
              list.length * 30 - 4
            )}
          >
            {list[selected]}
          </SortableCard>
          {list
            .filter((_, index) => index !== selected)
            .map((node, index) => {
              return (
                <span key={index}>
                  <GhostSpacer
                    active={
                      index > 0
                        ? index === Math.floor(cursorPosition / 30)
                        : cursorPosition < 30
                    }
                  />
                  {node}
                </span>
              );
            })}
          <GhostSpacer active={cursorPosition > (list.length - 1) * 30} />
        </>
      )}
    </div>
  );
};

export const SortableCard = ({
  children,
  top,
}: {
  children: ReactNode;
  top: number;
}) => {
  const [isDrag, setIsDrag] = useState(false);
  const classes = classNames(["SortableCard", isDrag && "dragged"]);
  useEffect(() => {
    setIsDrag(true);
  }, []);
  return (
    <div className={classes} style={{ top: `${top}px` }}>
      {children}
    </div>
  );
};

const GhostSpacer = ({ active }: { active: boolean }) => {
  const classes = classNames(["GhostSpacer", active && "active"]);
  return <div className={classes}></div>;
};
