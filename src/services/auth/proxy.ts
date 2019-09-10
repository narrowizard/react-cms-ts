import { del, get, post, put } from "./ajax";

export function postAuth(url: string, data?: any) {
    return post("/auth" + url, data);
}

export function getAuth(url: string, data?: any) {
    return get("/auth" + url, data);
}

export function delAuth(url: string, data?: any) {
    return del("/auth" + url, data);
}

export function putAuth(url: string, data?: any) {
    return put("/auth" + url, data);
}

export function postUser(url: string, data?: any) {
    return post("/user" + url, data);
}

export function getUser(url: string, data?: any) {
    return get("/user" + url, data).then((json) => {
        return JSON.parse(json);
    });
}

export function delUser(url: string, data?: any) {
    return del("/user" + url, data);
}

export function putUser(url: string, data?: any) {
    return put("/user" + url, data);
}
