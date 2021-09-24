import dayjs from 'dayjs';

export const dateTimeFormatter = (val, format = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(val).format(format);
};

export const dateToTime = (
  val,
  { second = 0, minute = 0, hour = 0, format = 'YYYY-MM-DD HH:mm:ss' } = {},
) => {
  return dayjs(val).second(second).minute(minute).hour(hour).format(format);
};

export function exportData(url) {
  const ele = document.createElement('a');
  ele.href = url;
  ele.setAttribute('download', '');
  ele.click();
}
