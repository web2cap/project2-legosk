import fetch from 'isomorphic-fetch';
export default () => {
  const service = {};
  service.getByToken = async function (token) {
    const res = await fetch(`/api/v1/passport?p=${token}`);
    const json = await res.json();
    console.log(json);
    return json;
  };
  return service;
};
