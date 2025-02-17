// Mobile device detection
export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

// Touch event handlers with improved performance
export const addTouchHandlers = (element: HTMLElement, handlers: {
  onTap?: () => void
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down') => void
}) => {
  let startX = 0
  let startY = 0
  let startTime = 0
  const SWIPE_THRESHOLD = 50
  const TAP_THRESHOLD = 200

  const handleTouchStart = (e: TouchEvent) => {
    startX = e.touches[0].clientX
    startY = e.touches[0].clientY
    startTime = Date.now()
  }

  const handleTouchEnd = (e: TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - startX
    const deltaY = e.changedTouches[0].clientY - startY
    const deltaTime = Date.now() - startTime

    // Detect tap
    if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < TAP_THRESHOLD) {
      handlers.onTap?.()
      return
    }

    // Detect swipe
    if (handlers.onSwipe && (Math.abs(deltaX) > SWIPE_THRESHOLD || Math.abs(deltaY) > SWIPE_THRESHOLD)) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        handlers.onSwipe(deltaX > 0 ? 'right' : 'left')
      } else {
        handlers.onSwipe(deltaY > 0 ? 'down' : 'up')
      }
    }
  }

  element.addEventListener('touchstart', handleTouchStart, { passive: true })
  element.addEventListener('touchend', handleTouchEnd, { passive: true })

  return () => {
    element.removeEventListener('touchstart', handleTouchStart)
    element.removeEventListener('touchend', handleTouchEnd)
  }
}

// Lazy loading utilities
export const lazyLoadImage = (
  imageElement: HTMLImageElement,
  src: string,
  onLoad?: () => void
) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        imageElement.src = src
        if (onLoad) {
          imageElement.onload = onLoad
        }
        observer.disconnect()
      }
    })
  }, {
    rootMargin: '50px'
  })

  observer.observe(imageElement)
  return () => observer.disconnect()
}

// Performance optimization for scroll events
export const optimizedScroll = (callback: () => void, wait = 100) => {
  let timeout: NodeJS.Timeout
  let lastKnownScrollPosition = 0
  let ticking = false

  const handleScroll = () => {
    lastKnownScrollPosition = window.scrollY

    if (!ticking) {
      window.requestAnimationFrame(() => {
        callback()
        ticking = false
      })

      ticking = true
    }
  }

  return () => {
    clearTimeout(timeout)
    timeout = setTimeout(handleScroll, wait)
  }
}

// Touch feedback
export const addTouchFeedback = (element: HTMLElement) => {
  const handleTouchStart = () => {
    element.style.opacity = '0.7'
  }

  const handleTouchEnd = () => {
    element.style.opacity = '1'
  }

  element.addEventListener('touchstart', handleTouchStart, { passive: true })
  element.addEventListener('touchend', handleTouchEnd, { passive: true })
  element.addEventListener('touchcancel', handleTouchEnd, { passive: true })

  return () => {
    element.removeEventListener('touchstart', handleTouchStart)
    element.removeEventListener('touchend', handleTouchEnd)
    element.removeEventListener('touchcancel', handleTouchEnd)
  }
} 