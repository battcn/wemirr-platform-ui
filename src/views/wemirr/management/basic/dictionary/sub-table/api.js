import { request } from '/src/api/service';

export function GetItemList(query) {
  console.log('query', query);
  return request({
    url: `/authority/dictionaries/${
      query === undefined || query.id === undefined ? 0 : query.id
    }/items`,
    method: 'get',
    params: query,
  });
}

export function AddItemObj(dictionaryId, obj) {
  return request({
    url: `/authority/dictionaries/${dictionaryId}/items`,
    method: 'post',
    data: obj,
  });
}

export function UpdateItemObj(dictionaryId, obj) {
  return request({
    url: `/authority/dictionaries/${dictionaryId}/items/${obj.id}`,
    method: 'put',
    data: obj,
  });
}
export function DelItemObj(dictionaryId, dictionaryItemId) {
  return request({
    url: `/authority/dictionaries/${dictionaryId}/items/${dictionaryItemId}`,
    method: 'delete',
  });
}
