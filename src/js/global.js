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
    let datadate;
    if (date.getTime() !== new Date('Thu Jan 01 1970 08:00:00 GMT+0800').getTime()) {
      datadate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    } else {
      datadate = '';
    }
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
const ArchRequestConfig = {
  headers: {'Content-Type': 'application/json'}
};

//档案状态转换对象
let ArchStatueChange = {
  //档案二级状态码转换状态名
  statueTwoDes(statue) {
    let statueName;
    if (statue === 0) {
      statueName = '待分配'
    } else if (statue === 1) {
      statueName = '已分配（待著录）'
    } else if (statue === 2) {
      statueName = '著录中'
    } else if (statue === 3) {
      statueName = '已著录（待质检）'
    } else if (statue === 4) {
      statueName = '质检中'
    } else if (statue === 5) {
      statueName = '质检通过（待上传）'
    } else if (statue === 6) {
      statueName = '质检不通过'
    } else if (statue === 7) {
      statueName = '上传中'
    } else if (statue === 8) {
      statueName = '已上传（组卷中）'
    } else if (statue === 9) {
      statueName = '组卷完成'
    }
    return statueName
  },
  //低级一点的档案二级状态码转换状态名
  //著录人员查看
  lowerStatueTwoDes(statue) {
    let statueName;
    if (statue === 0) {
      statueName = '待分配'
    } else if (statue === 1) {
      statueName = '待著录'
    } else if (statue === 2) {
      statueName = '著录中'
    } else if (statue === 3) {
      statueName = '已著录，等待著录质检'
    } else if (statue === 4) {
      statueName = '已著录质检，等待扫描质检'
    } else if (statue === 5) {
      statueName = '待上传'
    } else if (statue === 6) {
      statueName = '质检不通过'
    } else if (statue === 7) {
      statueName = '上传中'
    } else if (statue === 8) {
      statueName = '已上传，组卷中'
    } else if (statue === 9) {
      statueName = '组卷完成'
    }
    return statueName
  },

  //档案二级状态转换对应后台
  statueTwoCode(statue) {
    let statueName;
    if (statue === '待分配') {
      statueName = 0
    } else if (statue === '已分配（待著录）') {
      statueName = 1
    } else if (statue === '著录中') {
      statueName = 2
    } else if (statue === '已著录（待质检）') {
      statueName = 3
    } else if (statue === '质检中') {
      statueName = 4
    } else if (statue === '质检通过（待上传）') {
      statueName = 5
    } else if (statue === '质检不通过') {
      statueName = 6
    } else if (statue === '上传中') {
      statueName = 7
    } else if (statue === '已上传（组卷中）') {
      statueName = 8
    } else if (statue === '组卷完成') {
      statueName = 9
    }
    return statueName
  }
};

export {CommonFunction, ArchRequestConfig, ArchStatueChange}
