import { DIALOG_TYPE, PagableRequest } from "@definitions/global";

export class ReqLogin {
	/**
	* 帐号
	*/
    public Account: string;
	/**
	* 密码
	*/
    public Password: string;
}

export class UserModel {
    /**
    * Account 用户账户
    */
    public Account: string;
    /**
    * Password 登录密码
    */
    public Password: string;
    /**
    * CreatedAt 创建时间
    */
    public CreatedAt: string;
    /**
    * UpdatedAt 更新时间
    */
    public UpdatedAt: string;
    /**
    * Status 状态 1-正常 2-禁用
    */
    public Status: number;

    public RoleID: number;
    /**
     * ID 用户编号
     */
    public ID: number;
}

export class RoleModel {
    public Name: string;
    public ID: number;
    public Status: number;
}

export class UserMenuModel {
    public MenuID: number;
    public UserID: number;
}

export class UserInfo extends UserModel {
    public Menus: UserMenuModel[];

    constructor() {
        super();
        this.Account = "";
        this.Password = "";
    }
}

export class ReqUserList extends PagableRequest {
	/**
	* 搜索关键词
	*/
    public Search?: string;
}

export class ReqAddUser {
    public Account: string;
    public Password: string;
    public Menus: string;
    public ID: number;
    public RoleID: number;

    // Validate 注册验证
    public Validate(type: string) {
        if (this.Account.length < 5) {
            return "帐号至少5位";
        }
        if (type === DIALOG_TYPE.ADD && this.Password.length < 6) {
            return "密码至少6位";
        }
        if (this.RoleID === 0) {
            return "请选择角色";
        }
        return "";
    }
}

export class ReqUpdateStatus {
    public ID: number;
    public Status: number;
}

export class ReqUpdatePassword {
    public oldpwd: string;
    public newpwd: string;
}

export class ReqEditUserResource {
    public userId: number;
    public resourceIds: string;
}
