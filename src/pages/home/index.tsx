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

export const Home = () => {
  const { list, setListData } = useListContext();
  const { isError, setIsError } = useErrorContext();
  const [isCreate, setIsCreate] = useState(false);
  useEffect(() => {
    (async () => {
      const response = await getMemoSummary();
      !!response ? setListData(response) : setIsError(true);
    })();
  }, []);

  return (
    <div className={"Home"}>
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
      <Menu />
      <AddModal isActive={isCreate} setIsActive={setIsCreate} />
    </div>
  );
};
