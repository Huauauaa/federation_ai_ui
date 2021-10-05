import {
  portReg,
  tableNameReg,
  projectNameReg,
  accessIdReg,
  accessSecretReg,
  passwordReg,
  registerPasswordReg,
  emailReg,
} from './regExp';

export function checkPath(rule, value, callback) {
  if (value === '') {
    callback('不能为空');
  } else if (value.length >= 100) {
    callback('名称应小于100个字符');
  } else {
    callback();
  }
}

export function checkName(rule, value, callback) {
  if (value === '') {
    callback('不能为空');
  } else if (value.length >= 25) {
    callback('名称应小于25个字符');
  } else {
    callback();
  }
}

export function checkTableName(rule, value, callback) {
  if (value === '') {
    callback('不能为空');
  } else if (tableNameReg.test(value)) {
    callback();
  } else {
    callback('长度[1,128]，英文字母开头，仅允许英文字母、数字及“_”');
  }
}
export function checkProjectName(rule, value, callback) {
  if (value === '') {
    callback('不能为空');
  } else if (projectNameReg.test(value)) {
    callback();
  } else {
    callback('字符串，长度[3,32]，英文字母开头，仅允许英文字母、数字及“_”');
  }
}
export function checkAccessId(rule, value, callback) {
  if (value === '') {
    callback('不能为空');
  } else if (accessIdReg.test(value)) {
    callback();
  } else {
    callback('字符串，长度不超过32，英文字母开头，仅允许英文字母、数字及“_”');
  }
}
export function checkAccessSecret(rule, value, callback) {
  if (value === '') {
    callback('不能为空');
  } else if (accessSecretReg.test(value)) {
    callback();
  } else {
    callback('字符串，长度不超过32');
  }
}
export function checkIP(rule, value, callback) {
  if (value === '') {
    callback('不能为空');
  } else if (portReg.test(value)) {
    callback();
  } else {
    callback('请输入正确的IP格式');
  }
}
export function checkPort(rule, value, callback) {
  if (value === '') {
    callback('不能为空');
  } else if (
    Number.isInteger(Number(value)) &&
    Number(value) >= 0 &&
    Number(value) <= 65535
  ) {
    callback();
  } else {
    callback('端口号应为0-65535之间的整数');
  }
}

export function checkPassword(rule, value, callback, isRegister = false) {
  if (isRegister && !registerPasswordReg.test(value)) {
    callback(
      '至少8个字符，至少1个大写字母，1个小写字母和1个数字，其他可以是任意字符',
    );
  }
  if (passwordReg.test(value)) {
    callback();
  } else {
    callback('密码长度不能少于8位');
  }
}

export function checkConfirmPassword(originValue, rule, value, callback) {
  if (originValue === value) {
    callback();
  } else {
    callback('两次填写的密码不一致');
  }
}

export function checkUsername(rule, value, callback) {
  if (value.length > 10) {
    callback('长度不能大于10');
  } else {
    callback();
  }
}

export function checkEmail(rule, value, callback) {
  if (emailReg.test(value)) {
    callback();
  } else {
    callback('邮箱格式不正确');
  }
}

export function checkIntegerNumber(rule, value, callback) {
  const num = Number(value);
  if (!Number.isInteger(num) || num < 1) {
    callback('列数应为正整数');
  } else {
    callback();
  }
}
