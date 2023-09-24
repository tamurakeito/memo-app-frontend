import classNames from "classnames";
import "./index.scss";
import { Text, TextSizes } from "ui/atoms/text";
import { Line } from "ui/atoms/line";
import { ReactNode, useEffect, useState } from "react";
import { CheckCircle, Circle, Edit2, Trash2, XCircle } from "react-feather";
import { useMenuContext } from "providers/menu-provider";
import { Shadow } from "ui/atoms/shadow";

export const Menu = ({
  setIsDelete,
}: {
  setIsDelete: (value: boolean) => void;
}) => {
  const { isActive, setIsActive } = useMenuContext();
  const [isMenuActive, setIsMenuActive] = useState(isActive);
  const [isShadowActive, setIsShadowActive] = useState(isActive);
  const classes = classNames(["Menu", isActive && "active"]);

  useEffect(() => {
    isActive
      ? (() => {
          setIsMenuActive(true);
          setIsShadowActive(true);
        })()
      : (async () => {
          setIsShadowActive(false);
          setTimeout(() => {
            setIsMenuActive(false);
          }, 200);
        })();
  }, [isActive]);
  return (
    <>
      {isMenuActive && (
        <div className={classes}>
          <div className={"menu-container"}>
            <Text className={"title"} size={TextSizes.text3}>
              メモ
            </Text>
            <MenuList
              icon={<Edit2 className={"menu-icon"} size={14} />}
              onClick={() => {}}
            >
              メモを編集
            </MenuList>
            <MenuList
              icon={<Trash2 className={"menu-icon"} size={14} />}
              onClick={() => {
                setIsDelete(true);
                setIsActive(false);
              }}
            >
              メモを削除
            </MenuList>
            <div className={"menu-line"}>
              <Line />
            </div>
            <MenuList
              icon={<Circle className={"menu-icon"} size={14} />}
              onClick={() => {}}
            >
              全てを未完了に
            </MenuList>
            <MenuList
              icon={<CheckCircle className={"menu-icon"} size={14} />}
              onClick={() => {}}
            >
              全てを完了済に
            </MenuList>
            <MenuList
              icon={<XCircle className={"menu-icon"} size={14} />}
              onClick={() => {}}
            >
              完了済を削除
            </MenuList>
          </div>
        </div>
      )}
      <Shadow
        isActive={isShadowActive}
        handleClick={() => {
          setIsActive(false);
        }}
      />
    </>
  );
};

const MenuList = ({
  children,
  icon,
  onClick,
}: {
  children: ReactNode;
  icon: ReactNode;
  onClick: () => void;
}) => {
  const classes = classNames(["MenuList"]);
  return (
    <div className={classes} onClick={onClick}>
      {icon}
      <Text className={"menu-text"} size={TextSizes.text1}>
        {children}
      </Text>
    </div>
  );
};
