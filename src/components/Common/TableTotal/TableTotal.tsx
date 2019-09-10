import React from "react";
import styles from "./TableTotal.less";

interface ITableTotalProps {
    total: number;
}
interface ITableTotalState { }

export default class TableTotal extends React.Component<ITableTotalProps, ITableTotalState> {

    constructor(props: ITableTotalProps) {
        super(props);
    }

    public render() {
        return (
            <div>
                <p className={styles.summary}>共有<span>{this.props.total}</span>条数据</p>
            </div>
        );
    }
}
