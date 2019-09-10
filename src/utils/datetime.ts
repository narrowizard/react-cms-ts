class OurDate {

  public static fromISO(s: string) {
    const temp = new OurDate(s);
    if (!s) {
      return null;
    }
    return temp;
  }

  public static fromDate(d: Date) {
    const temp = new OurDate();
    temp.date = d;
    return temp;
  }

  public date?: Date;
  constructor(dateStr?: string) {
    let dateString = dateStr;
    if (!dateString) {
      // 获取当前时间
      this.date = new Date();
      return this;
    }

    if (
      typeof dateString === "string" &&
      dateString.indexOf("T") === -1 &&
      dateString.indexOf("-") !== -1
    ) {
      // 格式化时间字符串，解决 safari 不兼容问题
      // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
      dateString = dateString.trim();
      dateString = dateString.replace(/\s/g, "T");
      dateString += "Z";
    }

    const D = new Date("2011-06-02T09:34:29+02:00");
    if (!D || +D !== 1307000069000) {
      // 不支持ISO格式的js引擎
      let day: string[];
      let tz: number;
      const rx = /^(\d{4}\-\d\d\-\d\d([tT ][\d:\.]*)?)([zZ]|([+\-])(\d\d):(\d\d))?$/;
      const p = rx.exec(dateString) || [];
      if (p[1]) {
        day = p[1].split(/\D/);
        for (let i = 0, L = day.length; i < L; i++) {
          day[i] = parseInt(day[i], 10) || 0;
        }
        day[1] -= 1;
        day = new Date(Date.UTC.apply(Date, day));
        if (!day.getDate()) { this.date = undefined; }
        if (p[5]) {
          tz = parseInt(p[5], 10) * 60;
          if (p[6]) { tz += parseInt(p[6], 10); }
          if (p[4] === "+") { tz *= -1; }
          if (tz) { day.setUTCMinutes(day.getUTCMinutes() + tz); }
        }
        this.date = day;
      }
      this.date = undefined;
    } else {
      this.date = new Date(dateString);
    }
  }

  public Format(fmt: string) {
    if (!this.date) {
      return "";
    }
    const o = {
      "M+": this.date.getMonth() + 1, // 月份
      "d+": this.date.getDate(), // 日
      "h+": this.date.getHours(), // 小时
      "m+": this.date.getMinutes(), // 分
      "s+": this.date.getSeconds(), // 秒
      "q+": Math.floor((this.date.getMonth() + 3) / 3), // 季度
      "S": this.date.getMilliseconds(), // 毫秒
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (this.date.getFullYear() + "").substr(4 - RegExp.$1.length),
      );
    }
    for (const k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1
            ? o[k]
            : ("00" + o[k]).substr(("" + o[k]).length),
        );
      }
    }
    return fmt;
  }
}

export { OurDate };
