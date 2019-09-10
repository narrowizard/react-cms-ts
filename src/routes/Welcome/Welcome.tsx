import { Empty } from "antd";
import React from "react";
import styles from "./Welcome.less";

export default class Welcome extends React.Component {
    public render() {
        return (
            <div className={styles.wrapper}>
                <Empty
                    description="Welcome"
                />
            </div>
        );
    }
}
