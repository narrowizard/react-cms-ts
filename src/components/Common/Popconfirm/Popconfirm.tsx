import { Popconfirm } from "antd";
import { PopconfirmProps } from "antd/lib/popconfirm";
import React from "react";

const Pop = ({ ...props }: PopconfirmProps) => (
    <Popconfirm okText="确定" cancelText="取消" {...props} />
);

export default Pop;
