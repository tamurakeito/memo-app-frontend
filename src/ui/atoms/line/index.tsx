import "./index.scss";

export const Line = ({ top, bottom }: { top?: number; bottom?: number }) => {
  return (
    <div
      className={"Line"}
      style={{ top: `${top}px`, bottom: `${bottom}px` }}
    ></div>
  );
};
