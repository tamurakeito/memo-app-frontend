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
import { getMemoDetail } from "data/api/getMemoDetail";
import { useTabContext } from "providers/tab-provider";

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
  const handleStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setTapY(event.changedTouches[0].clientY);
  };
  const handleStartPC = (event: React.MouseEvent<HTMLDivElement>) => {
    setTapY(event.clientY);
  };
  const handleEnd = () => {
    setTapY(undefined);
  };

  const swipeHandlers = useSwipeable({
    onSwiped: (event) => {
      if (
        event.dir === "Up" &&
        tapY !== undefined &&
        windowHeight - tapY < (1 / 4) * windowHeight
      ) {
        !isCreate && !isEdit && !isNavigation && !isMenu && setIsDelete(true);
        isCreate && setIsCreate(false);
        isEdit && setIsEdit(false);
      }
      if (
        event.dir === "Down" &&
        tapY !== undefined &&
        tapY < (1 / 4) * windowHeight
      ) {
        !isDelete && !isEdit && !isNavigation && !isMenu && setIsCreate(true);
      }
    },
    trackMouse: true,
  });

  return (
    <LoadStateContext.Provider value={{ isLoading, setIsLoading }}>
      <div
        className={"Home"}
        {...swipeHandlers}
        onTouchStart={handleStart}
        onMouseDown={handleStartPC}
        onTouchEnd={handleEnd}
        onMouseUp={handleEnd}
      >
        <TopBar />
        {!isError ? (
          list.length > 0 ? (
            <>
              <Swiper
                pages={list.map((memo, index) => (
                  <MemoCard key={index} id={memo.id} tabIndex={index} />
                ))}
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
