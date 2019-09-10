import Flex from "@components/Common/Flex";
import { MenuListItem, RoleMenu } from "@definitions/menu/menu";
import { RoleModel } from "@definitions/user/login";
import { getRoleInfo } from "@services/auth/role";
import { Button, Input, Tree } from "antd";
import React from "react";
import styles from "./RoleEditView.less";

const { TreeNode } = Tree;

interface IRoleEditViewProps {
    roleInfo: RoleModel | null;
    menuData: MenuListItem[];
    onAddRole: (name: string, menus: string) => void;
    onEditRole: (name: string, menus: string, id: number) => void;
}

interface IRoleEditViewState {
    checkedKeys: string[];
    name: string;
    id: number;
}

export default class RoleEditView extends React.Component<IRoleEditViewProps, IRoleEditViewState> {

    constructor(props: IRoleEditViewProps) {
        super(props);
        this.renderTreeNode = this.renderTreeNode.bind(this);
        this.onKeyCheck = this.onKeyCheck.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.state = {
            checkedKeys: [],
            name: "",
            id: 0,
        };
    }

    public componentDidMount() {
        if (this.props.roleInfo) {
            getRoleInfo(this.props.roleInfo.ID).then((data) => {
                this.setState({
                    id: data.ID,
                    name: data.Name,
                    checkedKeys: data.Menus.map((item: RoleMenu) => item.MenuID),
                });
            });
        }
    }

    public onKeyCheck(checkedKeys: {
        checked: string[];
        halfChecked: string[];
    }) {
        this.setState({
            checkedKeys: checkedKeys.checked,
        });
    }

    public onChangeName(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            name: e.target.value,
        });
    }

    public onSubmit() {
        if (this.state.id) {
            this.props.onEditRole(this.state.name, JSON.stringify(this.state.checkedKeys.map((item) => +item)), this.state.id);
        } else {
            this.props.onAddRole(this.state.name, JSON.stringify(this.state.checkedKeys.map((item) => +item)));
        }
    }

    public renderTreeNode(data: MenuListItem[]) {
        return data.map((item) => {
            if (item.Children && item.Children.length > 0) {
                return <TreeNode key={`${item.ID}`} title={item.Name}>{this.renderTreeNode(item.Children)}</TreeNode>;
            }
            return <TreeNode key={`${item.ID}`} title={item.Name} />;
        });
    }

    public render() {
        const { menuData } = this.props;
        return (
            <div className={styles.form}>
                <div className={styles.item}>
                    <Flex>
                        <Flex.Item className={styles.label} unflex>
                            角色名称
                        </Flex.Item>
                        <Flex.Item className={styles.input}>
                            <Input value={this.state.name} onChange={this.onChangeName} />
                        </Flex.Item>
                    </Flex>
                </div>
                <div className={styles.item}>
                    <Tree
                        checkable
                        showLine
                        checkStrictly
                        checkedKeys={this.state.checkedKeys}
                        onCheck={this.onKeyCheck}
                    >
                        {this.renderTreeNode(menuData)}
                    </Tree>
                </div>
                <div className={styles.operator}>
                    <Button type="primary" onClick={this.onSubmit}>保存</Button>
                </div>
            </div>
        );
    }
}
