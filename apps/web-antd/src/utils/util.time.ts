import dayjs from 'dayjs';

export function formatTime(
  value: string,
  template: string = 'YYYY-MM-DD HH:mm:ss',
): null | string {
  if (value) {
    return dayjs(value).format(template);
  }
  return null;
}
