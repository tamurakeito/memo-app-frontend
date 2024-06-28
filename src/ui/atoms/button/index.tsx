import { ReactNode } from "react";

export const Button = ({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className: string;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}) => {
  return (
    <div className={className} onClick={onClick}>
      {children}
    </div>
  );
};
