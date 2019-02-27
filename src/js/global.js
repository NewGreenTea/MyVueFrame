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
    } else if (statue === '全部') {
      statueName = ''
    }
    return statueName
  }
};

//系统设置
let SystemFunction = {
  //选择系统，设置区号
  systemObject() {
    return [
      {
        systemName: '广州市国土资源和规划委员会',
        systemCode: '无'
      },
      {
        systemName: '广州市越秀区国土资源和规划局',
        systemCode: '01'
      },
      {
        systemName: '广州市海珠区国土资源和规划局',
        systemCode: '02'
      },
      {
        systemName: '广州市荔湾区国土资源和规划局',
        systemCode: '03'
      },
      {
        systemName: '广州市天河区国土资源和规划局',
        systemCode: '04'
      },
      {
        systemName: '广州市白云区国土资源和规划局',
        systemCode: '05'
      },
      {
        systemName: '广州市黄埔区国土资源和规划局',
        systemCode: '06'
      },
      {
        systemName: '广州市花都区国土资源和规划局',
        systemCode: '07'
      },
      {
        systemName: '广州市番禺区国土资源和规划局',
        systemCode: '08'
      },
      {
        systemName: '广州市南沙区国土资源和规划局',
        systemCode: '09'
      },
      {
        systemName: '广州市萝岗区国土资源和规划局',
        systemCode: '10'
      }]
  },

  //根据区号获取区名
  getSystemDistrict(code) {
    let district;
    if (code === '无') {
      district = ''
    } else if (code === '01') {
      district = '越秀区'
    } else if (code === '02') {
      district = '海珠区'
    } else if (code === '03') {
      district = '荔湾区'
    } else if (code === '04') {
      district = '天河区'
    } else if (code === '05') {
      district = '白云区'
    } else if (code === '06') {
      district = '黄埔区'
    } else if (code === '07') {
      district = '花都区'
    } else if (code === '08') {
      district = '番禺区'
    } else if (code === '09') {
      district = '南沙区'
    }else if (code === '10') {
      district = '萝岗区'
    }
    return district;
  },

  //获取本地中的系统代码
  getSystemCode() {
    return window.localStorage.getItem('systemCode');
  }
};

//三大档案信息的档号处理对象
let archNoType = {
  // 把C6.1-XXXXXXX变成C61，跳转到相应的著录专业信息界面有用
  writeVueLayout(type) {
    let index = type.indexOf("-");
    let archType = type.substring(0, index).replace('\.', '');
    return archType
  },

  // 把C6.1-XXXXXXX变成C6.1，跳转到相应的著录专业信息界面有用
  writeVueLayout2(type) {
    let index = type.indexOf("-");
    let archType = type.substring(0, index);
    return archType
  },

  //著录或著录质检档号区间搜索条件
  changeArchNoCondition(data){
    let result=true;
    if(data.indexOf(':')>1 || data.indexOf('：')>1){
      data=data.replace('：',':');
      let str=data.split(':');
      if(this.writeVueLayout2(str[0])!==this.writeVueLayout2(str[1])){
        result=false;
      }
    }
    return result;
  }
};

export {CommonFunction, ArchRequestConfig, ArchStatueChange, SystemFunction, archNoType}
