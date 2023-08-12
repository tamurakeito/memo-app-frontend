import classNames from "classnames";
import "./index.scss";
import { Text, TextSizes } from "ui/atoms/text";
import { Line } from "ui/atoms/line";
import { ReactNode } from "react";
import { CheckCircle, Circle, Edit2, Trash2, XCircle } from "react-feather";
import { useMenuContext } from "providers/menu-provider";

export const Menu = () => {
  const { isActive } = useMenuContext();
  const classes = classNames(["Menu", isActive && "active"]);
  return (
    <div className={classes}>
      <div className={"menu-container"}>
        <Text className={"title"} size={TextSizes.text3}>
          リスト
        </Text>
        <MenuList icon={<Edit2 className={"menu-icon"} size={14} />}>
          リストを編集
        </MenuList>
        <MenuList icon={<Trash2 className={"menu-icon"} size={14} />}>
          リストを削除
        </MenuList>
        <div className={"menu-line"}>
          <Line />
        </div>
        <MenuList icon={<Circle className={"menu-icon"} size={14} />}>
          全てを未完了に
        </MenuList>
        <MenuList icon={<CheckCircle className={"menu-icon"} size={14} />}>
          全てを完了済に
        </MenuList>
        <MenuList icon={<XCircle className={"menu-icon"} size={14} />}>
          完了済を削除
        </MenuList>
      </div>
    </div>
  );
};

const MenuList = ({
  children,
  icon,
}: {
  children: ReactNode;
  icon: ReactNode;
}) => {
  const classes = classNames(["MenuList"]);
  return (
    <div className={classes}>
      {icon}
      <Text className={"menu-text"} size={TextSizes.text1}>
        {children}
      </Text>
    </div>
  );
};
