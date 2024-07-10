import "./index.scss";
import { MemoCard } from "components/memo-card";
import { TopBar } from "components/top-bar";
import { Swiper } from "components/swiper";
import { Navigation } from "components/navigation";
import { createContext, useEffect, useRef, useState } from "react";
import { getMemoSummary } from "data/api/getMemoSummary";
import { useMemoContext } from "providers/memo-provider";
import {
  ExceptionDisplay,
  ExceptionIcons,
} from "ui/molecules/exception-display";
import { useErrorContext } from "providers/error-provider";
import { Menu } from "components/menu";
import { AddModal } from "components/add-modal";
import { RemoveModal } from "components/remove-modal";
import { useSwipeable } from "react-swipeable";
import { useNaviContext } from "providers/navi-provider";
import { useMenuContext } from "providers/menu-provider";
import { Skeleton } from "components/skeleton";
import { EditModal } from "components/edit-modal";
import { useTabContext } from "providers/tab-provider";
import { getClientData } from "data/api/getClientData";
import useNetworkStatus from "hooks/useNetworkStatus";
import { useToastContext } from "providers/toast-provider";
import { getMemoDetail } from "data/api/getMemoDetail";
import { TaskEditModal } from "components/task-edit-modal";
import { useNavigate } from "react-router-dom";

export const AppStateContext = createContext({
  isLoading: false,
  setIsLoading: (_: boolean) => {
    console.log("app state provider unimplement.");
  },
  setIsOverflow: (_: boolean) => {
    console.log("app state provider unimplement.");
  },
});

export const Home = () => {
  const { list, setListData } = useMemoContext();
  const { isError, setIsError } = useErrorContext();
  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const isNavigation = useNaviContext().isActive;
  const setIsNavigation = useNaviContext().setIsActive;
  const { setIsAddMemo } = useNaviContext();
  const isMenu = useMenuContext().isActive;
  const { setTabIndex } = useTabContext();
  const { setToast } = useToastContext();

  const [isLoading, setIsLoading] = useState(false);

  const handleGetMemoSummary = async () => {
    setIsLoading(true);
    const response = await getMemoSummary();
    response !== undefined
      ? (() => {
          setListData(response);
          setIsLoading(false);
        })()
      : (() => {
          setIsError(true);
          setIsLoading(false);
        })();
  };

  useEffect(() => {
    handleGetMemoSummary();
    // 前回表示していたページを開く
    (async () => {
      const response = await getClientData();
      setTabIndex(response?.tab ? response.tab : 0);
    })();
  }, []);

  const windowHeight = window.innerHeight;

  const [tapY, setTapY] = useState<number | undefined>();
  const [isOverflow, setIsOverflow] = useState(false);
  const [isSwipeUpAllow, setIsSwipeUpAllow] = useState(true);

  useEffect(() => {
    console.log(isCreate);
  }, [isCreate]);

  const handleSwipeUp = () => {
    isSwipeUpAllow
      ? !isEdit &&
        !isNavigation &&
        !isMenu &&
        tapY !== undefined &&
        (!isOverflow || windowHeight - tapY < (1 / 4) * windowHeight) &&
        setIsDelete(true)
      : setIsSwipeUpAllow(true);
    isCreate && setIsCreate(false);
    isEdit && setIsEdit(false);
  };
  const handleSwipeDown = () => {
    if (
      !isDelete &&
      !isEdit &&
      !isNavigation &&
      !isMenu &&
      tapY !== undefined &&
      (!isOverflow || tapY < (1 / 4) * windowHeight)
    ) {
      setIsCreate(true);
      setIsSwipeUpAllow(false);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwiped: (event) => {
      if (event.dir === "Up") {
        handleSwipeUp();
      }
      if (event.dir === "Down") {
        handleSwipeDown();
      }
    },
    trackMouse: true,
  });

  const handleStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setTapY(event.changedTouches[0].clientY);
  };
  const handleStartPC = (event: React.MouseEvent<HTMLDivElement>) => {
    setTapY(event.clientY);
  };
  const handleEnd = () => {
    setTapY(undefined);
  };
  const handleEndPC = (event: React.MouseEvent<HTMLDivElement>) => {
    handleEnd();
    if (tapY !== undefined) {
      if (event.clientY < tapY) {
        handleSwipeUp();
      } else if (event.clientY > tapY) {
        handleSwipeDown();
      }
    }
  };

  // const [isScroll, setIsScroll] = useState(false);
  // const scrollTimeoutRef = useRef<number | undefined>(undefined);
  // const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
  //   if (!isScroll) {
  //     setIsScroll(true);
  //     if (event.deltaY < 0) {
  //       isDelete ? setIsDelete(false) : setIsCreate(true);
  //     } else if (event.deltaY > 0) {
  //       isCreate ? setIsCreate(false) : setIsDelete(true);
  //     }
  //   }
  //   // 前のタイマーをクリア
  //   if (scrollTimeoutRef.current) {
  //     clearTimeout(scrollTimeoutRef.current);
  //   }
  //   // スクロール終了を検出するためのタイマーを設定
  //   scrollTimeoutRef.current = window.setTimeout(() => {
  //     setIsScroll(false);
  //   }, 50);
  // };

  const [isKeyDown, setIsKeyDown] = useState(false);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isKeyDown) {
        console.log(event.key);
        switch (event.key) {
          case "å": // alt + a
            !isNavigation && setIsCreate(!isCreate);
            break;
          case "Dead": // alt + n
            !isCreate && setIsNavigation(!isNavigation);
            break;
          case "µ": // alt + m
            if (!isCreate) {
              setIsNavigation(true);
              setIsAddMemo(true);
            }
            break;

          default:
            break;
        }
      } else if (event.key === "Alt") {
        setIsKeyDown(true);
        setIsCreate(false);
        setIsNavigation(false);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      event.key === "Alt" && setIsKeyDown(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isKeyDown]);

  const isOnline = useNetworkStatus();
  const [networkFlag, setNetworkFlag] = useState(false);
  const { tab } = useTabContext();
  const { setMemo } = useMemoContext();
  const handleReload = async () => {
    if (tab !== undefined) {
      const response = await getMemoDetail(list[tab].id);
      !!response && setMemo(response);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (networkFlag) {
      if (isOnline) {
        setIsLoading(true);
        setToast({
          content: "ネットワーク接続に復帰しました",
          isActive: true,
          duration: 1500,
        });
        handleReload();
      } else {
        setToast({
          content: "ネットワーク接続がありません",
          isActive: true,
        });
      }
    } else {
      setNetworkFlag(true);
    }
  }, [isOnline]);

  return (
    <AppStateContext.Provider
      value={{ isLoading, setIsLoading, setIsOverflow }}
    >
      <div
        className={"Home"}
        {...swipeHandlers}
        onTouchStart={handleStart}
        onMouseDown={handleStartPC}
        onTouchEnd={handleEnd}
        onMouseUp={handleEndPC}
        // onWheel={handleWheel}
      >
        <TopBar />
        {!isError ? (
          list.length > 0 ? (
            // <>
            <Swiper
              pages={list.map((memo, index) => (
                <MemoCard key={index} id={memo.id} tabIndex={index} />
              ))}
              isCreate={isCreate}
            />
          ) : (
            // </>
            <ExceptionDisplay
              value="登録されているメモがありません"
              icon={ExceptionIcons.null}
            />
          )
        ) : (
          <ExceptionDisplay
            value="データの取得に失敗しました"
            icon={ExceptionIcons.fail}
          />
        )}
        <Navigation />
        <Menu
          setIsEdit={setIsEdit}
          setIsDelete={setIsDelete}
          handleReload={handleGetMemoSummary}
        />
        <AddModal isActive={isCreate} setIsActive={setIsCreate} />
        <EditModal isActive={isEdit} setIsActive={setIsEdit} />
        <RemoveModal
          isActive={isDelete}
          setIsActive={setIsDelete}
          handleReload={handleGetMemoSummary}
        />
        <TaskEditModal />
      </div>
      {isLoading && <Skeleton />}
    </AppStateContext.Provider>
  );
};
