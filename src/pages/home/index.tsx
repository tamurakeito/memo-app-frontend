import "./index.scss";
import { MemoCard } from "components/memo-card";
import { TopBar } from "components/top-bar";
import { Swiper } from "components/swiper";
import { PlusButton } from "ui/molecules/plus-button";
import { Navigation } from "components/navigation";
import { useEffect, useState } from "react";
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

export const Home = () => {
  const { list, setListData } = useListContext();
  const { isError, setIsError } = useErrorContext();
  const [isCreate, setIsCreate] = useState(false);
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
        isCreate || isNavigation || isMenu || setIsDelete(true);
      }
      if (event.dir === "Down") {
        isDelete || isNavigation || isMenu || setIsCreate(true);
      }
    },
    trackMouse: true,
  });

  return (
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
      <Menu setIsDelete={setIsDelete} />
      <AddModal isActive={isCreate} setIsActive={setIsCreate} />
      <RemoveModal isActive={isDelete} setIsActive={setIsDelete} />
    </div>
  );
};
