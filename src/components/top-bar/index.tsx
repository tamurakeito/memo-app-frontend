import { IconButton } from "ui/molecules/icon-button";
import "./index.scss";
import { Tag, Menu, MoreVertical } from "react-feather";
import { useTabContext } from "providers/tab-provider";
import { useListContext } from "providers/list-provider";
import classNames from "classnames";
import { useEffect } from "react";
import { log } from "console";

export const TopBar = ({
  onClickHamburger,
  isTag,
  onClickTag,
  onClickOption,
}: {
  onClickHamburger: () => void;
  isTag: boolean;
  onClickTag: () => void;
  onClickOption: () => void;
}) => {
  return (
    <div className={"TopBar"}>
      <IconButton
        className={"HamburgerIconButton"}
        defaultIcon={<Menu size={17} />}
        onClick={onClickHamburger}
      />
      <IconButton
        className={`TagIconButton ${isTag && "tagged"}`}
        defaultIcon={<Tag size={17} />}
        onClick={onClickTag}
      />
      <IconButton
        className={"OptionIconButton"}
        defaultIcon={<MoreVertical size={17} />}
        onClick={onClickOption}
      />
    </div>
  );
};
