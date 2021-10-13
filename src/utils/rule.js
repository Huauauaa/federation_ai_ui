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

export function checkPath(rule, value) {
  if (!value) {
    return Promise.reject(new Error('不能为空'));
  }
  if (value.length >= 100) {
    return Promise.reject(new Error('名称应小于100个字符'));
  }
  return Promise.resolve();
}

export function checkName(rule, value) {
  if (!value) {
    return Promise.reject(new Error('不能为空'));
  }
  if (value.length >= 25) {
    return Promise.reject(new Error('名称应小于25个字符'));
  }
  return Promise.resolve();
}

export function checkTableName(rule, value) {
  if (!value) {
    return Promise.reject(new Error('不能为空'));
  }
  if (tableNameReg.test(value)) {
    return Promise.resolve();
  }
  return Promise.reject(
    new Error('长度[1,128]，英文字母开头，仅允许英文字母、数字及“_”'),
  );
}
export function checkProjectName(rule, value) {
  if (!value) {
    return Promise.reject(new Error('不能为空'));
  }
  if (projectNameReg.test(value)) {
    return Promise.resolve();
  }
  return Promise.reject(
    new Error('字符串，长度[3,32]，英文字母开头，仅允许英文字母、数字及“_”'),
  );
}
export function checkAccessId(rule, value) {
  if (!value) {
    return Promise.reject(new Error('不能为空'));
  }
  if (accessIdReg.test(value)) {
    return Promise.resolve();
  }
  return Promise.reject(
    new Error('字符串，长度不超过32，英文字母开头，仅允许英文字母、数字及“_”'),
  );
}
export function checkAccessSecret(rule, value) {
  if (!value) {
    return Promise.reject(new Error('不能为空'));
  }
  if (accessSecretReg.test(value)) {
    return Promise.resolve();
  }
  return Promise.reject(new Error('字符串，长度不超过32'));
}
export function checkIP(rule, value) {
  if (!value) {
    return Promise.reject(new Error('不能为空'));
  }
  if (portReg.test(value)) {
    return Promise.resolve();
  }
  return Promise.reject(new Error('请输入正确的IP格式'));
}
export function checkPort(rule, value) {
  if (!value) {
    return Promise.reject(new Error('不能为空'));
  }
  if (
    Number.isInteger(Number(value)) &&
    Number(value) >= 0 &&
    Number(value) <= 65535
  ) {
    return Promise.resolve();
  }
  return Promise.reject(new Error('端口号应为0-65535之间的整数'));
}

export function checkPassword(rule, value, isRegister = false) {
  if (!value) {
    return Promise.reject(new Error('不能为空'));
  }
  if (isRegister && !registerPasswordReg.test(value)) {
    return Promise.reject(
      new Error(
        '至少8个字符，至少1个大写字母，1个小写字母和1个数字，其他可以是任意字符',
      ),
    );
  }
  if (passwordReg.test(value)) {
    return Promise.resolve();
  }
  return Promise.reject(new Error('密码长度不能少于8位'));
}

export function checkConfirmPassword(originValue, rule, value) {
  if (originValue === value) {
    return Promise.resolve();
  }
  return Promise.reject(new Error('两次填写的密码不一致'));
}

export function checkUsername(rule, value) {
  if (value.length > 10) {
    return Promise.reject(new Error('长度不能大于10'));
  }
  return Promise.resolve();
}

export function checkEmail(rule, value) {
  if (emailReg.test(value)) {
    return Promise.resolve();
  }
  return Promise.reject(new Error('邮箱格式不正确'));
}

export function checkIntegerNumber(rule, value) {
  const num = Number(value);
  if (!Number.isInteger(num) || num < 1) {
    return Promise.reject(new Error('列数应为正整数'));
  }
  return Promise.resolve();
}
