import React from "react";
import {
  ArrowLeftCircle,
  Frown,
  Search,
  File,
  UserPlus,
  FileMinus,
} from "react-feather";

import "./index.scss";

import { Text, TextSizes } from "ui/atoms/text";
import classNames from "classnames";

export const ExceptionDisplay = ({
  value,
  icon,
  className,
}: {
  value: string;
  icon: ExceptopnIcon;
  className?: string;
}) => {
  const Icon = (icon: string) => {
    switch (icon) {
      case "arrow":
        return <ArrowLeftCircle size={45} className="ExceptionDisplay__icon" />;
      case "search":
        return <Search size={45} className="ExceptionDisplay__icon" />;
      case "fail":
        return <Frown size={45} className="ExceptionDisplay__icon" />;
      case "file":
        return <File size={45} className="ExceptionDisplay__icon" />;
      case "select":
        return <UserPlus size={45} className="ExceptionDisplay__icon" />;
      case "null":
        return <FileMinus size={45} className="ExceptionDisplay__icon" />;
      default:
        return <></>;
    }
  };
  const classes = classNames(["ExceptionDisplay", className && className]);
  return (
    <div className={classes}>
      {Icon(icon)}
      <Text size={TextSizes.text3} className="ExceptionDisplay__msg">
        {value}
      </Text>
    </div>
  );
};

export const ExceptionIcons = {
  icon: "arrow",
  search: "search",
  fail: "fail",
  file: "file",
  select: "select",
  null: "null",
};

type ExceptopnIcon = (typeof ExceptionIcons)[keyof typeof ExceptionIcons];
