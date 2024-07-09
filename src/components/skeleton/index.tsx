import { Line } from "ui/atoms/line";
import "./index.scss";
import classNames from "classnames";

const SkeletonBox = ({
  width,
  height,
  className,
}: {
  width: number;
  height: number;
  className?: string;
}) => {
  const classes = classNames(["SkeletonBox", className]);
  return <div className={classes} style={{ width: width, height: height }} />;
};

const SkeletonIconButton = ({ className }: { className?: string }) => {
  return (
    <div className={`IconButton ${className}`}>
      <SkeletonBox width={20} height={20} />
    </div>
  );
};
const SkeletonListBlock = () => {
  return (
    <div className={"ListBlock"}>
      <div className={"point-icon"}>
        <SkeletonBox width={16} height={16} />
      </div>
      <div className={"swipable"}>
        <SkeletonBox width={200} height={16} className={"block-content"} />
      </div>
      <div className={"complete-icon"}>
        <SkeletonBox width={18} height={18} />
      </div>
    </div>
  );
};

export const Skeleton = () => {
  const SkeletonSwipeIndexCircle = () => {
    return (
      <div className={"Circle"}>
        <SkeletonBox width={10} height={10} />
      </div>
    );
  };

  return (
    <div className="Skeleton">
      <div className="TopBar">
        <SkeletonIconButton className={"HamburgerIconButton"} />
        <SkeletonIconButton className={"TagIconButton"} />
        <SkeletonIconButton className={"OptionIconButton"} />
        <Line top={47} />
      </div>
      <div className="Swiper">
        <div className={"MemoCard"}>
          <SkeletonMemoCard />
        </div>
        <div className="SwipeIndexDisplay">
          <SkeletonSwipeIndexCircle />
          <SkeletonSwipeIndexCircle />
          <SkeletonSwipeIndexCircle />
          <SkeletonSwipeIndexCircle />
        </div>
      </div>
    </div>
  );
};

export const SkeletonMemoCard = () => {
  return (
    <div className="memo-card">
      <div className={"TitleBlock"}>
        <SkeletonBox width={18} height={18} className={"icon"} />
        <SkeletonBox width={250} height={25} className={"block-content"} />
      </div>
      <div className="InCompleteContainer">
        <SkeletonListBlock />
        <SkeletonListBlock />
        <SkeletonListBlock />
        <SkeletonListBlock />
      </div>
    </div>
  );
};
