export function paramsToLowerCaseStarter(p: string) {
    if (!p) {
        return "";
    }
    const res = p.replace(/^[A-Z]/, (s) => (s.toLocaleLowerCase()));
    return res;
}

export function shortSort(s: string) {
    if (s === "ascend") {
        return "asc";
    } else if (s === "descend") {
        return "desc";
    }
    return "";
}
