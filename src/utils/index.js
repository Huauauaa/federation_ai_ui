import dayjs from 'dayjs';
import { ROLES } from './const';

export const dateTimeFormatter = (val, format = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(val).format(format);
};

export const dateToTime = (
  val,
  { second = 0, minute = 0, hour = 0, format = 'YYYY-MM-DD HH:mm:ss' } = {},
) => {
  return dayjs(val)
    .second(second)
    .minute(minute)
    .hour(hour)
    .format(format);
};

export function exportData(url) {
  const ele = document.createElement('a');
  ele.href = url;
  ele.setAttribute('download', '');
  ele.click();
}

export const getRole = (val) => {
  if (val.is_superuser) {
    return ROLES.find((item) => item.key === 'superuser');
  }
  if (val.is_staff) {
    return ROLES.find((item) => item.key === 'staff');
  }
  return ROLES.find((item) => item.key === 'normal');
};
