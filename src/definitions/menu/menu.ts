export class MenuModel {

  /**
  * 菜单id
  */
  public ID?: number;
  /**
  * 父级Id
  */
  public ParentID: number;
  /**
  * 图标
  */
  public Icon: string;
  /**
  * 名称
  */
  public Name: string;
  /**
  * 是否菜单 1-是, 2-否
  */
  public IsMenu: number;
  /**
  * 链接地址
  */
  public URL: string;
  /**
  * 排序值
  */
  public Sort: number;
  /**
  * 是否删除，1正常2删除
  */
  public Status: number;

  public Remarks: string;

  constructor() {
    this.ID = 0;
    this.ParentID = 0;
    this.Icon = "";
    this.Name = "";
    this.IsMenu = 0;
    this.URL = "";
    this.Sort = 0;
    this.Status = 0;
    this.Remarks = "";
  }
}

export class MenuListItem extends MenuModel {
  public Children?: MenuListItem[];
  public Data: MenuModel;
}

export class RoleMenu {
  public ID: number;
  public MenuID: number;
  public RoleID: number;
}
