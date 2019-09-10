import classNames from "classnames";
import React from "react";
import "./flex.less";
import FlexItem from "./FlexItem";

interface IFlexProps {
  layout?: "horizontal" | "vertical";
  align?: "top" | "middle" | "bottom";
  justify?: "start" | "center" | "end" | "space-around" | "space-between";
  className?: string;
  children?: React.ReactNode;
}

const Flex = ({ align = "middle", layout = "horizontal", justify = "center", className, children, ...rest }: IFlexProps) => (
  <div
    {...rest}
    className={classNames(
      {
        "crc-flex": true,
        [`crc-flex_align__${align}`]: align,
        [`crc-flex_layout__${layout}`]: layout,
        [`crc-flex_justify__${justify}`]: justify,
      },
      className,
    )}
  >
    {children}
  </div>
);

Flex.Item = FlexItem;

export default Flex;
