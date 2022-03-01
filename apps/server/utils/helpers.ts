// Replaces null keys in an object with undefined
export const removeNull: (obj: any) => any = (obj: any) => {
  const keys = Object.keys(obj);

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];

    if (obj[key] === null) {
      obj[key] = undefined;
    } else if (typeof obj[key] === 'object') {
      removeNull(obj[key]);
    }
  }
};
