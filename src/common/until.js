//生成指定长度的唯一ID
export function GenNonDuplicateID(randomLength) {
  return Number(
    Math.random()
      .toString()
      .substr(3, randomLength) + Date.now()
  ).toString(36)
}
export function debounce(func, wait) {
  let timeout
  return function() {
    const context = this
    const args = [...arguments]
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(context, args)
    }, wait)
  }
}
export function throttle(fn, timeout) {
  let canRun = true
  return function() {
    if (!canRun) {
      return
    }
    canRun = false
    fn.call(this, arguments)
    setTimeout(() => {
      canRun = true
    }, timeout)
  }
}
