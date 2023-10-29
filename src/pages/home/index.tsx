import "./index.scss";
import { MemoCard } from "components/memo-card";
import { TopBar } from "components/top-bar";
import { Swiper } from "components/swiper";
import { PlusButton } from "ui/molecules/plus-button";
import { Navigation } from "components/navigation";
import { createContext, useEffect, useState } from "react";
import { getMemoSummary } from "data/api/getMemoSummary";
import { useListContext } from "providers/list-provider";
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
  const { list, setListData } = useListContext();
  const { isError, setIsError } = useErrorContext();
  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const isNavigation = useNaviContext().isActive;
  const isMenu = useMenuContext().isActive;
  useEffect(() => {
    (async () => {
      const response = await getMemoSummary();
      !!response ? setListData(response) : setIsError(true);
    })();
  }, []);

  const swipeHandlers = useSwipeable({
    onSwiped: (event) => {
      if (event.dir === "Up") {
        isCreate || isEdit || isNavigation || isMenu || setIsDelete(true);
      }
      if (event.dir === "Down") {
        isDelete || isEdit || isNavigation || isMenu || setIsCreate(true);
      }
    },
    trackMouse: true,
  });

  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadStateContext.Provider value={{ isLoading, setIsLoading }}>
      <div className={"Home"} {...swipeHandlers}>
        {!isError ? (
          list.length > 0 ? (
            <>
              <TopBar />
              <Swiper
                pages={list.map((memo, index) => (
                  <MemoCard key={index} id={memo.id} />
                ))}
              />
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
        <PlusButton onClick={() => setIsCreate(true)} />
        <Navigation />
        <Menu setIsEdit={setIsEdit} setIsDelete={setIsDelete} />
        <AddModal isActive={isCreate} setIsActive={setIsCreate} />
        <EditModal isActive={isEdit} setIsActive={setIsEdit} />
        <RemoveModal isActive={isDelete} setIsActive={setIsDelete} />
      </div>
      {isLoading && <Skeleton />}
    </LoadStateContext.Provider>
  );
};
