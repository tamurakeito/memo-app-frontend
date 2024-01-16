import "./index.scss";
import { MemoCard } from "components/memo-card";
import { TopBar } from "components/top-bar";
import { Swiper } from "components/swiper";
import { PlusButton } from "ui/molecules/plus-button";
import { Navigation } from "components/navigation";
import { createContext, useEffect, useState } from "react";
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

export const LoadStateContext = createContext({
  isLoading: false,
  setIsLoading: (_: boolean) => {
    console.log("load state provider unimplement.");
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
  const isMenu = useMenuContext().isActive;

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
  }, []);

  const windowHeight = window.innerHeight;

  const [tapY, setTapY] = useState<number | undefined>();

  const handleSwipeUp = () => {
    !isCreate &&
      !isEdit &&
      !isNavigation &&
      !isMenu &&
      tapY !== undefined &&
      windowHeight - tapY < (1 / 4) * windowHeight &&
      setIsDelete(true);
    isCreate && setIsCreate(false);
    isEdit && setIsEdit(false);
  };
  const handleSwipeDown = () => {
    !isDelete &&
      !isEdit &&
      !isNavigation &&
      !isMenu &&
      tapY !== undefined &&
      tapY < (1 / 4) * windowHeight &&
      setIsCreate(true);
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

  const [isKeyDown, setIsKeyDown] = useState(false);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isKeyDown) {
        switch (event.key) {
          case "Dead": // alt + n
            !isCreate && setIsNavigation(!isNavigation);
            break;
          case "å": // alt + a
            !isNavigation && setIsCreate(!isCreate);
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

  return (
    <LoadStateContext.Provider value={{ isLoading, setIsLoading }}>
      <div
        className={"Home"}
        {...swipeHandlers}
        onTouchStart={handleStart}
        onMouseDown={handleStartPC}
        onTouchEnd={handleEnd}
        onMouseUp={handleEndPC}
      >
        <TopBar />
        {!isError ? (
          list.length > 0 ? (
            <>
              <Swiper
                pages={list.map((memo, index) => (
                  <MemoCard key={index} id={memo.id} tabIndex={index} />
                ))}
                isCreate={isCreate}
              />
              <PlusButton onClick={() => setIsCreate(true)} />
            </>
          ) : (
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
        <Navigation handleReload={handleGetMemoSummary} />
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
      </div>
      {isLoading && <Skeleton />}
    </LoadStateContext.Provider>
  );
};
