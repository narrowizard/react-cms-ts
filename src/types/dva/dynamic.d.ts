import { DvaInstance } from "dva";
import { ComponentType } from "react";

declare const dynamic: (opts: {
    app: DvaInstance,
    models?: () => Array<PromiseLike<any>>,
    component: () => PromiseLike<any>,
}) => ComponentType<any>;
export default dynamic;
