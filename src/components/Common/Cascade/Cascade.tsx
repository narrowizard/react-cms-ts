import { Col, Row, Select } from "antd";
import React from "react";
import styles from "./Cascade.less";

interface IBaseModel<V> {
    Id: V;
}

interface ICascadeProps<V, T> {
    onGetData: (pid: V, level: number) => Promise<T[]>;
    onChange: (cids: V[]) => void;
    cids: V[];
    titleKey: string;
    colProps?: any;
}
interface ICascadeState<V, T> {
    list: T[][];
    cache: V[];
}

export default class Cascade<V extends number | string, T extends IBaseModel<V>> extends React.Component<ICascadeProps<V, T>, ICascadeState<V, T>> {

    constructor(props: ICascadeProps<V, T>) {
        super(props);
        this.getData = this.getData.bind(this);
        this.setData = this.setData.bind(this);
        this.initData = this.initData.bind(this);
        this.state = {
            list: [],
            cache: [],
        };
    }

    public componentDidMount() {
        this.initData(this.props);
    }

    public componentWillReceiveProps(nextProps: ICascadeProps<V, T>) {
        if (this.props.cids !== nextProps.cids) {
            this.initData(nextProps);
        }
    }

    public initData(props: ICascadeProps<V, T>) {
        const { cids } = props;
        const chains = cids.map((id, index) => {
            return () => {
                if (id === undefined) {
                    return Promise.resolve();
                }
                return this.getData(index + 1, id);
            };
        });
        chains.push(() => {
            return new Promise((resolve, reject) => {
                this.setState({
                    cache: cids,
                }, resolve);
            });
        });
        chains.reduce((l, n) => {
            return l.then(n);
        }, Promise.resolve());
    }

    public getData(level: number, pid: V) {
        const { cache } = this.state;
        const { onGetData } = this.props;
        if (cache[level - 1] === pid) {
            return Promise.resolve();
        }
        return onGetData(pid, level).then((data) => {
            this.setData(level, data);
        });
    }

    public setData(level: number, data: T[]) {
        const list = [...this.state.list];
        list[level] = data;
        list.splice(level + 1);
        this.setState({
            list,
        });
    }

    public render() {
        const { colProps, cids, onChange, titleKey } = this.props;

        return (
            <Row gutter={20} className={styles.companyCascade}>
                {
                    this.state.list &&
                    this.state.list.map((item, index) => {
                        if (item.length === 0) {
                            return null;
                        }
                        return (
                            <Col {...colProps} key={index}>
                                <Select
                                    allowClear
                                    value={cids[index] || undefined}
                                    onChange={(v) => {
                                        const newCid = [...cids];
                                        newCid[index] = v;
                                        newCid.splice(index + 1);
                                        onChange(newCid);
                                    }}>
                                    {
                                        item.map((e) => {
                                            return (
                                                <Select.Option key={e.Id} value={e.Id} title={e[titleKey]}>{e[titleKey]}</Select.Option>
                                            );
                                        })
                                    }
                                </Select>
                            </Col>
                        );
                    })
                }
            </Row>
        );
    }
}
