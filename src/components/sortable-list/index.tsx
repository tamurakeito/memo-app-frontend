import "./index.scss";
import classNames from "classnames";
import { ReactNode, useEffect, useRef, useState } from "react";

export const SortableList = ({
  className,
  list,
  itemHeight,
  adjuster = 0,
  moveItem,
}: {
  className?: string;
  list: Array<ReactNode>;
  itemHeight: number;
  adjuster?: number;
  moveItem: (fromIndex: number, toIndex: number) => void;
}) => {
  const classes = classNames(["SortableList", className]);
  const [isDrag, setIsDrag] = useState(false);
  const [selected, setSelected] = useState(0);
  const divRef = useRef<HTMLDivElement>(null);
  const [yPosition, setYPosition] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(-1);

  var [isPressed, setIsPress] = useState(false);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const [event, setEvent] =
    useState<React.MouseEvent<HTMLDivElement, MouseEvent>>();

  const handleLongPress = () => {
    if (event && divRef.current) {
      event.stopPropagation();
      setIsDrag(true);
      const rect = divRef.current.getBoundingClientRect();
      const y = rect.top + window.scrollY;
      setYPosition(y);
      setSelected(Math.floor((event.clientY - y) / itemHeight));
      setCursorPosition(event.clientY - y);
      console.log(event.clientY);
      console.log(y);
      console.log(event.clientY - y);
      console.log(Math.floor((event.clientY - y) / itemHeight));
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
      const toIndex = Math.floor(cursorPosition / itemHeight);
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
              list.length * itemHeight - 4
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
                        ? index === Math.floor(cursorPosition / itemHeight)
                        : cursorPosition < itemHeight
                    }
                  />
                  {node}
                </span>
              );
            })}
          <GhostSpacer
            active={cursorPosition > (list.length - 1) * itemHeight}
          />
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
