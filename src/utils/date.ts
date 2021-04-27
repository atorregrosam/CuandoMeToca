/**
 * Transforms a `string` to `Date` object.
 *
 * @param {string} d Valid formats: `YYYYMMDD`, `YYYYMMDDhhmm` or `YYYYMMDDhhmmss`
 * @returns {Date}
 */
function toDate(d: string): Date {
  if(!d) {
    return null;
  }

  const ymd = `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
  let hms = '00:00:00';

  if(d.length > 8) {
    if(d.length === 12) {
      hms = `${d.slice(8, 10)}:${d.slice(10, 12)}:00`;
    } else if(d.length === 14) {
      hms = `${d.slice(8, 10)}:${d.slice(10, 12)}:${d.slice(12, 14)}`;
    }
  }

  return new Date(`${ymd}T${hms}Z`);
}


export {
  toDate,
};
