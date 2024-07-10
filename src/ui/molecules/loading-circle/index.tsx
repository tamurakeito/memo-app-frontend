import { Circle, Loader, RefreshCw } from "react-feather";
import "./index.scss";
import classNames from "classnames";

export const LoadingCircle = ({
  className,
  size,
}: {
  className: string;
  size: number;
}) => {
  const classes = classNames(["LoadingCircle", className]);
  return (
    <div
      className={classes}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <RefreshCw size={size} />
    </div>
  );
};
