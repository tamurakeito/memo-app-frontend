import classNames from "classnames";
import { ReactNode } from "react";
import "./index.scss";
import { type } from "os";
import { types } from "sass";

export const Text = ({
  children,
  size,
  className,
}: {
  children: ReactNode;
  size: TextSize;
  className?: string;
}) => {
  const classes = classNames(["Text", size, className]);
  return <span className={classes}>{children}</span>;
};

export const TextSizes = {
  title: "title",
  text1: "t1",
  text2: "t2",
  text3: "t3",
};
type TextSize = (typeof TextSizes)[keyof typeof TextSizes];

// const TextColors = {
// };
// type TextColor = (typeof TextColors)[keyof typeof TextColors];
