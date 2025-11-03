// Prevent double-loading in static exports
try {
  if (typeof window !== 'undefined') {
    if (window.__UV_RUNTIME_LOADED__) {
      /* already loaded */
    } else {
      window.__UV_RUNTIME_LOADED__ = true
    }
  }
} catch (e) {}
// Initialize sidebar hover behavior for collapsed state
function initSidebarHover() {
  const sidebar = document.querySelector('.sidebar-wrapper')
  const body = document.body

  if (!sidebar) return

  function handleSidebarHover() {
    if (body.classList.contains('toggled')) {
      sidebar.addEventListener('mouseenter', function () {
        body.classList.add('sidebar-hovered')
      })

      sidebar.addEventListener('mouseleave', function () {
        body.classList.remove('sidebar-hovered')
      })
    }
  }

  handleSidebarHover()

  const toggleButton = document.querySelector('.btn-toggle')
  if (toggleButton) {
    toggleButton.addEventListener('click', function () {
      setTimeout(handleSidebarHover, 300)
    })
  }
}

// Mark Material Icons as loaded and observe dynamic additions
function markIconsAsLoaded() {
  document
    .querySelectorAll('.material-symbols-rounded, .material-icons')
    .forEach(function (icon) {
      icon.classList.add('material-symbols-rounded--loaded')
      icon.style.color = ''
    })
}

function initIconLoading() {
  if ('fonts' in document) {
    document.fonts.ready.then(function () {
      markIconsAsLoaded()
    })
  } else {
    setTimeout(markIconsAsLoaded, 100)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', markIconsAsLoaded)
  } else {
    markIconsAsLoaded()
  }

  const iconObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeType === 1) {
          if (
            node.classList &&
            (node.classList.contains('material-symbols-rounded') ||
              node.classList.contains('material-icons'))
          ) {
            node.classList.add('material-symbols-rounded--loaded')
          }
          if (node.querySelectorAll) {
            node
              .querySelectorAll('.material-symbols-rounded, .material-icons')
              .forEach(function (icon) {
                icon.classList.add('material-symbols-rounded--loaded')
              })
          }
        }
      })
    })
  })

  iconObserver.observe(document.body, { childList: true, subtree: true })
}

// Prism theme switching for code highlighting
function loadPrismTheme(theme) {
  const isDark = theme === 'dark'
  const themeName = isDark ? 'hui-prism.min.css' : 'hui-prism-light.min.css'

  // Get the Prism theme link element
  let link = document.getElementById('prism-theme-link')

  if (link) {
    // Get the directory from the current href and replace just the filename
    const currentHref = link.href
    const baseUrl = currentHref.substring(0, currentHref.lastIndexOf('/') + 1)
    link.href = baseUrl + themeName

    // Re-highlight all code blocks after theme loads
    link.onload = function () {
      if (typeof Prism !== 'undefined' && Prism.highlightAll) {
        Prism.highlightAll()
      }
    }
  }
}

// Make loadPrismTheme available globally for theme switching
window.loadPrismTheme = loadPrismTheme

// Listen for theme changes to update Prism theme
window.addEventListener('themeChanged', function (event) {
  if (event.detail && event.detail.theme) {
    loadPrismTheme(event.detail.theme)
  }
})

// Load initial Prism theme based on current theme
function loadInitialPrismTheme() {
  const currentTheme =
    document.documentElement.getAttribute('data-bs-theme') || 'dark'
  loadPrismTheme(currentTheme)
}

// Load initial theme when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadInitialPrismTheme)
} else {
  loadInitialPrismTheme()
}

// Dark/Light Mode Toggle for Static Exports
function setupThemeToggle() {
  const darkModeToggle = document.getElementById('admin-dark-mode-switch')

  if (!darkModeToggle) {
    console.log(
      'Theme toggle not found - theme system still active for manual switching'
    )
    return
  }

  // Get current theme
  const currentTheme =
    document.documentElement.getAttribute('data-bs-theme') || 'dark'
  const isDark = currentTheme === 'dark'

  // Set initial toggle state
  darkModeToggle.checked = isDark

  // Listen for toggle changes
  darkModeToggle.addEventListener('change', function (e) {
    applyTheme(e.target.checked)
  })

  // Listen for system theme changes
  if (window.matchMedia) {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', function (e) {
        // Only auto-switch if user hasn't set a preference
        if (!localStorage.getItem('theme-preference')) {
          const isDark = e.matches
          darkModeToggle.checked = isDark
          applyTheme(isDark)
        }
      })
  }
}

function applyTheme(isDark) {
  const theme = isDark ? 'dark' : 'light'
  const htmlEl = document.documentElement

  // Add transition class for smooth animation
  htmlEl.classList.add('theme-transitioning')

  // Set theme attribute
  htmlEl.setAttribute('data-bs-theme', theme)

  // Save preference
  localStorage.setItem('theme-preference', theme)

  // Load appropriate Prism theme
  loadPrismTheme(theme)

  // Log the change
  console.log(`Theme switched to: ${theme}`)

  // Remove transition class after animation completes
  setTimeout(function () {
    htmlEl.classList.remove('theme-transitioning')
  }, 300)

  // Dispatch custom event for other scripts
  window.dispatchEvent(
    new CustomEvent('themeChanged', {
      detail: { theme: theme, isDark: isDark }
    })
  )
}

// Store menu preference from URL parameter to sessionStorage
function persistMenuPreferenceFromUrl() {
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.has('menu')) {
    const menuPref = urlParams.get('menu')
    if (menuPref) {
      try {
        sessionStorage.setItem('menu_type', menuPref)
      } catch (e) {}
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    // Demo: Top loading bar using BProgress for static exports
    try {
      // Avoid double-start if the inline CDN snippet already started it
      if (window.__BPROGRESS_PAGE_STARTED__)
        throw new Error('BProgress already started')

      // Use the same pattern that works in the progress page
      let BProgressAPI = null

      if (window.BProgressJS) {
        if (window.BProgressJS.BProgress) {
          BProgressAPI = window.BProgressJS.BProgress
        } else if (typeof window.BProgressJS === 'function') {
          BProgressAPI = window.BProgressJS
        } else if (window.BProgressJS.default) {
          BProgressAPI = window.BProgressJS.default
        }
      } else if (window.BProgress && typeof window.BProgress === 'function') {
        BProgressAPI = window.BProgress
      }

      if (BProgressAPI) {
        // Prefer singleton static API if available
        if (typeof BProgressAPI.start === 'function') {
          const API = BProgressAPI
          API.start()
          let value = 0
          const tick = () => {
            value = Math.min(95, value + Math.random() * 15 + 5)
            if (typeof API.set === 'function') API.set(value)
            if (value < 95) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          window.addEventListener('load', () => {
            setTimeout(() => {
              if (typeof API.finish === 'function') {
                API.finish()
              } else if (typeof API.complete === 'function') {
                API.complete()
              } else if (typeof API.hide === 'function') {
                API.hide()
              }
            }, 250)
          })
        } else {
          // Try different instantiation patterns (same as progress page)
          let progress = null

          try {
            progress = new BProgressAPI({
              position: 'top',
              height: 3,
              color: '#0d6efd'
            })
          } catch (e) {
            try {
              progress = new BProgressAPI()
            } catch (e2) {
              try {
                progress = BProgressAPI({
                  position: 'top',
                  height: 3,
                  color: '#0d6efd'
                })
              } catch (e3) {
                progress = BProgressAPI()
              }
            }
          }

          // Try singleton pattern
          if (
            !progress &&
            (typeof BProgressAPI.start === 'function' ||
              typeof BProgressAPI.show === 'function')
          ) {
            progress = BProgressAPI
          }

          if (progress) {
            // Try to start the progress bar (with fallback method names)
            const startMethod =
              progress.start || progress.show || progress.begin
            const setMethod =
              progress.set || progress.setValue || progress.progress
            const finishMethod =
              progress.finish ||
              progress.complete ||
              progress.hide ||
              progress.end

            if (startMethod && typeof startMethod === 'function') {
              startMethod.call(progress)
              let value = 0
              const tick = () => {
                value = Math.min(95, value + Math.random() * 15 + 5)
                if (setMethod && typeof setMethod === 'function') {
                  setMethod.call(progress, value)
                }
                if (value < 95) requestAnimationFrame(tick)
              }
              requestAnimationFrame(tick)
              window.addEventListener('load', () => {
                setTimeout(() => {
                  // Try multiple finish methods (same as hideProgress)
                  if (
                    progress.finish &&
                    typeof progress.finish === 'function'
                  ) {
                    progress.finish()
                  } else if (
                    progress.complete &&
                    typeof progress.complete === 'function'
                  ) {
                    progress.complete()
                  } else if (
                    progress.hide &&
                    typeof progress.hide === 'function'
                  ) {
                    progress.hide()
                  } else if (
                    progress.set &&
                    typeof progress.set === 'function'
                  ) {
                    // Set to 100% and let it auto-hide
                    progress.set(100)
                    setTimeout(() => {
                      const progressElement =
                        document.querySelector('[data-bprogress]') ||
                        document.querySelector('.bprogress') ||
                        document.querySelector('#bprogress')
                      if (progressElement && progressElement.parentNode) {
                        progressElement.parentNode.removeChild(progressElement)
                      }
                    }, 500)
                  } else {
                    // Last resort: remove DOM element
                    const progressElement =
                      document.querySelector('[data-bprogress]') ||
                      document.querySelector('.bprogress') ||
                      document.querySelector('#bprogress') ||
                      document.querySelector(
                        '[class*="progress"][class*="top"]'
                      )
                    if (progressElement && progressElement.parentNode) {
                      progressElement.style.display = 'none'
                      setTimeout(
                        () =>
                          progressElement.parentNode.removeChild(
                            progressElement
                          ),
                        300
                      )
                    }
                  }
                }, 250)
              })
            }
          }
        }
      }
    } catch (e) {
      // BProgress not available - ignore
    }
    persistMenuPreferenceFromUrl()
    setupThemeToggle()
    initSidebarHover()
    initIconLoading()
    initDashboardChartsIfPresent()
    applyFixedHeaderPreference()
    initHeadroomFallback()
    initHorizontalHeadroomFallback()
    initFixedHeaderToggleBindings()
  })
} else {
  persistMenuPreferenceFromUrl()
  setupThemeToggle()
  initSidebarHover()
  initIconLoading()
  initDashboardChartsIfPresent()
  applyFixedHeaderPreference()
  initHeadroomFallback()
  initHorizontalHeadroomFallback()
  initFixedHeaderToggleBindings()
}

// Initialize charts/search widgets if present on the page (works for live and static)
function initDashboardChartsIfPresent() {
  if (typeof window !== 'undefined' && window.ApexCharts) {
    // Only initialize if at least one chart container exists
    const cpuEl = document.querySelector('#cpu-chart')
    const memEl = document.querySelector('#mem-chart')
    const netEl = document.querySelector('#net-chart')
    const errEl = document.querySelector('#err-chart')

    if (cpuEl || memEl || netEl || errEl) {
      function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
      }

      const cpuOptions = {
        chart: { type: 'radialBar', height: '100%' },
        series: [randomInt(60, 90)],
        colors: ['#0d6efd'],
        plotOptions: {
          radialBar: {
            hollow: { size: '60%' },
            dataLabels: {
              name: {
                show: true,
                offsetY: -10,
                color: '#adb5bd',
                fontSize: '1rem'
              },
              value: {
                show: true,
                offsetY: 5,
                color: '#f8f9fa',
                fontSize: '1.5rem',
                formatter: (val) => val + '%'
              }
            }
          }
        },
        labels: ['CPU'],
        stroke: { lineCap: 'round' }
      }

      const memOptions = {
        chart: { type: 'radialBar', height: '100%' },
        series: [randomInt(40, 70)],
        colors: ['#198754'],
        plotOptions: {
          radialBar: {
            hollow: { size: '60%' },
            dataLabels: {
              name: {
                show: true,
                offsetY: -10,
                color: '#adb5bd',
                fontSize: '1rem'
              },
              value: {
                show: true,
                offsetY: 5,
                color: '#f8f9fa',
                fontSize: '1.5rem',
                formatter: (val) => val + '%'
              }
            }
          }
        },
        labels: ['Memory'],
        stroke: { lineCap: 'round' }
      }

      let networkData = Array.from({ length: 10 }, () => randomInt(10, 100))
      let errorData = Array.from({ length: 10 }, () => randomInt(0, 5))
      let categories = Array.from({ length: 10 }, (_, i) => i + 1)

      const lineChartOptions = {
        chart: {
          type: 'area',
          height: '100%',
          parentHeightOffset: 0,
          sparkline: { enabled: true },
          animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: { speed: 1000 }
          }
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2 },
        xaxis: {
          categories,
          labels: { show: false },
          axisBorder: { show: false },
          axisTicks: { show: false }
        },
        yaxis: { show: false },
        grid: {
          show: false,
          padding: { top: 18, right: 0, bottom: 0, left: 0 }
        },
        tooltip: { enabled: false }
      }

      const netOptions = {
        ...lineChartOptions,
        series: [{ name: 'Network', data: networkData.slice() }],
        colors: ['#0dcaf0'],
        fill: {
          type: 'gradient',
          gradient: { opacityFrom: 0.6, opacityTo: 0.1 }
        },
        title: {
          text: 'Network (Mbps)',
          align: 'center',
          offsetY: 4,
          style: { fontSize: '1rem' }
        }
      }

      const errOptions = {
        ...lineChartOptions,
        chart: { ...lineChartOptions.chart, type: 'line' },
        series: [{ name: 'Errors', data: errorData.slice() }],
        colors: ['#dc3545'],
        fill: { type: 'solid' },
        title: {
          text: 'Errors (per min)',
          align: 'center',
          offsetY: 4,
          style: { fontSize: '1rem' }
        }
      }

      const charts = []
      if (cpuEl) charts.push(new window.ApexCharts(cpuEl, cpuOptions))
      if (memEl) charts.push(new window.ApexCharts(memEl, memOptions))
      if (netEl) charts.push(new window.ApexCharts(netEl, netOptions))
      if (errEl) charts.push(new window.ApexCharts(errEl, errOptions))

      charts.forEach((c) => c.render())

      if (netEl || errEl) {
        setInterval(() => {
          if (cpuEl) charts[0]?.updateSeries([randomInt(60, 90)])
          if (memEl) charts[cpuEl ? 1 : 0]?.updateSeries([randomInt(40, 70)])

          networkData.shift()
          networkData.push(randomInt(10, 100))
          errorData.shift()
          errorData.push(randomInt(0, 5))

          if (netEl) {
            const idx = (cpuEl ? 1 : 0) + (memEl ? 1 : 0)
            charts[idx]?.updateSeries([{ data: networkData.slice() }])
          }
          if (errEl) {
            const idx = (cpuEl ? 1 : 0) + (memEl ? 1 : 0) + (netEl ? 1 : 0)
            charts[idx]?.updateSeries([{ data: errorData.slice() }])
          }
        }, 2000)
      }
    }
  }
}

// Apply fixed header mode for horizontal layout based on URL param or localStorage
function applyFixedHeaderPreference() {
  try {
    const params = new URLSearchParams(window.location.search)
    const fixed = params.get('fixed_header')
    let pref = null
    if (fixed !== null) {
      // URL takes precedence and persists
      pref = fixed.toString().toLowerCase() === 'true'
      try {
        localStorage.setItem('uv-fixed-header', pref ? 'true' : 'false')
      } catch (e) {}
    } else {
      // read from localStorage
      try {
        const ls = localStorage.getItem('uv-fixed-header')
        if (ls === 'true') pref = true
        if (ls === 'false') pref = false
      } catch (e) {}
    }

    const header = document.querySelector('.ultraviolet-action-bar')
    if (pref === true) {
      if (header) header.classList.add('fixed-to-top')
      document.body.classList.add('fixed-top-header')
      // mark toggle nav-link(s) as active
      document
        .querySelectorAll('[data-uv-toggle-fixed-header]')
        .forEach(function (el) {
          el.classList.add('active')
          el.classList.add('uv-fixed-active')
        })
    } else if (pref === false) {
      if (header) header.classList.remove('fixed-to-top')
      document.body.classList.remove('fixed-top-header')
      // remove active state from toggles
      document
        .querySelectorAll('[data-uv-toggle-fixed-header]')
        .forEach(function (el) {
          el.classList.remove('active')
          el.classList.remove('uv-fixed-active')
        })
    }
  } catch (e) {}
}

// Lightweight Headroom-style behavior for static exports (horizontal header)
function initHeadroomFallback() {
  const header = document.querySelector('.ultraviolet-action-bar')
  if (!header) return
  let lastY = window.scrollY || 0
  let ticking = false

  function onScroll() {
    const currentY = window.scrollY || 0
    const delta = currentY - lastY
    if (Math.abs(delta) > 4) {
      if (delta > 0) {
        // scrolling down
        header.classList.add('headroom--unpinned')
        header.classList.remove('headroom--pinned')
      } else {
        // scrolling up
        header.classList.add('headroom--pinned')
        header.classList.remove('headroom--unpinned')
      }
      lastY = currentY
    }
    ticking = false
  }

  window.addEventListener(
    'scroll',
    function () {
      if (!ticking) {
        window.requestAnimationFrame(onScroll)
        ticking = true
      }
    },
    { passive: true }
  )
}

// Headroom-style behavior for horizontal navbar in static exports
function initHorizontalHeadroomFallback() {
  if (!document.body.classList.contains('horizontal-menu')) return
  const navbar = document.querySelector('.hui-mega-menu')
  const header = document.querySelector('.ultraviolet-action-bar')
  if (!navbar || !header) return
  // Only when fixed header is enabled
  if (!header.classList.contains('fixed-to-top')) return

  navbar.classList.add('hui-navbar')

  let lastY = window.scrollY || 0
  let ticking = false

  function onScroll() {
    const currentY = window.scrollY || 0
    const delta = currentY - lastY
    if (Math.abs(delta) > 4) {
      if (delta > 0) {
        // scrolling down
        navbar.classList.add('hui-navbar--unpinned')
        navbar.classList.remove('hui-navbar--pinned')
      } else {
        // scrolling up
        navbar.classList.add('hui-navbar--pinned')
        navbar.classList.remove('hui-navbar--unpinned')
      }
      lastY = currentY
    }
    ticking = false
  }

  window.addEventListener(
    'scroll',
    function () {
      if (!ticking) {
        window.requestAnimationFrame(onScroll)
        ticking = true
      }
    },
    { passive: true }
  )
}

// Bind any toggle control to persist fixed header preference
function initFixedHeaderToggleBindings() {
  // Buttons/links can declare data attribute to toggle
  const toggles = document.querySelectorAll('[data-uv-toggle-fixed-header]')
  if (!toggles.length) return
  toggles.forEach(function (el) {
    el.addEventListener('click', function (e) {
      try {
        const current = localStorage.getItem('uv-fixed-header')
        const next = current === 'true' ? 'false' : 'true'
        localStorage.setItem('uv-fixed-header', next)
      } catch (e2) {}
      // apply immediately without reload
      applyFixedHeaderPreference()
      // also toggle visual active state instantly
      if (
        el.classList.contains('uv-fixed-active') ||
        el.classList.contains('active')
      ) {
        el.classList.remove('uv-fixed-active')
        el.classList.remove('active')
      } else {
        el.classList.add('uv-fixed-active')
        el.classList.add('active')
      }
      // prevent navigation if element is an anchor without intention
      if (el.tagName === 'A' && !el.hasAttribute('data-allow-nav')) {
        e.preventDefault()
      }
    })
  })
}

// Global toast helper for static pages (Bootstrap Toast based)
if (typeof window !== 'undefined' && typeof window.showToast !== 'function') {
  // Helper to get icon for toast type
  function getToastIcon(type) {
    var icons = {
      primary: 'notifications',
      success: 'check_circle',
      danger: 'error',
      warning: 'warning',
      info: 'info',
      dark: 'dark_mode',
      secondary: 'info',
      light: 'light_mode'
    }
    return icons[type] || 'notifications'
  }

  window.showToast = function (message, type, title) {
    try {
      var container = document.querySelector(
        '.toast-container.position-fixed.bottom-0.end-0.p-3'
      )
      if (!container) {
        container = document.createElement('div')
        container.className =
          'toast-container position-fixed bottom-0 end-0 p-3'
        document.body.appendChild(container)
      }

      var toast = document.createElement('div')
      var colorClass =
        typeof type === 'string' ? 'text-bg-' + type : 'text-bg-primary'
      toast.className = 'toast align-items-center border-0 ' + colorClass
      toast.setAttribute('role', 'alert')
      toast.setAttribute('aria-live', 'assertive')
      toast.setAttribute('aria-atomic', 'true')

      // Determine if we need dark close button (default to white for unknown types)
      var needsDarkClose =
        ['warning', 'info', 'light', 'secondary'].indexOf(type) !== -1
      var closeButtonClass = needsDarkClose
        ? 'btn-close'
        : 'btn-close btn-close-white'
      var iconClass = needsDarkClose ? 'text-dark' : 'text-white'

      var inner = document.createElement('div')
      inner.className = 'd-flex'

      var body = document.createElement('div')
      body.className = 'toast-body'
      body.textContent = message || ''

      var close = document.createElement('button')
      close.type = 'button'
      close.className = closeButtonClass
      close.setAttribute('data-bs-dismiss', 'toast')
      close.setAttribute('aria-label', 'Close')

      if (title) {
        // Optional header layout when title provided
        toast.innerHTML = ''
        var header = document.createElement('div')
        header.className =
          'toast-header text-bg-' + type + (needsDarkClose ? '' : ' text-white')
        var icon = document.createElement('i')
        icon.className = 'material-symbols-rounded me-2 ' + iconClass
        icon.textContent = getToastIcon(type)
        var strong = document.createElement('strong')
        strong.className = 'me-auto'
        strong.textContent = title
        var small = document.createElement('small')
        small.textContent = 'just now'
        var closeClone = close.cloneNode(true)
        header.appendChild(icon)
        header.appendChild(strong)
        header.appendChild(small)
        header.appendChild(closeClone)
        var bodyWrap = document.createElement('div')
        bodyWrap.className = 'toast-body'
        bodyWrap.textContent = message || ''
        toast.appendChild(header)
        toast.appendChild(bodyWrap)
      } else {
        inner.appendChild(body)
        inner.appendChild(close)
        toast.appendChild(inner)
      }

      container.appendChild(toast)
      if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
        var t = new bootstrap.Toast(toast, {
          animation: true,
          autohide: true,
          delay: 5000
        })
        toast.addEventListener('hidden.bs.toast', function () {
          try {
            toast.remove()
          } catch (e) {}
        })
        t.show()
      } else {
        // Fallback show/hide
        toast.style.display = 'block'
        setTimeout(function () {
          try {
            toast.remove()
          } catch (e) {}
        }, 5000)
      }
    } catch (e) {
      /* no-op */
    }
  }
}

// Initialize toast triggers for static export (data-toast-trigger support)
;(function () {
  if (typeof window === 'undefined') return

  function getDefaultToastMessage(type) {
    var messages = {
      primary:
        'This is a primary notification message. Just for demonstration!',
      success: 'Operation completed successfully! This is a demo toast.',
      danger: 'An error has occurred. This is just a demonstration toast.',
      warning: 'Warning! Please review this action. Demo toast only.',
      info: "Here's some helpful information. This is a demo toast.",
      dark: 'Dark themed notification. Demo purposes only.',
      secondary: 'Secondary notification. Demo purposes only.',
      light: 'Light themed notification. Demo purposes only.',
      stack:
        'Another toast added to the stack! Count: ' +
        (document.querySelectorAll('.toast').length + 1)
    }
    return messages[type] || 'Toast notification message.'
  }

  function getDefaultToastTitle(type) {
    var titles = {
      primary: 'Notification',
      success: 'Success',
      danger: 'Error',
      warning: 'Warning',
      info: 'Information',
      dark: 'Notice',
      secondary: 'Notice',
      light: 'Notice'
    }
    return titles[type] || 'Notification'
  }

  function initToastTriggers() {
    var toastTriggers = document.querySelectorAll('[data-toast-trigger]')

    toastTriggers.forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        // Only prevent default if this is a javascript: link or has no href
        var href = this.getAttribute('href')
        if (!href || href === '#' || href.startsWith('javascript:')) {
          e.preventDefault()
        }

        var triggerType = this.getAttribute('data-toast-trigger')
        // Allow separate color specification with data-toast-type, fallback to trigger type
        var type = this.getAttribute('data-toast-type') || triggerType
        var message =
          this.getAttribute('data-toast-message') ||
          getDefaultToastMessage(triggerType)
        var title =
          this.getAttribute('data-toast-title') ||
          getDefaultToastTitle(triggerType)

        if (typeof window.showToast === 'function') {
          window.showToast(message, type, title)
        }
      })
    })
  }

  // Initialize on DOM ready or immediately if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToastTriggers)
  } else {
    initToastTriggers()
  }
})()

// Static export fallbacks for tickers
;(function () {
  if (typeof window === 'undefined') return

  function buildTickerDOM(container) {
    if (!container) return { root: null, track: null }
    let track = container.querySelector('.ticker-move')
    if (!track) {
      track = document.createElement('div')
      track.className = 'ticker-move'
      container.appendChild(track)
    }
    return { root: container, track }
  }

  function renderTickerItems(track, items) {
    track.innerHTML = ''
    function createItemEl(it) {
      var wrap = document.createElement('span')
      wrap.className = 'ticker-item'

      var sym = document.createElement('span')
      sym.className = 'coin-symbol'
      sym.textContent = it.symbol

      var price = document.createElement('span')
      price.className = 'coin-price'
      price.textContent = it.price

      var badge = document.createElement('span')
      var up = it.change >= 0
      badge.className = up ? 'price-change-up' : 'price-change-down'

      var pct = document.createElement('span')
      pct.textContent = (up ? '+' : '') + it.change.toFixed(2) + '%'

      badge.appendChild(pct)

      wrap.appendChild(sym)
      wrap.appendChild(price)
      wrap.appendChild(badge)
      return wrap
    }

    // duplicate content for seamless loop
    var fragment = document.createDocumentFragment()
    items.forEach(function (it) {
      fragment.appendChild(createItemEl(it))
    })
    items.forEach(function (it) {
      fragment.appendChild(createItemEl(it))
    })
    track.appendChild(fragment)
  }

  function startMarquee(root, track, speedPxPerSec) {
    // Animation is handled by CSS automatically via .ticker-move class
    // No additional setup needed
  }

  // CryptoTicker fallback (enhanced marquee with badges)
  if (typeof window.CryptoTicker !== 'function') {
    window.CryptoTicker = function (selector, options) {
      this.el = document.querySelector(selector)
      if (!this.el) return
      var opts = options || {}
      var refreshMs =
        typeof opts.refreshInterval === 'number' ? opts.refreshInterval : 15000
      var speed = typeof opts.speed === 'number' ? opts.speed : 80

      var items = [
        { symbol: 'BTC', price: '$67,420', change: 2.1 },
        { symbol: 'ETH', price: '$3,210', change: 1.4 },
        { symbol: 'SOL', price: '$182', change: -0.6 },
        { symbol: 'ADA', price: '$0.48', change: 0.9 },
        { symbol: 'DOGE', price: '$0.14', change: 4.2 },
        { symbol: 'XRP', price: '$0.62', change: -1.1 },
        { symbol: 'AVAX', price: '$36.50', change: 0.75 }
      ]

      var dom = buildTickerDOM(this.el)
      renderTickerItems(dom.track, items)
      startMarquee(dom.root, dom.track, speed)

      var self = this
      this._timer = setInterval(function () {
        items = items.map(function (it) {
          var base = parseFloat(it.price.replace(/[^0-9.]/g, ''))
          var delta =
            (Math.random() - 0.5) * (base > 100 ? 20 : base > 1 ? 0.1 : 0.01)
          var next = Math.max(0, base + delta)
          var chg = (Math.random() - 0.5) * 2.5
          return {
            symbol: it.symbol,
            price:
              (it.price[0] === '$' ? '$' : '') +
              next.toFixed(next >= 1 ? 2 : 2),
            change: chg
          }
        })
        renderTickerItems(dom.track, items)
        startMarquee(dom.root, dom.track, speed)
      }, refreshMs)
    }
  }

  // SystemTicker fallback
  if (typeof window.SystemTicker !== 'function') {
    window.SystemTicker = function (selector, options) {
      this.el = document.querySelector(selector)
      if (!this.el) return
      var opts = options || {}
      var refreshMs =
        typeof opts.refreshInterval === 'number' ? opts.refreshInterval : 30000
      var speed = typeof opts.speed === 'number' ? opts.speed : 0.5

      var dom = buildTickerDOM(this.el)
      if (!dom.track) return

      // Initialize data arrays like the real SystemTicker
      this.methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
      this.endpoints = [
        '/api/users',
        '/api/products',
        '/api/orders',
        '/api/auth/login',
        '/api/inventory',
        '/api/dashboard',
        '/api/analytics',
        '/api/settings'
      ]
      this.statuses = [
        { code: 200, icon: 'check_circle', class: 'status-success' },
        { code: 201, icon: 'add_circle', class: 'status-success' },
        { code: 304, icon: 'cached', class: 'status-info' },
        { code: 401, icon: 'gpp_maybe', class: 'status-warning' },
        { code: 404, icon: 'error', class: 'status-error' },
        { code: 500, icon: 'report', class: 'status-error' }
      ]

      // Define generateEvent before using it
      var self = this
      this.generateEvent = function () {
        var method =
          self.methods[Math.floor(Math.random() * self.methods.length)]
        var endpoint =
          self.endpoints[Math.floor(Math.random() * self.endpoints.length)]
        var statusInfo =
          self.statuses[Math.floor(Math.random() * self.statuses.length)]
        var responseTime = Math.floor(Math.random() * 450) + 20 // 20ms to 470ms

        return {
          method: method,
          endpoint: endpoint,
          status: statusInfo.code,
          icon: statusInfo.icon,
          statusClass: statusInfo.class,
          responseTime: responseTime
        }
      }

      // Generate initial events
      var items = []
      var itemsToGenerate = 30
      for (var i = 0; i < itemsToGenerate; i++) {
        items.push(this.generateEvent())
      }

      function renderSystemTickerItems(track, eventsList) {
        track.innerHTML = ''
        var frag = document.createDocumentFragment()
        eventsList.forEach(function (event) {
          var div = document.createElement('div')
          div.className = 'ticker-item'
          div.innerHTML =
            '<span class="material-symbols-rounded ' +
            event.statusClass +
            '" title="Status: ' +
            event.status +
            '">' +
            event.icon +
            '</span>' +
            '<span class="log-method">' +
            event.method +
            '</span>' +
            '<span class="log-endpoint">' +
            event.endpoint +
            '</span>' +
            '<span class="log-status ' +
            event.statusClass +
            '">' +
            event.status +
            '</span>' +
            '<span class="log-time">' +
            event.responseTime +
            'ms</span>'
          frag.appendChild(div)
        })
        // Duplicate for seamless loop
        eventsList.forEach(function (event) {
          var div = document.createElement('div')
          div.className = 'ticker-item'
          div.innerHTML =
            '<span class="material-symbols-rounded ' +
            event.statusClass +
            '" title="Status: ' +
            event.status +
            '">' +
            event.icon +
            '</span>' +
            '<span class="log-method">' +
            event.method +
            '</span>' +
            '<span class="log-endpoint">' +
            event.endpoint +
            '</span>' +
            '<span class="log-status ' +
            event.statusClass +
            '">' +
            event.status +
            '</span>' +
            '<span class="log-time">' +
            event.responseTime +
            'ms</span>'
          frag.appendChild(div)
        })
        track.appendChild(frag)
      }

      renderSystemTickerItems(dom.track, items)
      startMarquee(dom.root, dom.track, speed)

      var self = this
      this._timer = setInterval(function () {
        // Update events: shift one out, generate a new one
        items.shift()
        items.push(self.generateEvent())
        renderSystemTickerItems(dom.track, items)
        startMarquee(dom.root, dom.track, speed)
      }, refreshMs)
    }
  }
})()
