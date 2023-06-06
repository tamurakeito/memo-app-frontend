import { IconButton } from "ui/molecules/icon-button";
import "./index.scss";
import { Tag, Menu, MoreVertical } from "react-feather";
import { useTabContext } from "provider/tab-provider";
import { ListSummaryType } from "types/types";
import { useListContext } from "provider/list-provider";

export const TopBar = ({
  onClickHamburger,
  onClickTag,
  onClickOption,
}: {
  onClickHamburger: () => void;
  onClickTag: () => void;
  onClickOption: () => void;
}) => {
  const { list } = useListContext();
  const { tab } = useTabContext();
  return (
    <div className={"TopBar"}>
      <IconButton
        className={"HamburgerIconButton"}
        defaultIcon={<Menu size={17} />}
        onClick={onClickHamburger}
      />
      <IconButton
        className={`TagIconButton ${list[tab].tag && "tagged"}`}
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
