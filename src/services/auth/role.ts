import { RoleModel } from "@definitions/user/login";
import { getUser, postUser, putUser } from "./proxy";

export function getRoleList(search: string): Promise<RoleModel[]> {
    return getUser("/role/list", {
        search,
    });
}

export function updateRoleStatus(roleid: number, status: number) {
    return putUser("/role/update", {
        roleid,
        status,
    });
}

export function updateRole(roleid: number, name: string, menus: string) {
    return putUser("/role/update", {
        roleid,
        name,
        menus,
    });
}

export function newRole(name: string, menus: string) {
    return postUser("/role/new", {
        name,
        menus,
    });
}

export function getRoleInfo(roleid: number) {
    return getUser("/role/info", {
        roleid,
    });
}
