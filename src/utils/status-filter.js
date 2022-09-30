const StatusFilter = (status) => {
  const statusMap = {
    0: 'primary',
    1: 'danger',
    2: 'warning',
    3: 'success',
    4: 'info'
  }
  return statusMap[status]
}

export { StatusFilter }
