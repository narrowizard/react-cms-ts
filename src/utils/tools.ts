import { IMap } from "@definitions/global";

interface ITreeableData {
    // ParentId === 0 表示根节点
    ParentID: number;
    // Id 必须唯一
    ID?: number;
    Children?: ITreeableData[];
    handled?: boolean;
}

export class TreeData {

    public mData: ITreeableData[];

    constructor(data: ITreeableData[]) {
        this.mData = data;
    }

    public addChild(pid: number, child: ITreeableData, data?: ITreeableData[]) {
        if (!data) {
            data = this.mData;
        }
        data.forEach((item) => {
            if (item.Children && item.Children.length > 0) {
                this.addChild(pid, child, item.Children);
            }
            if (item.ID === pid) {
                if (!item.Children) {
                    item.Children = [];
                }
                item.Children.push(child);
                return;
            }
        });
        return data;
    }
}

export class ListTree<T extends ITreeableData> {
    public mData: T[];

    constructor(data: T[]) {
        this.mData = data;
    }

    public getListData() {
        return this.mData;
    }

    public getTreeData() {
        this.mData.forEach((item) => {
            if (item.ParentID !== 0) {
                const pIndex = this.findParent(item.ParentID);
                if (pIndex > -1) {
                    const temp = this.mData[pIndex];
                    if (!temp.Children) {
                        temp.Children = [];
                    }
                    temp.Children.push(item);
                    item.handled = true;
                }
            }
        });
        const result: T[] = [];
        this.mData.forEach((item) => {
            if (!item.handled) {
                result.push(item);
            }
        });
        return result;
    }

    public findParent(id: number) {
        let i = -1;
        this.mData.forEach((item, index) => {
            if (item.ID === id) {
                i = index;
                return false;
            }
            return true;
        });
        if (i === -1) {
            console.warn(`cannot find parent, id ${id}`);
        }
        return i;
    }
}

export function Map2Array<T>(map: IMap<T>) {
    const array: Array<{ key: string, data: T }> = [];
    Object.keys(map).forEach((k) => {
        array.push({
            key: k,
            data: map[k],
        });
    });
    return array;
}
