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
              // FIX: Expand active menu items when mobile menu opens
              expandActiveMenuItems()
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
            // FIX: Auto-expand active menu items on hover
            expandActiveMenuItems()
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
      // Remove active class from toggle button
      if (toggleBtn) {
        toggleBtn.classList.remove('active')
      }
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
      // Remove active class from toggle button
      if (toggleBtn) {
        toggleBtn.classList.remove('active')
      }
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

  // Command list item click handlers
  const commandListItems = document.querySelectorAll('.command-list-item')
  commandListItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault()

      // Close the search popup
      if (typeof closeSearchPopup === 'function') {
        closeSearchPopup()
      }

      // Get the command name for the modal
      const commandName =
        item.querySelector('.command-name')?.textContent || 'Unknown Command'

      // Open the demo HUD modal
      openDemoHUDModal(commandName)
    })
  })

  // Function to open demo HUD modal
  function openDemoHUDModal(commandName) {
    // Get the existing modal from the template
    const demoModal = document.getElementById('demoCommandModal')

    if (demoModal) {
      // Update the command name in the modal
      const commandDisplay = demoModal.querySelector('#demoCommandName')
      if (commandDisplay) {
        commandDisplay.textContent = commandName
      }

      // Show the modal using Bootstrap
      if (typeof bootstrap !== 'undefined') {
        const modal = new bootstrap.Modal(demoModal)
        modal.show()
      }
    }
  }

  // Function to update background when theme changes
  function updateBackgroundForTheme() {
    const backgroundSelect = document.getElementById('admin-background-select')
    const currentAnimation = backgroundSelect ? backgroundSelect.value : 'none'

    if (currentAnimation === 'space') {
      // For space animation, keep background transparent
      document.body.style.backgroundColor = 'transparent'
    } else {
      // For no animation, use theme-aware background
      document.body.style.backgroundColor = ''
      // Let CSS handle the background via --bs-body-bg variable
    }
  }

  // Mobile search functions
  function openMobileSearch() {
    const mobileOverlay = document.getElementById('mobile-search-overlay')
    const mobileInput = document.getElementById('mobile-search-main-input')

    if (mobileOverlay) {
      mobileOverlay.classList.add('show')
      // Focus the main search input after the animation
      setTimeout(() => {
        if (mobileInput) {
          mobileInput.focus()
        }
      }, 300)
    }
  }

  function closeMobileSearch() {
    const mobileOverlay = document.getElementById('mobile-search-overlay')
    const mobileInput = document.getElementById('mobile-search-main-input')

    if (mobileOverlay) {
      mobileOverlay.classList.remove('show')
      // Clear the input
      if (mobileInput) {
        mobileInput.value = ''
      }
    }
  }

  // FIX: Expand active menu items when hovering over toggled sidebar
  function expandActiveMenuItems() {
    // Find all active menu items
    const activeItems = document.querySelectorAll('.hui-admin-menu .active')

    activeItems.forEach((activeItem) => {
      // Find the parent menu item that contains this active item
      let parentMenuItem = activeItem.closest('li')

      // Walk up the tree to find the top-level menu item
      while (
        parentMenuItem &&
        !parentMenuItem.closest('.hui-admin-menu > li')
      ) {
        parentMenuItem = parentMenuItem.parentElement?.closest('li')
      }

      if (parentMenuItem) {
        // Find the collapse element and expand it
        const collapseElement = parentMenuItem.querySelector('.collapse')
        if (collapseElement && !collapseElement.classList.contains('show')) {
          // Use Bootstrap's collapse functionality to expand
          const bsCollapse = new bootstrap.Collapse(collapseElement, {
            show: true
          })
        }

        // Also ensure the parent link has the mm-active class
        const parentLink = parentMenuItem.querySelector('a')
        if (parentLink) {
          parentMenuItem.classList.add('mm-active')
          parentLink.setAttribute('aria-expanded', 'true')
        }
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
                <a href="https://huement.com/blog/ultraviolet-bootstrap-5-dashboard" class="btn btn-primary" target="_blank">
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

  // Search functionality (freebie version - basic functionality without anime.js)
  setupMainSearchBar()

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

      // Update background when theme changes
      updateBackgroundForTheme()
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

  // Handle RTL toggle switch (enhanced with client-side styling)
  const rtlSwitch = document.getElementById('admin-rtl-switch')
  if (rtlSwitch) {
    // Check for RTL preference in URL parameter or localStorage
    const urlParams = new URLSearchParams(window.location.search)
    const urlRTL = urlParams.get('text') === 'rtl'
    const urlLTR = urlParams.get('text') === 'ltr'
    const savedRTL = localStorage.getItem('rtl-preference') === 'true'

    // Prioritize URL parameter over localStorage
    let isRTL
    if (urlRTL || urlLTR) {
      isRTL = urlRTL
    } else {
      isRTL = savedRTL
    }

    // Set initial state
    rtlSwitch.checked = isRTL
    applyRTL(isRTL)

    // Save preference to localStorage if it came from URL
    if (urlRTL) {
      localStorage.setItem('rtl-preference', 'true')
    } else if (urlParams.get('text') === 'ltr') {
      localStorage.setItem('rtl-preference', 'false')
    }

    rtlSwitch.addEventListener('change', (e) => {
      const isRTL = e.target.checked
      // Reload page with URL parameter (this works great for static exports!)
      const url = new URL(window.location.href)
      url.searchParams.set('text', isRTL ? 'rtl' : 'ltr')
      window.location.href = url.toString()
    })
  }

  // Function to apply RTL/LTR styling (enhanced for live version)
  function applyRTL(isRTL) {
    const html = document.documentElement
    const body = document.body

    if (isRTL) {
      html.setAttribute('dir', 'rtl')
      html.setAttribute('lang', 'ar')
      body.classList.add('rtl')
      body.classList.remove('ltr')

      // Add inline RTL styles to make text direction visible
      addRTLStyles()
    } else {
      html.setAttribute('dir', 'ltr')
      html.setAttribute('lang', 'en')
      body.classList.add('ltr')
      body.classList.remove('rtl')

      // Remove RTL styles
      removeRTLStyles()
    }

    console.log(`RTL mode ${isRTL ? 'enabled' : 'disabled'}`, {
      htmlDir: html.getAttribute('dir'),
      bodyClasses: body.className,
      htmlLang: html.getAttribute('lang')
    })
  }

  // Add RTL styles to make text direction visible
  function addRTLStyles() {
    // Remove existing RTL styles first
    removeRTLStyles()

    const style = document.createElement('style')
    style.id = 'rtl-styles'
    style.textContent = `
      [dir="rtl"] {
        direction: rtl !important;
        text-align: right !important;
      }
      
      [dir="rtl"] .card,
      [dir="rtl"] .card-body,
      [dir="rtl"] .card-header,
      [dir="rtl"] .card-footer,
      [dir="rtl"] .navbar,
      [dir="rtl"] .navbar-nav,
      [dir="rtl"] .nav-link,
      [dir="rtl"] .dropdown-menu,
      [dir="rtl"] .btn,
      [dir="rtl"] .form-control,
      [dir="rtl"] .form-label,
      [dir="rtl"] .table,
      [dir="rtl"] .table th,
      [dir="rtl"] .table td,
      [dir="rtl"] .breadcrumb,
      [dir="rtl"] .breadcrumb-item,
      [dir="rtl"] .list-group,
      [dir="rtl"] .list-group-item,
      [dir="rtl"] .modal-content,
      [dir="rtl"] .modal-header,
      [dir="rtl"] .modal-body,
      [dir="rtl"] .modal-footer,
      [dir="rtl"] .alert,
      [dir="rtl"] .badge,
      [dir="rtl"] .progress,
      [dir="rtl"] .sidebar-wrapper,
      [dir="rtl"] .ultraviolet-action-bar,
      [dir="rtl"] .ultraviolet-content,
      [dir="rtl"] .page-breadcrumb,
      [dir="rtl"] .row,
      [dir="rtl"] .col,
      [dir="rtl"] .col-md-6,
      [dir="rtl"] .col-lg-4,
      [dir="rtl"] .col-xl-4,
      [dir="rtl"] .d-flex,
      [dir="rtl"] .justify-content-between,
      [dir="rtl"] .text-start,
      [dir="rtl"] .text-end,
      [dir="rtl"] .ms-auto,
      [dir="rtl"] .me-auto,
      [dir="rtl"] .float-start,
      [dir="rtl"] .float-end,
      [dir="rtl"] .nav-pills,
      [dir="rtl"] .nav-link,
      [dir="rtl"] .form-select,
      [dir="rtl"] .form-label,
      [dir="rtl"] .offcanvas,
      [dir="rtl"] .offcanvas-header,
      [dir="rtl"] .offcanvas-body {
        direction: rtl !important;
        text-align: right !important;
      }
      
      /* Flip Bootstrap spacing classes for RTL */
      [dir="rtl"] .ms-auto {
        margin-left: auto !important;
        margin-right: 0 !important;
      }
      
      [dir="rtl"] .me-auto {
        margin-left: 0 !important;
        margin-right: auto !important;
      }
      
      [dir="rtl"] .text-start {
        text-align: right !important;
      }
      
      [dir="rtl"] .text-end {
        text-align: left !important;
      }
      
      [dir="rtl"] .float-start {
        float: right !important;
      }
      
      [dir="rtl"] .float-end {
        float: left !important;
      }
      
      /* Fix main content area padding for RTL */
      [dir="rtl"] .ultraviolet-main-wrapper,
      [dir="rtl"] .ultraviolet-content,
      [dir="rtl"] .page-content,
      [dir="rtl"] .main-content,
      [dir="rtl"] .content-wrapper,
      [dir="rtl"] .page-wrapper {
        padding-left: 0 !important;
        padding-right: 0 !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
      }
      
      /* Fix sidebar positioning for RTL */
      [dir="rtl"] .sidebar-wrapper {
        right: 0 !important;
        left: auto !important;
      }
      
      /* Fix main content when sidebar is present */
      [dir="rtl"] body:not(.toggled) .ultraviolet-main-wrapper,
      [dir="rtl"] body:not(.toggled) .ultraviolet-content {
        margin-left: 0 !important;
        margin-right: 280px !important;
      }
      
      /* Fix main content when sidebar is toggled/collapsed */
      [dir="rtl"] body.toggled .ultraviolet-main-wrapper,
      [dir="rtl"] body.toggled .ultraviolet-content {
        margin-left: 0 !important;
        margin-right: 80px !important;
      }
      
      /* Fix page action bar layout for RTL - reverse the flex order */
      [dir="rtl"] .page-actions {
        direction: rtl !important;
        flex-direction: row-reverse !important;
      }
      
      /* Keep breadcrumb on the right side in RTL */
      [dir="rtl"] .page-breadcrumb {
        direction: rtl !important;
        text-align: right !important;
        margin-left: auto !important;
        margin-right: 0 !important;
      }
      
      /* Keep action buttons on the left side in RTL */
      [dir="rtl"] .page-actions .dropdown,
      [dir="rtl"] .page-actions .btn,
      [dir="rtl"] .page-actions .form-control,
      [dir="rtl"] .page-actions .input-group {
        direction: rtl !important;
        text-align: right !important;
        margin-left: 0 !important;
        margin-right: auto !important;
      }
      
      /* Fix page actions container positioning for RTL */
      [dir="rtl"] .ms-auto {
        margin-left: 0 !important;
        margin-right: auto !important;
      }
      
      /* Specifically fix the page actions wrapper */
      [dir="rtl"] .page-actions,
      [dir="rtl"] .page-actions.ms-auto {
        margin-left: 0 !important;
        margin-right: auto !important;
      }
      
      /* Fix dropdown positioning for RTL */
      [dir="rtl"] .dropdown-menu {
        right: 0 !important;
        left: auto !important;
        text-align: right !important;
      }
      
      [dir="rtl"] .dropdown-menu-end {
        right: auto !important;
        left: 0 !important;
      }
      
      /* Fix user dropdown in action bar for RTL */
      [dir="rtl"] .ultraviolet-action-bar .dropdown-menu,
      [dir="rtl"] .navbar .dropdown-menu {
        right: auto !important;
        left: 0 !important;
        transform: translateX(0) !important;
      }
      
      /* Fix dropdown positioning for navbar items */
      [dir="rtl"] .navbar-nav .dropdown-menu {
        right: auto !important;
        left: 0 !important;
      }
      
      /* Fix page actions container positioning for RTL */
      [dir="rtl"] .ms-auto {
        margin-left: 0 !important;
        margin-right: auto !important;
      }
      
      /* Specifically fix the page actions wrapper */
      [dir="rtl"] .page-actions,
      [dir="rtl"] .page-actions.ms-auto {
        margin-left: 0 !important;
        margin-right: auto !important;
      }
      
      /* Fix button groups and form controls in action bar */
      [dir="rtl"] .btn-group,
      [dir="rtl"] .input-group,
      [dir="rtl"] .form-control,
      [dir="rtl"] .btn {
        direction: rtl !important;
        text-align: right !important;
      }
    `
    document.head.appendChild(style)
  }

  // Remove RTL styles
  function removeRTLStyles() {
    const existingStyle = document.getElementById('rtl-styles')
    if (existingStyle) {
      existingStyle.remove()
    }
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
      this.canvas.style.zIndex = '-1'
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

      // Clear the canvas and container to restore content visibility
      if (this.canvas) {
        this.canvas.remove()
        this.canvas = null
        this.ctx = null
      }

      // Clear the background container
      const container = document.getElementById('admin-background')
      if (container) {
        container.innerHTML = ''
      }
    }
  }

  // Background animation controls (freebie version - starfield only)
  const backgroundSelect = document.getElementById('admin-background-select')
  const backgroundContainer = document.getElementById('admin-background')

  // Ensure the background container is properly positioned
  if (backgroundContainer) {
    backgroundContainer.style.position = 'fixed'
    backgroundContainer.style.top = '0'
    backgroundContainer.style.left = '0'
    backgroundContainer.style.width = '100%'
    backgroundContainer.style.height = '100%'
    backgroundContainer.style.zIndex = '-1'
    backgroundContainer.style.pointerEvents = 'none'
  }

  if (backgroundSelect && backgroundContainer) {
    // Use separate localStorage key for freebie to avoid conflicts with pro version
    const freebieAnimationKey = 'freebie-background-animation'

    // Set initial value - default to 'space' (starfield) for freebie, like dark mode default
    const savedAnimation = localStorage.getItem(freebieAnimationKey) || 'space'
    backgroundSelect.value = savedAnimation

    // Initialize starfield
    const starfield = new FreebieStarfield()

    // Apply initial animation (matching original logic)
    if (savedAnimation === 'space') {
      document.body.style.backgroundColor = 'transparent'
      starfield.init('admin-background')
    } else {
      starfield.stop()
      // Don't set hardcoded background - let CSS handle it
      document.body.style.backgroundColor = ''
    }

    // Add change listener
    backgroundSelect.addEventListener('change', (e) => {
      const animationType = e.target.value

      // For freebie, only allow 'none' and 'space' (starfield)
      if (animationType === 'none' || animationType === 'space') {
        // Valid freebie option - save and apply
        localStorage.setItem(freebieAnimationKey, animationType)
        console.log(
          `Freebie background animation switched to: ${animationType}`
        )

        if (animationType === 'space') {
          document.body.style.backgroundColor = 'transparent'
          starfield.init('admin-background')
        } else {
          starfield.stop()
          // Don't set hardcoded background - let CSS handle it
          document.body.style.backgroundColor = ''
        }
      } else {
        // Invalid option - show upgrade modal and always revert to "none"
        showProFeatureModal('Advanced Background Animations')
        // Always revert to "none" for invalid selections
        backgroundSelect.value = 'none'
        localStorage.setItem(freebieAnimationKey, 'none')
        starfield.stop()
        // Don't set hardcoded background - let CSS handle it
        document.body.style.backgroundColor = ''
        console.log('Reverted to "none" for invalid selection')
      }
    })
  }

  // Listen for theme changes from other sources (like admin.js)
  window.addEventListener('themeChanged', (event) => {
    console.log('Theme changed event received:', event.detail)
    updateBackgroundForTheme()
  })

  // Mobile search event listeners
  const mobileSearchClose = document.getElementById('mobile-search-close')
  if (mobileSearchClose) {
    mobileSearchClose.addEventListener('click', closeMobileSearch)
  }

  // Close mobile search on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const mobileOverlay = document.getElementById('mobile-search-overlay')
      if (mobileOverlay && mobileOverlay.classList.contains('show')) {
        closeMobileSearch()
      }
    }
  })

  // Close mobile search when clicking outside (on the overlay background)
  const mobileOverlay = document.getElementById('mobile-search-overlay')
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', (e) => {
      // Only close if clicking on the overlay itself, not its children
      if (e.target === mobileOverlay) {
        closeMobileSearch()
      }
    })
  }

  // Mobile search form submission
  const mobileSearchForm = document.getElementById('mobile-search-form')
  if (mobileSearchForm) {
    mobileSearchForm.addEventListener('submit', (e) => {
      e.preventDefault()

      const searchInput = document.getElementById('mobile-search-main-input')
      const searchTerm = searchInput ? searchInput.value.trim() : ''

      if (searchTerm) {
        // Close the mobile search
        closeMobileSearch()

        // For now, just show a demo modal with the search term
        // In a real app, you'd perform the actual search here
        openDemoHUDModal(`Search: ${searchTerm}`)
      }
    })
  }

  // Mobile command item click handlers
  const mobileCommandItems = document.querySelectorAll('.mobile-command-item')
  mobileCommandItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault()

      // Close the mobile search
      closeMobileSearch()

      // Get the command name for the modal
      const commandName =
        item.querySelector('.command-name')?.textContent || 'Unknown Command'

      // Open the demo HUD modal
      openDemoHUDModal(commandName)
    })
  })

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

  // Search functionality (freebie version - basic functionality without anime.js)
  function setupMainSearchBar() {
    /* search control */

    // Search functionality with CSS transitions (no anime.js needed)
    const searchControl = document.querySelector('.search-control')
    const searchPopup = document.querySelector('.search-popup')
    const searchClose = document.querySelector('.search-close')
    const mobileSearchBtn = document.querySelector('.mobile-search-btn')
    const mobileSearchClose = document.querySelector('.mobile-search-close')

    // Set initial state
    if (searchPopup) {
      searchPopup.style.opacity = '0'
      searchPopup.style.transform = 'translateY(-20px)'
      searchPopup.style.display = 'none'
      searchPopup.style.visibility = 'hidden'
      searchPopup.style.pointerEvents = 'none'
      searchPopup.style.transition = 'opacity 0.3s ease, transform 0.3s ease'
    }

    // Hide close button initially
    if (searchClose) {
      searchClose.style.display = 'none'
    }

    // Function to toggle close button visibility based on input text
    const toggleCloseButton = () => {
      if (!searchControl || !searchClose) return

      if (searchControl.value.trim().length > 0) {
        searchClose.style.display = 'block'
      } else {
        searchClose.style.display = 'none'
      }
    }

    // Function to open search popup
    const openSearchPopup = () => {
      if (!searchPopup) return

      // Remove d-none class to show the popup
      searchPopup.classList.remove('d-none')
      searchPopup.style.display = 'block'
      searchPopup.style.visibility = 'visible'
      searchPopup.style.pointerEvents = 'auto'

      // Use requestAnimationFrame to ensure display change is applied before transition
      requestAnimationFrame(() => {
        searchPopup.style.opacity = '1'
        searchPopup.style.transform = 'translateY(0)'
      })
    }

    // Function to close search popup
    const closeSearchPopup = () => {
      if (!searchPopup) return

      searchPopup.style.opacity = '0'
      searchPopup.style.transform = 'translateY(-20px)'

      // Hide after transition completes
      setTimeout(() => {
        // Add d-none class back to hide the popup
        searchPopup.classList.add('d-none')
        searchPopup.style.display = 'none'
        searchPopup.style.visibility = 'hidden'
        searchPopup.style.pointerEvents = 'none'
      }, 300)
    }

    // Desktop search control
    if (searchControl && searchPopup) {
      console.log('search active')
      searchControl.addEventListener('click', openSearchPopup)

      // Show/hide close button as user types
      searchControl.addEventListener('input', toggleCloseButton)

      // Show/hide close button on focus
      searchControl.addEventListener('focus', toggleCloseButton)
    }

    // Close button - clear input text
    if (searchClose && searchControl) {
      searchClose.addEventListener('click', (e) => {
        e.stopPropagation() // Prevent triggering search popup
        searchControl.value = '' // Clear the input
        searchClose.style.display = 'none' // Hide the close button
        searchControl.focus() // Keep focus on input
      })
    }

    // Mobile search button - use mobile overlay instead of desktop popup
    if (mobileSearchBtn) {
      mobileSearchBtn.addEventListener('click', openMobileSearch)
    }

    // Mobile close button
    if (mobileSearchClose && searchPopup) {
      mobileSearchClose.addEventListener('click', closeSearchPopup)
    }

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (searchPopup && searchPopup.style.display === 'block') {
        const isClickInsideSearch = searchPopup.contains(e.target)
        const isSearchControl =
          searchControl && searchControl.contains(e.target)
        const isMobileSearchBtn =
          mobileSearchBtn && mobileSearchBtn.contains(e.target)

        if (!isClickInsideSearch && !isSearchControl && !isMobileSearchBtn) {
          closeSearchPopup()
        }
      }
    })

    // Canvas Scanner Animation (simplified version without anime.js)
    const canvas = document.getElementById('hud-scanner-canvas')
    if (canvas) {
      const ctx = canvas.getContext('2d')
      let scanY = 0
      let scanDir = 1
      let canvasWidth = 0
      let canvasHeight = 0

      function resizeCanvas() {
        const container = canvas.parentElement
        canvasWidth = container.clientWidth
        canvasHeight = container.clientHeight
        canvas.width = canvasWidth
        canvas.height = canvasHeight
      }

      function drawScanner() {
        // Clear canvas
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)

        // Create gradient for the scan line
        const gradient = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20)
        gradient.addColorStop(0, 'rgba(0, 190, 255, 0)')
        gradient.addColorStop(0.5, 'rgba(0, 190, 255, 0.7)')
        gradient.addColorStop(1, 'rgba(0, 190, 255, 0)')

        // Draw the line
        ctx.fillStyle = gradient
        ctx.fillRect(0, scanY - 20, canvasWidth, 40)

        // Draw faint horizontal grid lines
        ctx.strokeStyle = 'rgba(0, 190, 255, 0.05)'
        ctx.lineWidth = 1
        for (let y = 0; y < canvasHeight; y += 20) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(canvasWidth, y)
          ctx.stroke()
        }

        // Move scan line
        scanY += scanDir * (canvasHeight / 200) // Adjust speed

        // Reverse direction
        if (scanY > canvasHeight) {
          scanY = canvasHeight
          scanDir = -1
        } else if (scanY < 0) {
          scanY = 0
          scanDir = 1
        }

        requestAnimationFrame(drawScanner)
      }

      // Initial setup
      resizeCanvas()
      window.addEventListener('resize', resizeCanvas)
      drawScanner()
    } else {
      console.warn('Canvas element #hud-scanner-canvas not found.')
    }

    // Command Palette Filter
    const searchInput = document.getElementById('hud-search')
    const commandList = document.getElementById('command-list')

    if (searchInput && commandList) {
      const listItems = commandList.getElementsByTagName('li')

      searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase()

        for (let item of listItems) {
          const commandName =
            item.querySelector('.command-name')?.textContent.toLowerCase() || ''
          const commandDesc =
            item.querySelector('.command-desc')?.textContent.toLowerCase() || ''

          if (
            commandName.includes(searchTerm) ||
            commandDesc.includes(searchTerm)
          ) {
            item.style.display = 'flex'
          } else {
            item.style.display = 'none'
          }
        }
      })
    } else {
      // This is normal for freebie version - command palette is a pro feature
      console.log(
        'Command palette not found - this is normal for freebie version'
      )
    }
  }

  console.log('UltraViolet Freebie initialized')
})
