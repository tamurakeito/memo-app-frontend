import { Button } from "ui/atoms/button";
import "./index.scss";

export const PlusButton = ({ onClick }: { onClick: () => void }) => {
  const PlusMark = () => {
    return (
      <div className="PlusMark">
        <span className="vertical" />
        <span className="horizontal" />
      </div>
    );
  };
  return (
    <Button className={"PlusButton"} onClick={onClick}>
      <PlusMark />
    </Button>
  );
};
