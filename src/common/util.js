const debounce = (func, wait) => {
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
const throttle = (fn, timeout) => {
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
