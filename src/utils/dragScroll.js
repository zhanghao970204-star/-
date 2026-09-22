export default {
  mounted(el) {
    let isDown = false
    let startX
    let scrollLeft

    const onMouseDown = (e) => {
      isDown = true
      el.style.cursor = 'grabbing'
      startX = e.pageX - el.offsetLeft
      scrollLeft = el.scrollLeft
    }

    const onMouseLeave = () => {
      isDown = false
      el.style.cursor = 'grab'
    }

    const onMouseUp = () => {
      isDown = false
      el.style.cursor = 'grab'
    }

    const onMouseMove = (e) => {
      if (!isDown) return
      e.preventDefault()
      const x = e.pageX - el.offsetLeft
      const walk = (x - startX) * 2
      el.scrollLeft = scrollLeft - walk
    }

    el.__dragScrollHandlers__ = {
      onMouseDown,
      onMouseLeave,
      onMouseUp,
      onMouseMove
    }

    el.addEventListener('mousedown', onMouseDown)
    el.addEventListener('mouseleave', onMouseLeave)
    el.addEventListener('mouseup', onMouseUp)
    el.addEventListener('mousemove', onMouseMove)
  },

  unmounted(el) {
    const handlers = el.__dragScrollHandlers__
    if (!handlers) return
    const { onMouseDown, onMouseLeave, onMouseUp, onMouseMove } = handlers

    el.removeEventListener('mousedown', onMouseDown)
    el.removeEventListener('mouseleave', onMouseLeave)
    el.removeEventListener('mouseup', onMouseUp)
    el.removeEventListener('mousemove', onMouseMove)

    delete el.__dragScrollHandlers__
  }
}
