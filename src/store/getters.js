const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  // userId: state => state.user.userId,
  userNname: state => state.user.userNname,
  permission: state => state.user.permission,
  isAdmin: state => state.user.isAdmin
}
export default getters
