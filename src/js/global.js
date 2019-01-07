let CommonFunction = {
  //js判断是否为空
  isEmpty(data) {
    let result = false;
    if (Object.keys(data).length === 0 || data === null || data === undefined || /^\s*$/.test(data)) {
      result = true
    }
    return result;
  },

  dateFormate(date) {
    let datadate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() +
      ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    return datadate
  },

  dataIsNull(data) {
    let str = '';
    for (let key in data) {
      if (data[key] === null) {
        data[key] = ''
      }
      str += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&';
    }
    return str;
  }
};

//向后台传输档案对象时，请求头需要的配置
const ArchRequestConfig={
  headers: {'Content-Type': 'application/json'}
};

export {CommonFunction,ArchRequestConfig}
