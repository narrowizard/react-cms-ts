import React from "react";
import styles from "./Filter.less";

export default class Filter extends React.Component {
    public render() {
        const { children } = this.props;
        return (
            <div className={styles.filter}>
                {children}
            </div>
        );
    }
}
