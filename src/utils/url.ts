import qs from "querystring";
import parse from "url-parse";

/**
 * replaceParams 替换url参数， 返回替换后的url
 * @param url string | object,
 */
export function replaceParams(url: string, params: any) {
    const urlObject = parse(url, true);
    urlObject.set("query", { ...urlObject.query, ...params });
    return urlObject.toString();
}

export function replaceQueryParams(query: string, params: any) {
    const withPrefix = query.startsWith("?");
    if (withPrefix) {
        query = query.substr(1);
    }
    const queryObject = qs.parse(query);
    const newQueryObject = { ...queryObject, ...params };
    return `?${decodeURIComponent(qs.stringify(newQueryObject))}`;
}

export function getPathname(url: string) {
    const urlObject = parse(url);
    return urlObject.pathname;
}
