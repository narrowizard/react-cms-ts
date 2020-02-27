import { MenuListItem, MenuModel } from "@definitions/menu/menu";
import { delUser, getUser, postUser, putUser } from "./proxy";

/**
 * 获取模块列表
 */
export function getModules() {
    return getUser("/menu/list").then((data) => {
        return translateMenuData(data);
    });
}

/**
 * 获取用户有权限的模块列表
 */
export function getUserModules() {
    return getUser("/user/menulist").then((data) => {
        return translateMenuData(data);
    });
}

/**
 * getIcons 获取antd支持的icon
 */
export function getIcons() {
    return new Promise<string[]>((resolve, reject) => {
        // tslint:disable-next-line:max-line-length
        const data = [
            "step-backward",
            "step-forward",
            "fast-backward",
            "fast-forward",
            "shrink",
            "arrows-alt",
            "down",
            "up",
            "left",
            "right",
            "caret-up",
            "caret-down",
            "caret-left",
            "caret-right",
            "up-circle",
            "down-circle",
            "left-circle",
            "right-circle",
            "up-circle-o",
            "down-circle-o",
            "right-circle-o",
            "left-circle-o",
            "double-right",
            "double-left",
            "verticle-left",
            "verticle-right",
            "forward",
            "backward",
            "rollback",
            "enter",
            "retweet",
            "swap",
            "swap-left",
            "swap-right",
            "arrow-up",
            "arrow-down",
            "arrow-left",
            "arrow-right",
            "play-circle",
            "play-circle-o",
            "up-square",
            "down-square",
            "left-square",
            "right-square",
            "up-square-o",
            "down-square-o",
            "left-square-o",
            "right-square-o",
            "login",
            "logout",
            "menu-fold",
            "menu-unfold",
            "question",
            "question-circle-o",
            "question-circle",
            "plus",
            "plus-circle-o",
            "plus-circle",
            "pause",
            "pause-circle-o",
            "pause-circle",
            "minus",
            "minus-circle-o",
            "minus-circle",
            "plus-square",
            "plus-square-o",
            "minus-square",
            "minus-square-o",
            "info",
            "info-circle-o",
            "info-circle",
            "exclamation",
            "exclamation-circle-o",
            "exclamation-circle",
            "close",
            "close-circle",
            "close-circle-o",
            "close-square",
            "close-square-o",
            "check",
            "check-circle",
            "check-circle-o",
            "check-square",
            "check-square-o",
            "clock-circle-o",
            "clock-circle",
            "warning",
            "lock",
            "unlock",
            "area-chart",
            "pie-chart",
            "bar-chart",
            "dot-chart",
            "bars",
            "book",
            "calendar",
            "cloud",
            "cloud-download",
            "code",
            "code-o",
            "copy",
            "credit-card",
            "delete",
            "desktop",
            "download",
            "edit",
            "ellipsis",
            "file",
            "file-text",
            "file-unknown",
            "file-pdf",
            "file-word",
            "file-excel",
            "file-jpg",
            "file-ppt",
            "file-markdown",
            "file-add",
            "folder",
            "folder-open",
            "folder-add",
            "hdd",
            "frown",
            "frown-o",
            "meh",
            "meh-o",
            "smile",
            "smile-o",
            "inbox",
            "laptop",
            "appstore-o",
            "appstore",
            "line-chart",
            "link",
            "mail",
            "mobile",
            "notification",
            "paper-clip",
            "picture",
            "poweroff",
            "reload",
            "search",
            "setting",
            "share-alt",
            "shopping-cart",
            "tablet",
            "tag",
            "tag-o",
            "tags",
            "tags-o",
            "to-top",
            "upload",
            "user",
            "video-camera",
            "home",
            "loading",
            "loading-3-quarters",
            "cloud-upload-o",
            "cloud-download-o",
            "cloud-upload",
            "cloud-o",
            "star-o",
            "star",
            "heart-o",
            "heart",
            "environment",
            "environment-o",
            "eye",
            "eye-o",
            "camera",
            "camera-o",
            "save",
            "team",
            "solution",
            "phone",
            "filter",
            "exception",
            "export",
            "customer-service",
            "qrcode",
            "scan",
            "like",
            "like-o",
            "dislike",
            "dislike-o",
            "message",
            "pay-circle",
            "pay-circle-o",
            "calculator",
            "pushpin",
            "pushpin-o",
            "bulb",
            "select",
            "switcher",
            "rocket",
            "bell",
            "disconnect",
            "database",
            "compass",
            "barcode",
            "hourglass",
            "key",
            "flag",
            "layout",
            "printer",
            "sound",
            "usb",
            "skin",
            "tool",
            "sync",
            "wifi",
            "car",
            "schedule",
            "user-add",
            "user-delete",
            "usergroup-add",
            "usergroup-delete",
            "man",
            "woman",
            "shop",
            "gift",
            "idcard",
            "medicine-box",
            "red-envelope",
            "coffee",
            "copyright",
            "trademark",
            "safety",
            "wallet",
            "bank",
            "trophy",
            "contacts",
            "global",
            "shake",
            "api",
            "fork",
            "dashboard",
            "form",
            "table",
            "profile",
            "android",
            "android-o",
            "apple",
            "apple-o",
            "windows",
            "windows-o",
            "ie",
            "chrome",
            "github",
            "aliwangwang",
            "aliwangwang-o",
            "dingding",
            "dingding-o",
            "weibo-square",
            "weibo-circle",
            "taobao-circle",
            "html5",
            "weibo",
            "twitter",
            "wechat",
            "youtube",
            "alipay-circle",
            "taobao",
            "skype",
            "qq",
            "medium-workmark",
            "gitlab",
            "medium",
            "linkedin",
            "google-plus",
            "dropbox",
            "facebook",
            "codepen",
            "amazon",
            "google",
            "codepen-circle",
            "alipay",
            "ant-design",
            "aliyun",
            "zhihu",
            "slack",
            "slack-square",
            "behance",
            "behance-square",
            "dribbble",
            "dribbble-square",
            "instagram",
            "yuque",
        ];
        resolve(data);
    });
}

/**
 * 创建新模块
 * @param {number} pid 父模块编号
 * @param {string} name 模块名称
 * @param {string} url 模块地址
 * @param {string} icon 模块图标
 * @param {string} remarks 模块说明
 * @param {number} ismenu 1-模块 2-接口
 */
export function newModule(params: MenuModel) {
    return postUser("/menu/new", {
        parentid: params.ParentID,
        name: params.Name,
        url: params.URL,
        icon: params.Icon,
        remarks: params.Remarks,
        ismenu: params.IsMenu,
    });
}

/**
 * 更新模块信息
 * @param {number} id 模块编号
 * @param {string} name 模块名称
 * @param {string} url 模块地址
 * @param {string} icon 模块图标
 * @param {string} remarks 模块说明
 * @param {number} ismenu 1-模块 2-接口
 */
export function updateModule(params: MenuModel) {
    return putUser("/menu/update", {
        id: params.ID,
        name: params.Name,
        url: params.URL,
        icon: params.Icon,
        remarks: params.Remarks,
        ismenu: params.IsMenu,
    });
}

export function deleteModule(id: number) {
    return delUser("/menu/delete", {
        id,
    });
}

function translateMenuData(menu: MenuListItem[]) {
    for (let i = 0; i < menu.length; i++) {
        const v = menu[i];
        if (v.Children && v.Children.length > 0) {
            v.Children = translateMenuData(v.Children);
            // 为了兼容tree table的字段名
            v.children = v.Children;
        }
        menu[i] = Object.assign(menu[i], menu[i].Data);
    }
    return menu;
}
