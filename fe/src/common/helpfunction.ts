const initFilter = {
  CurrentPage: 0,
  PageSize: 10,
  KeyWord: "",
}

export function formatDateStringGMT(
  datestring: string | Date,
  type:
    | 'yyyy'
    | 'mm/yyyy'
    | 'dd/mm/yyyy'
    | 'vie:dd/mm/yyyy'
    | 'yyyy//mm/dd'
    | 'mm/dd/yyyy'
    | 'hh:mm'
    | 'dd/mm/yyyy hh:mm'
    | 'hh:mm dd/mm/yyyy'
    | 'dd/mm'
    | 'vie:day, dd/mm'
    | string, // fallback cho custom type nếu có
  isLocale: boolean = false
): string {
  const day = new Date(new Date(datestring).getTime());
  const yyyy = typeof datestring === 'string' || isLocale ? day.getFullYear() : day.getUTCFullYear();
  let mm: number | string = typeof datestring === 'string' || isLocale ? day.getMonth() + 1 : day.getUTCMonth() + 1;
  let dd: number | string = typeof datestring === 'string' || isLocale ? day.getDate() : day.getUTCDate();
  const _day = day.getDay() + 1;
  const hour = typeof datestring === 'string' || isLocale ? day.getHours() : day.getUTCHours();
  const minute = day.getUTCMinutes();
  const second = day.getUTCSeconds();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  let _return: string = '';

  if (yyyy < 1900) return '';

  switch (type) {
    case 'yyyy':
      _return = datestring ? `${yyyy}` : '';
      break;
    case 'mm/yyyy':
      _return = datestring ? `${mm}/${yyyy}` : '';
      break;
    case 'dd/mm/yyyy':
      _return = datestring ? `${dd}/${mm}/${yyyy}` : '';
      break;
    case 'vie:dd/mm/yyyy':
      _return = datestring ? `${dd} tháng ${mm}, ${yyyy}` : '';
      break;
    case 'yyyy//mm/dd':
      _return = datestring ? `${yyyy}/${mm}/${dd}` : '';
      break;
    case 'mm/dd/yyyy':
      _return = datestring ? `${mm}/${dd}/${yyyy}` : '';
      break;
    case 'hh:mm':
      _return = datestring ? `${hour}:${minute < 10 ? '0' + minute : minute}` : '';
      break;
    case 'dd/mm/yyyy hh:mm':
      _return = datestring
        ? `${dd}/${mm}/${yyyy} ${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}`
        : '';
      break;
    case 'hh:mm dd/mm/yyyy':
      _return = datestring
        ? `${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute} ${dd}/${mm}/${yyyy}`
        : '';
      break;
    case 'dd/mm':
      _return = datestring ? `${dd}/${mm}` : '';
      break;
    case 'vie:day, dd/mm': {
      const currentDay = new Date();
      const isCurrent =
        _day === currentDay.getDay() + 1 &&
        Number(dd) === currentDay.getDate() &&
        Number(mm) === currentDay.getMonth() + 1;
      const _firstText = isCurrent ? 'Hôm nay, ' : '';
      const textDay = _firstText + (_day === 7 ? 'Chủ nhật' : 'Thứ ' + (_day + 1));
      _return = datestring ? `${textDay}, ngày ${dd} tháng ${mm}` : '';
      break;
    }
    default:
      _return = datestring
        ? `${hour}:${minute}:${second} ${dd}/${mm}/${yyyy}`
        : '';
      break;
  }

  return _return;
}
