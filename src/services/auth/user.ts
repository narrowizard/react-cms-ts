import { DEFAULT_PAGE_SIZE } from "@config/constant";
import { ReqAddUser } from "@definitions/user/login";
import { delAuth, delUser, getAuth, getUser, postAuth, postUser, putAuth, putUser } from "./proxy";

/**
 * 获取用户列表
 * @param {number} page 页码
 * @param {number} pagesize 每页条数
 * @param {string} search 搜索内容
 */
export function getUserList(page: number, search: string) {
    return getUser("/user/list", {
        page,
        pagesize: DEFAULT_PAGE_SIZE,
        search,
    });
}

/**
 * 获取用户详细信息
 * @param {number} id 用户编号
 */
export function getUserInfo(id: number) {
    return getUser("/user/info", {
        id,
    });
}

/**
 * 创建新用户
 * @param {string} account 帐号
 * @param {string} password 密码
 */
export function createUser(params: ReqAddUser) {
    return postUser("/user/new", {
        account: params.Account,
        password: params.Password,
        roleid: params.RoleID,
    });
}

/**
 * 删除用户
 * @param {number} userid 用户编号
 */
export function deleteUser(userid: number) {
    return delUser("/user/delete", {
        userid,
    });
}

/**
 * 更新用户数据
 * @param {number} userid 用户编号
 * @param {number} status 用户状态
 */
export function updateUserStatus(userid: number, status: number) {
    return putUser("/user/update", {
        userid,
        status,
    });
}

/**
 * 更新用户的菜单信息
 * @param {number} userid 用户编号
 * @param {number} roleid 角色编号
 */
export function updateUserModules(userid: number, roleid: number) {
    return putUser("/user/update", {
        userid,
        roleid,
    });
}

/**
 * 登录接口
 * @param {string} account 用户名
 * @param {string} password 密码
 */
export function login(account: string, password: string) {
    return postAuth("/user/login", {
        account,
        password,
    });
}

export function logout() {
    return delAuth("/user/logout");
}

/**
 * 获取登录状态
 */
export function isLogin() {
    return getAuth("/user/islogin");
}

/**
 * 修改密码
 * @param {string} oldpwd 旧密码
 * @param {string} newpwd 新密码
 */
export function updatePassword(params: { oldpwd: string, newpwd: string }) {
    return putAuth("/user/updatepassword", params);
}
