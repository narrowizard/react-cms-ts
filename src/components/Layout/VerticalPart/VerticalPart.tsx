import React from "react";
import styles from "./VerticalPart.less";

interface IVerticalPartProps { }
interface IVerticalPartState { }

export default class VerticalPart extends React.Component<IVerticalPartProps, IVerticalPartState> {

    constructor(props: IVerticalPartProps) {
        super(props);
    }

    public render() {
        const { children } = this.props;
        return (
            <div className={styles.verticalPart}>
                {children}
            </div>
        );
    }
}
