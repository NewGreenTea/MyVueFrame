//非空字符串
export function notNull(rule, value, callback) {
  if (!value) {
    return callback(new Error('输入不可以为空'));
  }
  setTimeout(() => {
    if (!value) {
      callback(new Error('输入不可以为空'));
    }else{
      callback();
    }
  }, 0);
}
// 验证是否整数
export function isInteger(rule, value, callback) {
  if (!value) {
    return callback(new Error('输入不可以为空'));
  }
  setTimeout(() => {
    if (!Number(value)) {
      callback(new Error('请输入正整数'));
    } else {
      const re = /^[0-9]*[0-9][0-9]*$/;
      const rsCheck = re.test(value);
      if (!rsCheck) {
        callback(new Error('请输入正整数'));
      } else {
        callback();
      }
    }
  }, 0);
}

// 验证是否小于4位的整数
export function isFourInteger(rule, value, callback) {
  if (!value) {
    return callback(new Error('输入不可以为空'));
  }
  setTimeout(() => {
    if (!Number(value)) {
      callback(new Error('请输入正整数'));
    } else {
      const re = /^[0-9][0-9]{0,3}$/;
      const rsCheck = re.test(value);
      if (!rsCheck){
        callback(new Error('正确输入4位正整数'));
      }else{
          callback();
      }
    }
  }, 0);
}

// 验证是否小于4位的整数非必要
export function isFourIntegerNotMust(rule, value, callback) {
  if (!value) {
    return callback();
  }
  setTimeout(() => {
    if (!Number(value)) {
      callback(new Error('请输入正整数'));
    } else {
      const re = /^[0-9][0-9]{0,3}$/;
      const rsCheck = re.test(value);
      if (!rsCheck){
        callback(new Error('正确输入4位正整数'));
      }else{
        callback();
      }
    }
  }, 0);
}

export function isNum(rule, value, callback) {
  const reg =/^[_0-9]+-+[_0-9]|[_0-9]+$/;
  if(value==''||value==undefined||value==null){
    callback(new Error('输入不可以为空'));
  } else {
    if (!reg.test(value)){
      callback(new Error('仅由数字以及连接号“-”组成'));
    } else {
      callback();
    }
  }
}

/*验证内容是否英文数字以及下划线*/
export function isPassword(rule, value, callback) {
  const reg =/^[_a-zA-Z0-9]+$/;
  if(value==''||value==undefined||value==null){
    callback();
  } else {
    if (!reg.test(value)){
      callback(new Error('仅由英文字母，数字以及下划线组成'));
    } else {
      callback();
    }
  }
}
// 验证是否整数,非必填
export function isIntegerNotMust(rule, value, callback) {
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (!Number(value)) {
      callback(new Error('请输入数字'));
    } else {
      const re = /^[0-9]*[1-9][0-9]*$/;
      const rsCheck = re.test(value);
      if (!rsCheck) {
        callback(new Error('请输入数字'));
      } else {
        callback();
      }
    }
  }, 1000);
}

// 验证是否是保留两位小数的数字
export function isDecimalNotMust(rule, value, callback) {
  if (!value) {
    callback();
  }
  setTimeout(() => {
    if (!Number(value)) {
      callback(new Error('请输入数字'));
    } else {
      //const re = /^(([1-9]{1}\d*)|(0{1}))(\.\d{2})$/;
      const re =/^(([^0][0-9]+|0)\.([0-9]{1,2})$)|^(([^0][0-9]+|0)$)|^(([1-9]+)\.([0-9]{1,2})$)|^(([1-9]+)$)/;
      const rsCheck = re.test(value);
      if (!rsCheck) {
        callback(new Error('最多保留两位小数'));
      } else {
        callback();
      }
    }
  }, 1000);
}

/* 是否手机号码*/
export function validatePhone(rule, value,callback) {
  const reg =/^[1][3,4,5,7,8][0-9]{9}$/;
  if(value==''||value==undefined||value==null){
    callback();
  }else {
    if ((!reg.test(value)) && value != '') {
      callback(new Error('请输入正确的电话号码'));
    } else {
      callback();
    }
  }
}
/* 是否身份证号码*/
export function validateIdNo(rule, value,callback) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if(value==''||value==undefined||value==null){
    callback();
  }else {
    if ((!reg.test(value)) && value != '') {
      callback(new Error('请输入正确的身份证号码'));
    } else {
      callback();
    }
  }
}
/* 是否邮箱*/
export function validateEMail(rule, value,callback) {
  const reg =/^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/;
  if(value==''||value==undefined||value==null){
    callback();
  }else{
    if (!reg.test(value)){
      callback(new Error('请输入正确的邮箱地址'));
    } else {
      callback();
    }
  }
}
