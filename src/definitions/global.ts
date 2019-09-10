import { CompareFn } from "antd/lib/table";

export interface IEmpty {

}

export interface IModel {
    namespace: string;
    effects?: any;
    reducers?: any;
    subscriptions?: any;
}

export interface IDynamicRouteInfo {
    models: string[];
    component: () => PromiseLike<any>;
}

export interface IRouterDataItem {
    name: string;
    path: string;
    exact?: boolean;
    component: React.ComponentType<any>;
}

export interface IResponseData<T> {
    Code: number;
    Data: T;
    Message?: string;
}

export class PagableRequest {
    /**
	* 页码，为0代表获取全部数据
	*/
    public Page: number;
    /**
	* 每页数
	*/
    public PageSize?: number;
}

export class PagableData<T> {
    public Page: number;
    public PageCount: number;
    public Total: number;
    public Data: T[];

    constructor() {
        this.Data = [];
    }
}

export const DIALOG_TYPE = {
    ADD: "add",
    EDIT: "edit",
};

export class ColumnModel<T> {
    constructor(public title: string | React.ReactNode,
                public dataIndex: string,
                public key: string,
                public render?: (text: string, record: T, index: number) => React.ReactNode,
                public children?: Array<ColumnModel<T>>,
                public sorter?: boolean | CompareFn<T>,
                public defaultSortOrder?: "descend" | "ascend") {
    }
}

export class NewColumnModel {
    constructor(public title: string | React.ReactNode,
                public dataIndex: string, others?: IMap<any>) {
        if (others) {
            for (const key in others) {
                if (others[key]) {
                    this[key] = others[key];
                }
            }
        }
    }
}

export interface IMap<V = string> {
    [index: string]: V;
}

export interface IKeyValueMap {
    Id: number;
    Name: string;
}
