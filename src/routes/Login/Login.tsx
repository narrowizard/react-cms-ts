import { SITE_TITLE } from "@config/constant";
import { RootAction } from "@definitions/types";
import { ReqLogin } from "@definitions/user/login";
import actionCreators from "@models/actions/user";
import {
    Button, Form, Icon, Input,
} from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import { connect } from "dva";
import qs from "querystring";
import React, { FormEvent } from "react";
import DocumentTitle from "react-document-title";
import { bindActionCreators, Dispatch } from "redux";
import styles from "./Login.less";

interface ILoginProps {
    form: WrappedFormUtils;
    dispatch: Dispatch<RootAction>;
    login: (params: ReqLogin) => Promise<void>;
}

class Login extends React.Component<ILoginProps> {

    constructor(props: ILoginProps) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public handleSubmit(e: FormEvent) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.login(values).then(() => {
                    let returnUrl = "/";
                    const query = qs.parse(window.location.search.substr(1));
                    if (query.f && typeof query.f === "string") {
                        returnUrl = query.f;
                    }
                    window.location.href = returnUrl;
                });
            }
        });
    }

    public render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <DocumentTitle
                title={`登录 - ${SITE_TITLE}`}
            >
                <div className={styles.formWrapper}>
                    <h1>登录系统</h1>
                    <Form onSubmit={this.handleSubmit} className={styles.form}>
                        <Form.Item>
                            {getFieldDecorator("Account", {
                                rules: [{ required: true, message: "请输入帐号" }],
                            })(
                                <Input prefix={
                                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                                } placeholder="帐号" />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator("Password", {
                                rules: [{ required: true, message: "请输入密码" }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />} type="password" placeholder="密码" />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className={styles.submit}>
                                登录
                        </Button>
                        </Form.Item>
                    </Form>
                </div>
            </DocumentTitle>
        );
    }
}

const actions = actionCreators(true);

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
    dispatch,
    login: bindActionCreators(actions.login, dispatch),
});

export default connect(undefined, mapDispatchToProps)(Form.create()(Login));
