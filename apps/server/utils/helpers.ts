// Replaces null keys in an object with undefined
export const removeNull: (obj: any) => any = (obj: any) => {
  for (let key in obj) {
    if (obj[key] == null) {
      obj[key] = undefined;
    } else if (typeof obj[key] == 'object') {
      removeNull(obj);
    }
  }
};
