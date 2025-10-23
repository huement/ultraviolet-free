/**
 * UltraViolet Freebie - Limited Free Version JavaScript
 * Only includes essential functionality with pro upgrade prompts
 */

// Essential functionality for freebie (no ES modules)
document.addEventListener('DOMContentLoaded', function () {
  // Sidebar toggle functionality
  const toggleBtn = document.querySelector('.btn-toggle')
  const sidebar = document.querySelector('.sidebar-wrapper')
  const overlay = document.querySelector('.overlay')

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', function (e) {
      e.preventDefault()

      if (window.innerWidth < 992) {
        // Mobile: offcanvas behavior
        sidebar.classList.toggle('mobile-open')
        if (overlay) {
          if (sidebar.classList.contains('mobile-open')) {
            overlay.style.display = 'block'
            setTimeout(() => {
              overlay.style.opacity = '1'
              overlay.style.visibility = 'visible'
            }, 10)
          } else {
            overlay.style.opacity = '0'
            overlay.style.visibility = 'hidden'
            setTimeout(() => (overlay.style.display = 'none'), 300)
          }
        }
      } else {
        // Desktop: collapsed sidebar
        document.body.classList.toggle('toggled')

        if (document.body.classList.contains('toggled')) {
          sidebar.addEventListener('mouseenter', function () {
            document.body.classList.add('sidebar-hovered')
          })
          sidebar.addEventListener('mouseleave', function () {
            document.body.classList.remove('sidebar-hovered')
          })
        }
      }
    })
  }

  // Close sidebar on overlay click
  if (overlay) {
    overlay.addEventListener('click', function () {
      document.body.classList.remove('toggled', 'sidebar-hovered')
      if (sidebar) {
        sidebar.classList.remove('mobile-open')
        overlay.style.opacity = '0'
        overlay.style.visibility = 'hidden'
        setTimeout(() => (overlay.style.display = 'none'), 300)
      }
    })
  }

  // Close sidebar when clicking close button
  const sidebarClose = document.querySelector('.sidebar-close')
  if (sidebarClose) {
    sidebarClose.addEventListener('click', function (e) {
      e.preventDefault()
      document.body.classList.remove('toggled', 'sidebar-hovered')
      if (sidebar) {
        sidebar.classList.remove('mobile-open')
      }
      if (overlay) {
        overlay.style.opacity = '0'
        overlay.style.visibility = 'hidden'
        setTimeout(() => (overlay.style.display = 'none'), 300)
      }
    })
  }

  // Initialize Bootstrap components
  if (typeof bootstrap !== 'undefined') {
    // Popovers
    ;[].slice
      .call(document.querySelectorAll('[data-bs-toggle="popover"]'))
      .map((el) => new bootstrap.Popover(el))

    // Dropdowns
    ;[].slice
      .call(document.querySelectorAll('.dropdown-toggle'))
      .map((el) => new bootstrap.Dropdown(el))
  }

  // Initialize SimpleBar if available
  if (typeof SimpleBar !== 'undefined') {
    document.querySelectorAll('[data-simplebar]').forEach((el) => {
      new SimpleBar(el, { autoHide: false })
    })
  }

  // Watch for body style changes (Bootstrap offcanvas adds overflow: hidden)
  // When offcanvas opens, add mobile-menu-open class to body
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'style'
      ) {
        const style = document.body.getAttribute('style')
        if (style && style.includes('overflow: hidden')) {
          document.body.classList.add('mobile-menu-open')
        } else if (!style || !style.includes('overflow: hidden')) {
          document.body.classList.remove('mobile-menu-open')
        }
      }
    })
  })

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['style']
  })

  // Pro Feature Modal - Show upgrade prompt
  function showProFeatureModal(featureName) {
    // Hide the admin settings menu if it's open
    const settingsMenu = document.getElementById('admin-settings-menu')
    if (settingsMenu && settingsMenu.classList.contains('show')) {
      settingsMenu.classList.remove('show')
      // Reset the settings menu state
      if (window.isSettingsMenuOpen !== undefined) {
        window.isSettingsMenuOpen = false
      }
    }

    const modalHtml = `
      <div class="modal fade" id="proFeatureModal" tabindex="-1" aria-labelledby="proFeatureModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title" id="proFeatureModalLabel">
                <i class="material-symbols-rounded me-2">star</i>
                Pro Feature
              </h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center py-4">
              <div class="mb-3">
                <i class="material-symbols-rounded text-warning" style="font-size: 64px;">workspace_premium</i>
              </div>
              <h5 class="mb-3">${featureName || 'This Feature'} is Only Available in UltraViolet Pro</h5>
              <p class="text-muted mb-4">Upgrade to UltraViolet Pro to unlock this feature and 50+ additional pages, components, and layouts.</p>
              <div class="d-flex gap-2 justify-content-center">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Maybe Later</button>
                <a href="https://huement.com/ultraviolet-pro" class="btn btn-primary" target="_blank">
                  <i class="material-symbols-rounded me-1" style="font-size: 16px;">shopping_cart</i>
                  View Pro Version
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `

    // Remove existing modal if present
    const existingModal = document.getElementById('proFeatureModal')
    if (existingModal) {
      existingModal.remove()
    }

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml)

    // Show the modal
    const modalElement = document.getElementById('proFeatureModal')
    const modal = new bootstrap.Modal(modalElement)
    modal.show()

    // Remove modal from DOM after it's hidden
    modalElement.addEventListener('hidden.bs.modal', function () {
      modalElement.remove()
    })
  }

  // Intercept UI mode toggle clicks (horizontal layout switcher)
  document.addEventListener('click', function (e) {
    const target = e.target.closest(
      '[onclick*="toggleUIMode"], [onclick*="setUIMode"], .ui-mode-toggle, .layout-toggle, [data-layout-toggle]'
    )
    if (target) {
      e.preventDefault()
      e.stopPropagation()
      showProFeatureModal('Horizontal Layout')
      return false
    }
  })

  // Intercept theme switcher
  document.addEventListener('click', function (e) {
    const target = e.target.closest(
      '[onclick*="toggleTheme"], [onclick*="setTheme"], .theme-toggle, [data-theme-toggle]'
    )
    if (target) {
      e.preventDefault()
      e.stopPropagation()
      showProFeatureModal('Theme Switcher')
      return false
    }
  })

  // Intercept search functionality
  const searchInputs = document.querySelectorAll(
    '.search-input, [data-search], input[type="search"]'
  )
  searchInputs.forEach((input) => {
    input.addEventListener('focus', function (e) {
      e.preventDefault()
      this.blur()
      showProFeatureModal('Advanced Search')
    })
  })

  // NOTE: Menu links are now dynamically filtered by FreebieMenuService
  // Only pages that exist are shown in the menu, so no need to intercept clicks
  // The only upgrade modal trigger is the "Purchase PRO Version" button at bottom of menu

  // Fixed header toggle (horizontal layout only)
  const fixedHeaderToggle = document.querySelector(
    '[data-bs-title="Toggle Fixed Header"]'
  )
  if (fixedHeaderToggle) {
    const header = document.querySelector('.ultraviolet-action-bar')
    const icon = fixedHeaderToggle.querySelector('.material-symbols-rounded')

    // No localStorage - server controls initial state

    // Toggle handler
    fixedHeaderToggle.addEventListener('click', function (e) {
      e.preventDefault()
      if (header) {
        header.classList.toggle('fixed-to-top')

        // Toggle icon color
        if (icon) {
          icon.classList.toggle('text-primary')
        }

        // Toggle background
        this.classList.toggle('bg-info')

        // Toggle body class
        document.body.classList.toggle('fixed-top-header')
      }
    })
  }

  // Initialize settings menu toggle
  const settingsToggle = document.getElementById('admin-settings-toggle')
  const settingsMenu = document.getElementById('admin-settings-menu')
  let isSettingsMenuOpen = false

  if (settingsToggle && settingsMenu) {
    settingsToggle.addEventListener('click', (e) => {
      e.preventDefault()
      isSettingsMenuOpen = !isSettingsMenuOpen

      if (isSettingsMenuOpen) {
        settingsMenu.classList.add('show')
      } else {
        settingsMenu.classList.remove('show')
      }
    })

    // Close settings menu when clicking outside
    document.addEventListener('click', (e) => {
      if (
        isSettingsMenuOpen &&
        !settingsMenu.contains(e.target) &&
        !settingsToggle.contains(e.target)
      ) {
        isSettingsMenuOpen = false
        settingsMenu.classList.remove('show')
      }
    })
  }

  // Dark/Light Mode Toggle
  const darkModeToggle = document.getElementById('admin-dark-mode-switch')
  if (darkModeToggle) {
    // Apply dark or light mode
    const applyMode = (isDark) => {
      const theme = isDark ? 'dark' : 'light'
      const htmlEl = document.documentElement

      // Add transition class before theme change for smooth animation
      htmlEl.classList.add('theme-transitioning')

      // Set Bootstrap data-bs-theme attribute
      htmlEl.setAttribute('data-bs-theme', theme)

      // Save preference to localStorage
      localStorage.setItem('theme-preference', theme)

      // Log the theme change
      console.log(`Theme switched to: ${theme}`)

      // Remove transition class after animation completes
      setTimeout(() => {
        htmlEl.classList.remove('theme-transitioning')
      }, 300)

      // Dispatch custom event for other scripts to listen to
      window.dispatchEvent(
        new CustomEvent('themeChanged', {
          detail: { theme, isDark }
        })
      )
    }

    // Get current theme from HTML attribute (already set by inline script in <head>)
    const currentTheme =
      document.documentElement.getAttribute('data-bs-theme') || 'dark'
    const isDark = currentTheme === 'dark'

    // Set initial toggle state to match current theme
    darkModeToggle.checked = isDark

    // Listen for toggle changes
    darkModeToggle.addEventListener('change', (e) => {
      applyMode(e.target.checked)
    })

    // Listen for system theme changes (if user hasn't set a preference)
    if (window.matchMedia) {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (e) => {
          // Only auto-switch if user hasn't manually set a preference
          if (!localStorage.getItem('theme-preference')) {
            const isDark = e.matches
            darkModeToggle.checked = isDark
            applyMode(isDark)
            console.log(
              'System theme changed, auto-switching to:',
              isDark ? 'dark' : 'light'
            )
          }
        })
    }

    console.log('Theme system initialized:', {
      currentTheme,
      isDark,
      toggleFound: true
    })
  }

  // Handle RTL toggle switch
  const rtlSwitch = document.getElementById('admin-rtl-switch')
  if (rtlSwitch) {
    rtlSwitch.addEventListener('change', (e) => {
      const isRTL = e.target.checked
      const url = new URL(window.location.href)
      url.searchParams.set('text', isRTL ? 'rtl' : 'ltr')
      window.location.href = url.toString()
    })
  }

  // Exact copy of the original starfield animation for freebie
  class FreebieStarfield {
    constructor() {
      this.canvas = null
      this.ctx = null
      this.animationData = { stars: [] }
      this.animationFrame = null
      this.isRunning = false
      this.currentAnimation = 'space'
      
      // Configuration matching the original
      this.config = {
        space: {
          count: 800,
          starColor: '', // Will be set by getCSSVar
          speed: 1.5
        }
      }
    }

    // Get CSS variable value from the document (exact copy from original)
    getCSSVar(varName) {
      return (
        getComputedStyle(document.documentElement)
          .getPropertyValue(varName)
          .trim() || 'rgba(0, 255, 255, 0.8)'
      )
    }

    init(containerId = 'admin-background') {
      this.stop() // Stop any existing animation

      const container = document.getElementById(containerId)
      if (!container) {
        console.error(`Container #${containerId} not found`)
        return false
      }

      // Clear container
      container.innerHTML = ''

      // Create canvas (exact copy from original)
      this.canvas = document.createElement('canvas')
      this.canvas.id = 'background-canvas'
      this.canvas.style.position = 'fixed'
      this.canvas.style.top = '0'
      this.canvas.style.left = '0'
      this.canvas.style.width = '100%'
      this.canvas.style.height = '100%'
      this.canvas.style.zIndex = '1'
      this.canvas.style.pointerEvents = 'none'
      container.appendChild(this.canvas)

      this.ctx = this.canvas.getContext('2d')
      
      // Set running flag BEFORE setting up stars and animating
      this.isRunning = true
      this.currentAnimation = 'space'
      
      this.setupStars()
      this.animateStars()

      // Handle resize
      window.addEventListener('resize', () => this.setupStars())

      return true
    }

    // Exact copy of setupStars from original
    setupStars() {
      this.canvas.width = window.innerWidth
      this.canvas.height = window.innerHeight
      this.animationData.stars = []

      const cfg = this.config.space
      for (let i = 0; i < cfg.count; i++) {
        this.animationData.stars.push({
          x: (Math.random() - 0.5) * this.canvas.width,
          y: (Math.random() - 0.5) * this.canvas.height,
          z: Math.random() * this.canvas.width
        })
      }
    }

    // Exact copy of animateStars from original
    animateStars() {
      if (!this.isRunning || this.currentAnimation !== 'space') return

      const centerX = this.canvas.width / 2
      const centerY = this.canvas.height / 2
      const cfg = this.config.space

      // Clear canvas with background (use theme-aware body background)
      this.ctx.fillStyle = this.getCSSVar('--bs-body-bg')
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

      for (const star of this.animationData.stars) {
        star.z -= cfg.speed

        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * this.canvas.width
          star.y = (Math.random() - 0.5) * this.canvas.height
          star.z = this.canvas.width
        }

        // 3D perspective projection
        const sx = (star.x / star.z) * centerX + centerX
        const sy = (star.y / star.z) * centerY + centerY
        const radius = Math.max(0, (1 - star.z / this.canvas.width) * 2)

        if (
          sx > 0 &&
          sx < this.canvas.width &&
          sy > 0 &&
          sy < this.canvas.height
        ) {
          this.ctx.beginPath()
          this.ctx.arc(sx, sy, radius, 0, Math.PI * 2)
          this.ctx.fillStyle = this.getCSSVar('--hud-primary')
          this.ctx.fill()
        }
      }

      this.animationFrame = requestAnimationFrame(() => this.animateStars())
    }

    stop() {
      this.isRunning = false
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame)
        this.animationFrame = null
      }
    }
  }

  // Background animation controls (freebie version - starfield only)
  const backgroundSelect = document.getElementById('admin-background-select')
  const backgroundContainer = document.getElementById('admin-background')
  
  if (backgroundSelect && backgroundContainer) {
    // Use separate localStorage key for freebie to avoid conflicts with pro version
    const freebieAnimationKey = 'freebie-background-animation'
    
    // Set initial value - always start with 'none' for freebie
    const savedAnimation = localStorage.getItem(freebieAnimationKey) || 'none'
    backgroundSelect.value = savedAnimation

    // Initialize starfield
    const starfield = new FreebieStarfield()

    // Apply initial animation (matching original logic)
    if (savedAnimation === 'space') {
      document.body.style.backgroundColor = 'transparent'
      starfield.init('admin-background')
    } else {
      starfield.stop()
      document.body.style.backgroundColor = starfield.getCSSVar('--bs-body-bg')
    }

    // Add change listener
    backgroundSelect.addEventListener('change', (e) => {
      const animationType = e.target.value
      
      // For freebie, only allow 'none' and 'space' (starfield)
      if (animationType === 'none' || animationType === 'space') {
        // Valid freebie option - save and apply
        localStorage.setItem(freebieAnimationKey, animationType)
        console.log(`Freebie background animation switched to: ${animationType}`)
        
        if (animationType === 'space') {
          document.body.style.backgroundColor = 'transparent'
          starfield.init('admin-background')
        } else {
          starfield.stop()
          document.body.style.backgroundColor = starfield.getCSSVar('--bs-body-bg')
        }
      } else {
        // Invalid option - show upgrade modal and always revert to "none"
        showProFeatureModal('Advanced Background Animations')
        // Always revert to "none" for invalid selections
        backgroundSelect.value = 'none'
        localStorage.setItem(freebieAnimationKey, 'none')
        starfield.stop()
        document.body.style.backgroundColor = starfield.getCSSVar('--bs-body-bg')
        console.log('Reverted to "none" for invalid selection')
      }
    })
  }

  // Add scroll listener to apply "page-scrolled" class
  let isScrolled = false
  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    if (scrollTop > 10 && !isScrolled) {
      // Scrolled down - add class
      document.body.classList.add('page-scrolled')
      isScrolled = true
    } else if (scrollTop <= 10 && isScrolled) {
      // Back to top - remove class
      document.body.classList.remove('page-scrolled')
      isScrolled = false
    }
  }

  // Add scroll listener
  window.addEventListener('scroll', handleScroll, { passive: true })

  // Check initial scroll position
  handleScroll()

  console.log('UltraViolet Freebie initialized')
})
