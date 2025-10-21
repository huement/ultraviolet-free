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

  console.log('UltraViolet Freebie initialized')
})
