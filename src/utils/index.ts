import { FormattedGender, FormattedGenderKey } from "src/types/Types";
import { Gender } from "src/types/Types.context";

/**
 * ex)URLJoin("http://www.google.com", "a", undefined, "/b/cd", undefined, "?foo=123", "?bar=foo"); => "http://www.google.com/a/b/cd/?foo=123&bar=foo"
 */
export const URLJoin = (...args: (string | undefined)[]): string => {
  args = args.filter((n) => n !== void 0);
  for (let i = args.length - 1; i >= 0; i--) {
    const arg = args[i];
    if (typeof arg === "string") {
      if (arg.toString().startsWith("?")) continue;
      if (!arg.toString().endsWith("/")) {
        args[i] += "/";
        break;
      }
    }
  }
  return args
    .join("/")
    .replace(/[/]+/g, "/")
    .replace(/^(.+):\//, "$1://")
    .replace(/^file:/, "file:/")
    .replace(/\/(\?|&|#[^!])/g, "$1")
    .replace(/\?/g, "&")
    .replace("&", "/?");
};

export const generateUuid4 = (): string => {
  const chars = [];
  for (const char of "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx") {
    switch (char) {
      case "x":
        chars.push(Math.floor(Math.random() * 16).toString(16));
        break;
      case "y":
        chars.push((Math.floor(Math.random() * 4) + 8).toString(16));
        break;
      default:
        chars.push(char);
        break;
    }
  }
  return chars.join("");
};

export const cvtListDate = (date: Date): string => {
  const today = new Date(Date.now());
  if (today.getFullYear() === date.getFullYear()) {
    if (today.getMonth() === date.getMonth()) {
      if (today.getDate() === date.getDate()) {
        // 当日
        return fmtfromDateToStr(date, "hh:mm");
      } else if (today.getDate() - 1 === date.getDate()) {
        // 1日前
        return "昨日";
      } else {
        // 1日以上前
        return fmtfromDateToStr(date, "MM/DD");
      }
    } else {
      // 1か月以上前
      return fmtfromDateToStr(date, "MM/DD");
    }
  } else {
    // 昨年以前
    return fmtfromDateToStr(date, "YYYY/MM/DD");
  }
};

/** fmtfromDateToStr(new Date(), "YYYY/MM/DD hh:mm:ss"); */
export const fmtfromDateToStr = (date: Date, format: string): string => {
  let _date: Date = date;
  if (!format) {
    format = "YYYY/MM/DD hh:mm:ss";
  }
  if (typeof date === "string") {
    _date = new Date(date);
  }
  format = format.replace(/YYYY/g, _date.getFullYear().toString());
  format = format.replace(/MM/g, ("0" + (_date.getMonth() + 1)).slice(-2));
  format = format.replace(/DD/g, ("0" + _date.getDate()).slice(-2));
  format = format.replace(/hh/g, ("0" + _date.getHours()).slice(-2));
  format = format.replace(/mm/g, ("0" + _date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ("0" + _date.getSeconds()).slice(-2));
  return format;
};

/**
 * (deep Ver)スネークケースのobjのkeyをすべてキャメルケースに変換
 **/
export const deepCvtKeyFromSnakeToCamel = (
  obj: Record<string, unknown> | unknown[] | unknown
): Record<string, unknown> | unknown[] | unknown => {
  if (Array.isArray(obj)) {
    return obj.map((elm) => deepCvtKeyFromSnakeToCamel(elm));
  }
  if (!isObject(obj)) return obj; // string | number | boolean

  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => {
      let _v;
      if (isObject(v)) {
        // object
        _v = deepCvtKeyFromSnakeToCamel(v);
      } else if (Array.isArray(v)) {
        // Array
        _v = v.map((elm) =>
          isObject(elm) || Array.isArray(elm)
            ? deepCvtKeyFromSnakeToCamel(elm)
            : elm
        );
      } else {
        _v = v;
      }
      return [fromSnakeToCamel(k), _v];
    })
  );
};

/**
 * @deprecated
 * スネークケースのobjのkeyをすべてキャメルケースに変換
 * @param obj
 */
export const cvtKeyFromSnakeToCamel = (
  obj: Record<string, unknown>
): Record<string, unknown> => {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [fromSnakeToCamel(k), v])
  );
};

/**
 * スネークケースのtextをキャメルケースに変換(例外: id => ID)
 * @param text
 */
export const fromSnakeToCamel = (text: string): string => {
  // const textConvertedID = text.replace(/_id/g, () => "ID");
  return text.replace(/_./g, (s) => {
    return s.charAt(1).toUpperCase();
  });
};

export const cvtBadgeCount = (badgeCount: number): number | null => {
  if (badgeCount <= 0) {
    return null;
  } else {
    if (badgeCount > 99) {
      return 99;
    } else {
      return badgeCount;
    }
  }
};

export const isString = (str: unknown): str is string => {
  return typeof str === "string" || str instanceof String;
};

export const deepCopy = (
  obj: Record<string, unknown>,
  passKeys: string[] = []
): Record<string, unknown> => {
  const r: Record<string, unknown> = {};
  for (const name in obj) {
    const a = obj[name];
    if (passKeys.includes(name)) {
      // ["ws"] そのままcopy
      r[name] = a;
    } else if (isObject(a)) {
      r[name] = deepCopy(a, passKeys);
    } else {
      r[name] = obj[name];
    }
  }
  return r;
};

export const isObject = (val: unknown): val is Record<string, unknown> => {
  return val !== null && typeof val === "object" && !Array.isArray(val);
};

// ios環境でcloseCodeが1001で固定されてしまうため対処
export const closeWsSafely = (ws: WebSocket): void => {
  if (isObject(ws) && Object.keys(ws).length) {
    ws.onclose = (e) => {
      return e;
    };
    ws.close();
  } else {
    console.log("ws is empty object");
  }
};

/** オブジェクトに不正なkeyが含まれていないか判定
 * @param {array} correctKeys
 * @param {Object} targetObj
 * @param {function} discoverIncorrectCallback (incorrectkey{string}) => {}
 * */
export const checkCorrectKey = (
  correctKeys: string[],
  targetObj: Record<string, unknown>,
  discoverIncorrectCallback: (incorrectkey: string) => void
): void => {
  const targetObjKeys = Object.keys(targetObj);
  targetObjKeys.forEach((targetObjKey) => {
    if (!correctKeys.includes(targetObjKey)) {
      discoverIncorrectCallback(targetObjKey);
    }
  });
};

/**
 * パスワード生成
 */
export const generatePassword = (length = 12): string => {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!#$%&()-";

  const string = letters + letters.toUpperCase() + numbers + symbols;

  let password = "";
  for (let i = 0; i < length; i++) {
    password += string.charAt(Math.floor(Math.random() * string.length));
  }
  return password;
};

/**
 * 単純にobj.hasOwnProperty(key)だとESLintが怒るので
 * https://qiita.com/qoAop/items/9605de1186c4b1a79965
 */
export const hasProperty = (
  obj: Record<string, unknown>,
  key: string
): boolean => {
  return !!obj && Object.prototype.hasOwnProperty.call(obj, key);
};

/**
 * gender(notset有)をformattedGender(secret有)に変換
 * @param gender
 * @param isSecretGender
 */
export const formatGender = (
  gender: Gender,
  isSecretGender: boolean
): FormattedGender => {
  const isNotSet = gender.key !== "male" && gender.key !== "female";
  let key: FormattedGenderKey;
  let label;
  if (isSecretGender || (gender.key !== "male" && gender.key !== "female")) {
    key = "secret";
    label = "性別内緒";
  } else {
    key = gender.key;
    label = gender.label;
  }

  return { key, label, isNotSet, realGenderKey: gender.key };
};

export const includeUrl = (targetText: string): boolean => {
  const keyWordsToJudgeUrl = ["https://", "http://"];
  return keyWordsToJudgeUrl.some((kw) => {
    return targetText.includes(kw);
  });
};

type EqualsArray = (a: unknown[], b: unknown[], order?: boolean) => boolean;
/**配列の要素がobjectの場合等は未対応
 */
export const equalsArray: EqualsArray = (
  a,
  b,
  order = true /* falseの場合順不同 */
) => {
  if (!Array.isArray(a)) return false;
  if (!Array.isArray(b)) return false;
  if (a.length != b.length) return false;

  for (let i = 0, n = a.length; i < n; ++i) {
    if (a.length != b.length) return false;
    if (order) {
      if (a[i] !== b[i]) return false;
    } else {
      if (!b.includes(a[i])) return false;
    }
  }
  return true;
};

/**
 * @param {string} tag
 * @param {string} type
 * @param {string} value
 */
export const logAdmob = (tag = "AD", type: string, value: string): void => {
  console.log(`[${tag}][${type}]:`, value);
};

// export const getValue = <T>(
//   object: Record<string, T>,
//   key: string,
//   initValue: T
// ): T => {
//   return typeof object[key] !== "undefined" ? object[key] : initValue;
// };

export const getValue = <T>(
  valueMaybeUndefine: T | undefined,
  initValue: T
): T => {
  return typeof valueMaybeUndefine !== "undefined"
    ? valueMaybeUndefine
    : initValue;
};
