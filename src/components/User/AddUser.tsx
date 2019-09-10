import { DIALOG_TYPE } from "@definitions/global";
import { MenuListItem } from "@definitions/menu/menu";
import { ReqAddUser, RoleModel, UserInfo } from "@definitions/user/login";
import { Button, Icon, Input, message, Select, Tree } from "antd";
import classnames from "classnames";
import React from "react";
import styles from "./AddUser.less";

const { TreeNode } = Tree;

interface IAddUserProps {
    onSubmit: (item: ReqAddUser) => Promise<void> | null;
    type: string;
    item: UserInfo;
    roleList: RoleModel[];
}

interface IAddUserState {
    item: UserInfo;
    checkedKeys: string[];
    onLoading: boolean;
}

export default class AddUser extends React.Component<IAddUserProps, IAddUserState> {

    constructor(props: IAddUserProps) {
        super(props);
        this.onInputChange = this.onInputChange.bind(this);
        this.renderTreeNode = this.renderTreeNode.bind(this);
        this.onCompanyCheck = this.onCompanyCheck.bind(this);
        this.onRoleChange = this.onRoleChange.bind(this);
        const item = new UserInfo();
        const checkedKeys: string[] = [];
        if (props.type === DIALOG_TYPE.EDIT && props.item) {
            item.Account = props.item.Account;
            item.ID = props.item.ID;
            item.RoleID = props.item.RoleID;
        }
        this.state = {
            item,
            checkedKeys,
            onLoading: false,
        };
    }

    public onInputChange(key: "Account" | "Password", value: string) {
        const item = { ...this.state.item };
        item[key] = value;
        this.setState({
            item,
        });
    }

    public onRoleChange(value: number) {
        const item = { ...this.state.item };
        item.RoleID = value;
        this.setState({
            item,
        });
    }

    public onCompanyCheck(checkedKeys: string[]) {
        this.setState({
            checkedCompanies: checkedKeys,
        });
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
        const { onSubmit, type, roleList } = this.props;
        return (
            <div className={styles.form}>
                <div className={styles.item}>
                    <Input disabled={type === DIALOG_TYPE.EDIT} onChange={(e) => { this.onInputChange("Account", e.target.value); }} value={this.state.item.Account} prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />} placeholder="用户名" />
                </div>
                <div className={classnames(styles.item, {
                    [styles.hidden]: this.props.type === DIALOG_TYPE.EDIT,
                })}>
                    <Input type="password" onChange={(e) => { this.onInputChange("Password", e.target.value); }} value={this.state.item.Password} prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />} placeholder="密码" />
                </div>
                <div className={styles.item}>
                    <Select
                        placeholder="请选择角色"
                        value={this.state.item.RoleID}
                        onChange={this.onRoleChange}
                    >
                        {
                            roleList.map((item) => (
                                <Select.Option key={item.ID} value={item.ID}>{item.Name}</Select.Option>
                            ))
                        }
                    </Select>
                </div>
                <div className={styles.item}>
                    <Button
                        className={styles.submit}
                        type="primary"
                        loading={this.state.onLoading}
                        onClick={() => {
                            const { item } = this.state;
                            const data = new ReqAddUser();
                            data.Account = item.Account;
                            data.ID = item.ID;
                            data.Password = item.Password;
                            data.RoleID = item.RoleID;
                            if (data.Validate(type) !== "") {
                                message.error(data.Validate(type));
                                return;
                            }
                            this.setState({
                                onLoading: true,
                            });
                            const result = onSubmit(data);
                            if (result) {
                                result.then(() => {
                                    this.setState({
                                        onLoading: false,
                                    });
                                });
                            } else {
                                this.setState({
                                    onLoading: false,
                                });
                            }
                        }} >{type === DIALOG_TYPE.ADD ? "添加" : "保存"}</Button>
                </div>
            </div>
        );
    }
}
