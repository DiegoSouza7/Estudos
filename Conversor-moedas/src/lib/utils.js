module.exports = {
  FormatDate(date) {
    const year = date.getFullYear()
    const month = `0${date.getMonth() + 1}`.slice(-2)
    const day = `0${date.getDate()}`.slice(-2)

    return `${month}-${day}-${year}`
  },
  FormatOrderDate(date) {
    const day = date.split('-')[2]
    const month = date.split('-')[1]
    const year = date.split('-')[0]

    return `${month}-${day}-${year}`
  }
}