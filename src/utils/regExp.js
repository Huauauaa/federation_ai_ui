export const portReg = /^(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})(\.(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})){3}$/;
/**
 * 字符串，长度[1,128]，英文字母开头，仅允许英文字母、数字及“_”
 */
export const tableNameReg = /^[a-zA-Z][a-zA-z0-9_]{0,127}$/;

/**
 * 字符串，长度[3,32]，英文字母开头，仅允许英文字母、数字及“_”，大小写不敏感
 */
export const projectNameReg = /^[a-zA-Z][a-zA-z0-9_]{2,31}$/;
/**
 * 字符串，长度不超过32，英文字母开头，仅允许英文字母、数字及“_”
 */
export const accessIdReg = /^[a-zA-Z][a-zA-z0-9_]{0,31}$/;

/**
 * 字符串，长度不超过32，像密码一样显示***
 */
export const accessSecretReg = /^\S{1,32}$/;

export const passwordReg = /^\S{8,}$/;
export const registerPasswordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/;
export const emailReg = /^(([a-z0-9\u4e00-\u9fa5]+([._\\-]*[a-z0-9\u4e00-\u9fa5]))+)+@[a-zA-Z0-9_-]+((\.[a-zA-Z0-9_-])+([a-zA-Z0-9_-]+)+)+$/;
