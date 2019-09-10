
import { message } from "antd";
import fetch from "isomorphic-fetch";

/**
 *
 * @param {*} url
 * @param {*} data
 * @param {string} method
 */
function ajax(url: string, data: any, method: "GET" | "POST" | "PUT" | "DELETE") {
    const promise = new Promise<string>((resolve, reject) => {
        let params = "";
        if (!data) {
            data = {};
        }
        // add public param app id
        data.AppId = "quanmaikai";
        for (const p in data) {
            if (data.hasOwnProperty(p) && data[p]) {
                params += `${p}=${data[p]}&`;
            }
        }
        params = params.substr(0, params.length - 1);
        const options: RequestInit = {
            method,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            credentials: "include",
        };
        switch (method.toUpperCase()) {
            case "GET":
            case "DELETE": {
                url = url + "?" + params;
                break;
            }
            case "POST":
            case "PUT": {
                options.body = params;
                break;
            }
            default:
                break;
        }

        fetch(url, options).then((res) => {
            try {
                if (!res.ok) {
                    // 请求失败
                    res.json().then((json) => {
                        if (json.reason) {
                            if (json.reason.indexOf("UnLoginError") > -1) {
                                window.location.href = `/login?f=${encodeURIComponent(window.location.href)}`;
                            } else if (json.reason.indexOf("PasswordNotMatchError") > -1) {
                                reject("用户名或密码错误");
                            } else if (json.reason.indexOf("UserForbiddenError") > -1) {
                                reject("该帐号已经被锁定, 请联系管理员");
                            } else if (json.reason.indexOf("UserExistedError") > -1) {
                                reject("该用户名已被使用");
                            } else {
                                reject(json.message);
                            }
                            return;
                        }
                        reject(json.message);
                    });
                    return;
                }
                res.text().then((text) => {
                    resolve(text);
                });
            } catch (e) {
                reject("无法解析的返回值");
            }
        }).catch((msg) => {
            reject(msg);
        });
    });
    promise.catch((msg) => {
        message.error(msg);
    });
    return promise;
}

export function get(url: string, data: any) {
    return ajax(url, data, "GET");
}

export function post(url: string, data: any) {
    return ajax(url, data, "POST");
}

export function del(url: string, data: any) {
    return ajax(url, data, "DELETE");
}

export function put(url: string, data: any) {
    return ajax(url, data, "PUT");
}
