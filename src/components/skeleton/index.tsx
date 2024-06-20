import { Line } from "ui/atoms/line";
import "./index.scss";
import { IconButton } from "ui/molecules/icon-button";
import { ChevronUp, Menu, MoreVertical, Tag } from "react-feather";
import { ListBlock, TitleBlock } from "components/memo-card";
import { Text, TextSizes } from "ui/atoms/text";
import { SwipeIndexDisplay } from "components/swiper";
import useInterval from "hooks/useInterval";
import { useState } from "react";
import { log } from "console";
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

const SkeletonIconButton = ({ className }: { className: string }) => {
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
      <SkeletonBox width={200} height={16} className={"block-content"} />
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
      </div>
      <div className="Swiper">
        <SkeletonMemoCard />
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
    <div className="MemoCard">
      <Line top={0} />
      <div className="memo-card">
        <SkeletonBox width={250} height={25} className={"TitleBlock"} />
        <div className="InCompleteContainer">
          <SkeletonListBlock />
          <SkeletonListBlock />
          <SkeletonListBlock />
          <SkeletonListBlock />
        </div>
        {/* <Line /> */}
        {/* <div className="CompleteContainer">
          <div className="toggle">
            <Text className={"kanryou"} size={TextSizes.text2}>
              完了
            </Text>
            <div className={"arrow open"}>
              <ChevronUp />
            </div>
          </div>
          <div className="complete-box open">
            <ListBlock key={0} id={0} name={"スケルトン"} complete={true} />
            <ListBlock key={1} id={0} name={"スケルトン"} complete={true} />
            <ListBlock key={2} id={0} name={"スケルトン"} complete={true} />
          </div>
        </div> */}
      </div>
    </div>
  );
};
