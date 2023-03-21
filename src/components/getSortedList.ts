export const getSortedList = <T>(list: T[], key: keyof T) => {
  const tempList = [...list];

  tempList.sort((a, b) => {
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
    return 0;
  });

  return tempList;
};
