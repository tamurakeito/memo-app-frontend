import classNames from "classnames";
import "./index.scss";
import { Text, TextSizes } from "ui/atoms/text";
import { Line } from "ui/atoms/line";
import { ReactNode, useEffect, useState } from "react";
import { CheckCircle, Circle, Edit2, Trash2, XCircle } from "react-feather";
import { useMenuContext } from "providers/menu-provider";
import { Shadow } from "ui/atoms/shadow";
import { useMemoContext } from "providers/memo-provider";
import { useTabContext } from "providers/tab-provider";
import { getMemoDetail } from "data/api/getMemoDetail";
import { putRestatusTask } from "data/api/putRestatusTask";
import { TaskType } from "types/types";
import { useToastContext } from "providers/toast-provider";
import { deleteTask } from "data/api/deleteTask";

export const Menu = ({
  setIsEdit,
  setIsDelete,
  handleReload,
}: {
  setIsEdit: (value: boolean) => void;
  setIsDelete: (value: boolean) => void;
  handleReload: () => void;
}) => {
  const { isActive, setIsActive } = useMenuContext();
  const [isMenuActive, setIsMenuActive] = useState(isActive);
  const [isShadowActive, setIsShadowActive] = useState(isActive);
  const classes = classNames(["Menu", isActive && "active"]);
  const { setToast } = useToastContext();

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

  const { list } = useMemoContext();
  const { tab } = useTabContext();

  const handleTaskBulkOperate = (
    handleOperation: (task: TaskType, memoId: number) => void
  ) => {
    tab !== undefined &&
      (async () => {
        // そのメモの全てのタスクを取得
        const memoId = list[tab].id;
        const response = await getMemoDetail(memoId);
        !!response
          ? (async () => {
              // 取得したタスクリストをfor文で回してそれぞれの操作を行う
              await response.tasks.forEach((task) => {
                handleOperation(task, memoId);
              });
              await setTimeout(handleReload, 100 * response.tasks.length);
            })()
          : setToast({
              content: "ステータスの変更に失敗しました",
              isSuccess: false,
            });
        setIsActive(false);
      })();
  };

  const handleTaskBulkUnCompleted = () => {
    handleTaskBulkOperate((task: TaskType, memoId: number) => {
      task.complete === true &&
        (async () => {
          const data: TaskType = {
            id: task.id,
            name: task.name,
            memo_id: memoId,
            complete: false,
          };
          const res = await putRestatusTask(data);
          res === undefined &&
            setToast({
              content: "ステータスの変更に失敗しました",
              isSuccess: false,
              // duration: ,
            });
        })();
    });
  };

  const handleTaskBulkCompleted = () => {
    handleTaskBulkOperate((task: TaskType, memoId: number) => {
      task.complete === false &&
        (async () => {
          const data: TaskType = {
            id: task.id,
            name: task.name,
            memo_id: memoId,
            complete: true,
          };
          const res = await putRestatusTask(data);
          res === undefined &&
            setToast({
              content: "ステータスの変更に失敗しました",
              isSuccess: false,
              // duration: ,
            });
        })();
    });
  };

  const handleTaskBulkDelete = () => {
    handleTaskBulkOperate((task: TaskType) => {
      task.complete === true &&
        (async () => {
          const res = await deleteTask(task.id);
          res === undefined &&
            setToast({
              content: "タスクの削除に失敗しました",
              isSuccess: false,
              // duration: ,
            });
        })();
    });
  };

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
              onClick={() => {
                setIsEdit(true);
                setIsActive(false);
              }}
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
              onClick={handleTaskBulkUnCompleted}
            >
              全てを未完了に
            </MenuList>
            <MenuList
              icon={<CheckCircle className={"menu-icon"} size={14} />}
              onClick={handleTaskBulkCompleted}
            >
              全てを完了済に
            </MenuList>
            <MenuList
              icon={<XCircle className={"menu-icon"} size={14} />}
              onClick={handleTaskBulkDelete}
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
