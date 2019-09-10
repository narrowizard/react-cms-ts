import { DIALOG_TYPE } from "@definitions/global";
import { LevelModel } from "@definitions/level/level";
import { MenuModel, ReqGetMenu } from "@definitions/menu/menu";
import { Button, Icon, Input, Tree } from "antd";
import React from "react";
import styles from "./AddLevel.less";

interface IAddLevelProps {
    current: LevelModel;
    menuList: MenuModel[];
    getMenu: (params: ReqGetMenu) => Promise<void>;
    onSubmit: (params: LevelModel) => void;
    type: string;
}

interface IAddLevelState {
    item: LevelModel;
    checkedKeys: string[];
}

const { TreeNode } = Tree;

export default class AddLevel extends React.Component<IAddLevelProps, IAddLevelState> {

    constructor(props: IAddLevelProps) {
        super(props);
        this.renderTreeNode = this.renderTreeNode.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onCheck = this.onCheck.bind(this);
        this.state = {
            item: props.current,
            checkedKeys: props.current.AuthList ? props.current.AuthList.split(",") : [],
        };
    }

    public componentDidMount() {
        const { menuList } = this.props;
        if (menuList.length === 0) {
            this.props.getMenu({
                ParentId: 0,
                Page: 0,
            });
        }
    }

    public onSubmit() {
        this.props.onSubmit({
            Name: this.state.item.Name,
            AuthList: this.state.checkedKeys.join(","),
            Id: this.state.item.Id,
        });
    }

    public onCheck(checkedKeys: string[]) {
        this.setState({
            checkedKeys,
        });
    }

    public onInputChange(key: "Name", value: string) {
        const item = { ...this.state.item };
        item[key] = value;
        this.setState({
            item,
        });
    }

    public renderTreeNode(data: MenuModel[]) {
        return data.map((item) => {
            if (item.Children) {
                return (
                    <TreeNode title={item.Name} key={`${item.Id}`} dataRaf={item} >
                        {this.renderTreeNode(item.Children)}
                    </TreeNode>
                );
            }
            return <TreeNode title={item.Name} key={`${item.Id}`} dataRef={item} />;
        });
    }

    public render() {
        const { menuList, type } = this.props;
        return (
            <div className={styles.form}>
                <div className={styles.item}>
                    <Input onChange={(e) => { this.onInputChange("Name", e.target.value); }} value={this.state.item.Name} prefix={<Icon type="menu" style={{ color: "rgba(0,0,0,.25)" }} />} placeholder="权限级别名称" />
                </div>
                <div className={styles.item}>
                    <Tree
                        checkable
                        onCheck={this.onCheck}
                        checkedKeys={this.state.checkedKeys}
                    >
                        {this.renderTreeNode(menuList)}
                    </Tree>
                </div>
                <div className={styles.item}>
                    <Button type="primary" className={styles.submit} onClick={this.onSubmit} >
                        {type === DIALOG_TYPE.ADD ? "添加" : "保存"}
                    </Button>
                </div>
            </div>
        );
    }
}
