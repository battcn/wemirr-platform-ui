/**
 * 状态
 */
export interface SubListState<T> {
  data: Array<T>;
  editing: boolean;
  isNew: boolean;
}
