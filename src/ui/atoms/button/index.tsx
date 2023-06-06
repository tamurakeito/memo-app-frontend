import { ReactNode } from "react";

export const Button = ({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className: string;
  onClick: () => void;
}) => {
  return (
    <div className={className} onClick={onClick}>
      {children}
    </div>
  );
};
