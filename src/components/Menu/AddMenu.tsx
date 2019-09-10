import { MenuModel } from "@definitions/menu/menu";
import { getIcons } from "@services/auth/menu";
import { Button, Icon, Input, Radio, Select } from "antd";
import React from "react";
import styles from "./AddMenu.less";

const { Option } = Select;

interface IAddMenuProps {
    onSubmit: (data: MenuModel) => void;
    originData: MenuModel[];
    current: MenuModel;
    type: string;
}

interface IAddMenuState {
    item: MenuModel;
    icons: string[];
}

class AddMenu extends React.Component<IAddMenuProps, IAddMenuState> {

    constructor(props: IAddMenuProps) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSelectParent = this.onSelectParent.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.state = {
            item: props.current,
            icons: [],
        };
    }

    public componentDidMount() {
        getIcons().then((icons) => {
            this.setState({
                icons,
            });
        });
    }

    public onSubmit() {
        this.props.onSubmit(this.state.item);
    }

    public onSelectParent(value: string) {
        const item = { ...this.state.item };
        item.ParentID = +value;
        this.setState({
            item,
        });
    }

    public onInputChange(key: "Name" | "URL" | "Remarks" | "IsMenu" | "Icon", value: string) {
        const item = { ...this.state.item };
        item[key] = value;
        this.setState({
            item,
        });
    }

    public render() {
        const { originData } = this.props;
        const temp = new MenuModel();
        temp.ID = 0;
        temp.Name = "根菜单节点";
        const menuList = [temp, ...originData];
        const options = this.state.icons.map((item) => {
            return <Option key={item} value={item}><Icon type={item} /> {item}</Option>;
        });
        return (
            <div className={styles.form}>
                <div className={styles.item}>
                    <Select
                        showSearch
                        optionFilterProp="children"
                        value={`${this.state.item.ParentID}`}
                        onSelect={this.onSelectParent}
                        className={styles.input}
                    >
                        {menuList.map((item) => (
                            <Select.Option key={`${item.ID}`} value={`${item.ID}`}>
                                {item.Name}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
                <div className={styles.item}>
                    <Input onChange={(e) => { this.onInputChange("Name", e.target.value); }} value={this.state.item.Name} prefix={<Icon type="menu" style={{ color: "rgba(0,0,0,.25)" }} />} placeholder="菜单名称" />
                </div>
                <div className={styles.item}>
                    <Input onChange={(e) => { this.onInputChange("URL", e.target.value); }} value={this.state.item.URL} prefix={<Icon type="link" style={{ color: "rgba(0,0,0,.25)" }} />} placeholder="链接地址" />
                </div>
                <div className={styles.item}>
                    <Input.TextArea onChange={(e) => { this.onInputChange("Remarks", e.target.value); }} value={this.state.item.Remarks} placeholder="备注" />
                </div>
                <div className={styles.item}>
                    <Select
                        showSearch
                        allowClear
                        style={{ display: "block" }}
                        placeholder="选择模块图标"
                        optionFilterProp="children"
                        onChange={(value) => {
                            this.onInputChange("Icon", value);
                        }}
                        value={this.state.item.Icon}
                        filterOption={(input, option) => {
                            return option.props.children[2].toLowerCase().indexOf(input.toLowerCase()) >= 0;
                        }}
                    >
                        {options}
                    </Select>
                </div>
                <div className={styles.item}>
                    <Radio.Group buttonStyle="solid" value={this.state.item.IsMenu} onChange={(e) => this.onInputChange("IsMenu", e.target.value)}>
                        <Radio.Button value={1}>模块</Radio.Button>
                        <Radio.Button value={2}>接口</Radio.Button>
                    </Radio.Group>
                </div>
                <div className={styles.item}>
                    <Button type="primary" className={styles.submit} onClick={this.onSubmit} >
                        {this.props.type === "add" ? "添加" : "保存"}
                    </Button>
                </div>
            </div>
        );
    }
}

export default AddMenu;
