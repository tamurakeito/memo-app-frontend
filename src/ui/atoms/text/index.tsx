import classNames from "classnames";
import { ReactNode } from "react";
import "./index.scss";

export const Text = ({
  children,
  size,
  className,
  onClick,
}: {
  children: ReactNode;
  size: TextSize;
  className?: string;
  onClick?: () => void;
}) => {
  const classes = classNames(["Text", size, className]);
  return (
    <span className={classes} onClick={onClick}>
      {children}
    </span>
  );
};

export const TextSizes = {
  title: "title",
  text1: "t1",
  text2: "t2",
  text3: "t3",
  text4: "t4",
  text5: "t5",
};
type TextSize = (typeof TextSizes)[keyof typeof TextSizes];

// const TextColors = {
// };
// type TextColor = (typeof TextColors)[keyof typeof TextColors];
