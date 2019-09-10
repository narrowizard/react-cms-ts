import { IResponseData } from "@definitions/global";
import { message } from "antd";
import fetch from "isomorphic-fetch";

/**
 *
 * @param {*} url
 * @param {*} data
 * @param {string} method
 */
function ajax<T>(url: string, data: any, method: "GET" | "POST" | "PUT" | "DELETE") {
    const promise = new Promise<T>((resolve, reject) => {
        let params = "";
        if (!data) {
            data = {};
        }
        // add public param app id
        // data.AppId = "quanmaikai";
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
                    res.json().then((data) => {
                        if (data.reason) {
                            if (data.reason.indexOf("UnLoginError") > -1) {
                                window.location.href = `/login?f=${encodeURIComponent(window.location.href)}`;
                            }
                            if (data.reason.indexOf("UnAuthorizedError") > -1) {
                                reject("您的权限不足,请联系管理员.");
                            }
                            return;
                        }
                    });
                    return;
                }
                res.json().then((resultData: IResponseData<T>) => {
                    resultData = translateResponse(resultData);
                    if (resultData.Code !== 0) {
                        reject(resultData.Message || "未定义的错误!");
                        return;
                    } else {
                        resolve(resultData.Data);
                    }
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

export function get<T>(url: string, data: any) {
    return ajax<T>(url, data, "GET");
}

export function post<T>(url: string, data: any) {
    return ajax<T>(url, data, "POST");
}

export function del<T>(url: string, data: any) {
    return ajax<T>(url, data, "DELETE");
}

export function put<T>(url: string, data: any) {
    return ajax<T>(url, data, "PUT");
}

function translateResponse(inData: any): any {
    let outData: any;
    if (inData === null) {
        return null;
    } else if (Array.isArray(inData)) {
        outData = inData.map((item) => translateResponse(item));
    } else if (typeof inData === "object") {
        outData = {};
        Object.keys(inData).forEach((value) => {
            outData[underscopeToCamel(value)] = translateResponse(inData[value]);
        });
    } else {
        outData = inData;
    }
    return outData;
}

function underscopeToCamel(input: string): string {
    return input.replace(/^([a-z])/g, (g) => g.toUpperCase()).replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

// let test = translateResponse([{ name_scope: 111, what_u: "222" }]);
// console.log(test);

// test = translateResponse({ name_scope: 111, what_u: "222" });
// console.log(test);
