import classNames from "classnames";
import React from "react";
import "./flex.less";

interface IFlexItemProps {
  unflex?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const FlexItem = ({ unflex, className, children, ...rest }: IFlexItemProps) => (
  <div
    {...rest}
    className={classNames(
      {
        "crc-flex_item": true,
        "crc-flex_flexItem": !unflex,
      },
      className,
    )}
  >
    {children}
  </div>
);

export default FlexItem;
