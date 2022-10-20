const validateUsername = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入用户名'))
  } else {
    callback()
  }
}

const validatePassword = (rule, value, callback) => {
  if (value.length < 6) {
    callback(new Error('请输入6位数的密码'))
  } else {
    callback()
  }
}

const validateQq = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入QQ'))
  } else {
    callback()
  }
}

const validatePhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入6位数的密码'))
  } else {
    callback()
  }
}

export {
  validateUsername,
  validatePassword,
  validateQq,
  validatePhone
}
