import { ReqUpdatePassword } from "@definitions/user/login";
import { Button, Form, Input, message } from "antd";
import { FormComponentProps } from "antd/lib/form/Form";
import React from "react";

interface IUpdatePasswordProps extends FormComponentProps {
    onUpdatePassword: (params: ReqUpdatePassword) => Promise<void>;
    onClose: () => void;
}

class UpdatePassword extends React.Component<IUpdatePasswordProps> {

    constructor(props: IUpdatePasswordProps) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    public onSubmit(e: React.FormEvent) {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if (values.newpwd !== values.newpwdConfirm) {
                    message.warn("两次输入的密码不同, 请确认");
                    return;
                }
                this.props.onUpdatePassword(values).then(() => {
                    message.success("修改成功");
                    this.props.onClose();
                });
            }
        });
    }

    public render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form
                labelCol={{
                    span: 6,
                }}
                wrapperCol={{
                    span: 16,
                }}
                onSubmit={this.onSubmit}
            >
                <Form.Item label="旧密码">
                    {
                        getFieldDecorator("oldpwd", {
                            rules: [
                                {
                                    required: true,
                                    message: "请输入旧密码",
                                },
                            ],
                        })(<Input.Password />)
                    }
                </Form.Item>
                <Form.Item label="新密码">
                    {
                        getFieldDecorator("newpwd", {
                            rules: [
                                {
                                    required: true,
                                    message: "请输入新密码",
                                },
                            ],
                        })(<Input.Password />)
                    }
                </Form.Item>
                <Form.Item label="确认新密码">
                    {
                        getFieldDecorator("newpwdConfirm", {
                            rules: [
                                {
                                    required: true,
                                    message: "请输入确认新密码",
                                },
                            ],
                        })(<Input.Password />)
                    }
                </Form.Item>
                <Form.Item style={{ textAlign: "center" }} wrapperCol={{
                    span: 24,
                }}>
                    <Button type="primary" htmlType="submit">提交</Button>
                </Form.Item>
            </Form>
        );
    }
}

const form = Form.create<IUpdatePasswordProps>({ name: "updatePassword" })(UpdatePassword);

export default form;
