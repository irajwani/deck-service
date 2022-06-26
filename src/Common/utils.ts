import * as _ from 'lodash';

export const hasDuplicates = (arr) => {
  return _.uniq(arr).length !== arr.length;
};
