import { NS as Home } from "@models/home";
import { NS as Menu } from "@models/menu";
import { NS as User } from "@models/user";

import { PagableData } from "./global";
import { MenuListItem } from "./menu/menu";
import { UserInfo, UserModel } from "./user/login";

export interface IHome {
    query: any;
    userMenus: MenuListItem[];
    userInfo: UserModel;
}

export interface IMenu {
    menuListOrigin: MenuListItem[];
    menuList: MenuListItem[];
}

export interface IUser {
    userList: PagableData<UserModel>;
    userInfo: UserInfo;
}

export interface IState {
    [Home]: IHome;
    [Menu]: IMenu;
    [User]: IUser;
}
