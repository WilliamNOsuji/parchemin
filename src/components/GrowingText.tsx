import { useLayoutEffect, useRef, type TextareaHTMLAttributes } from 'react'

/**
 * A value that reads as text under its label and never clips: a textarea that grows to fit what is in it,
 * quiet until the pointer or the caret is on it. For chapter plans, voice lines and summaries.
 */
export function GrowingText({ className = '', onInput, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const width = useRef(0)
  const fit = () => {
    const el = ref.current
    if (!el) return
    el.style.height = '0'
    el.style.height = `${el.scrollHeight + 2}px`
  }
  useLayoutEffect(() => {
    fit()
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return
    // a sidebar that changes width re-wraps the text, so the height follows the width
    const ro = new ResizeObserver(() => {
      if (el.clientWidth !== width.current) {
        width.current = el.clientWidth
        fit()
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [props.value, props.defaultValue])
  return (
    <textarea
      ref={ref}
      rows={1}
      className={`quiet ${className}`.trim()}
      {...props}
      onInput={(e) => {
        fit()
        onInput?.(e)
      }}
    />
  )
}
