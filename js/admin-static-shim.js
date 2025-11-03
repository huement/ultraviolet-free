// Essential functionality for static export (no ES modules)
document.addEventListener('DOMContentLoaded', function() {
  // Sidebar toggle functionality
  const toggleBtn = document.querySelector('.btn-toggle');
  const sidebar = document.querySelector('.sidebar-wrapper');
  const overlay = document.querySelector('.overlay');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', function(e) {
      e.preventDefault();

      if (window.innerWidth < 992) {
        // Mobile: offcanvas behavior
        sidebar.classList.toggle('mobile-open');
        if (overlay) {
          if (sidebar.classList.contains('mobile-open')) {
            overlay.style.display = 'block';
            setTimeout(() => {
              overlay.style.opacity = '1';
              overlay.style.visibility = 'visible';
            }, 10);
          } else {
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
            setTimeout(() => overlay.style.display = 'none', 300);
          }
        }
      } else {
        // Desktop: collapsed sidebar
        document.body.classList.toggle('toggled');

        if (document.body.classList.contains('toggled')) {
          sidebar.addEventListener('mouseenter', function() {
            document.body.classList.add('sidebar-hovered');
          });
          sidebar.addEventListener('mouseleave', function() {
            document.body.classList.remove('sidebar-hovered');
          });
        }
      }
    });
  }

  // Close sidebar on overlay click
  if (overlay) {
    overlay.addEventListener('click', function() {
      document.body.classList.remove('toggled', 'sidebar-hovered');
      if (sidebar) {
        sidebar.classList.remove('mobile-open');
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
        setTimeout(() => overlay.style.display = 'none', 300);
      }
    });
  }

  // Initialize Bootstrap components
  if (typeof bootstrap !== 'undefined') {
    // Popovers
    [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
      .map(el => new bootstrap.Popover(el));

    // Dropdowns
    [].slice.call(document.querySelectorAll('.dropdown-toggle'))
      .map(el => new bootstrap.Dropdown(el));
  }

  // Dynamic dropdown positioning for horizontal menu
  function initializeDynamicDropdownPositioning() {

    // Listen for dropdown show events
    document.addEventListener('show.bs.dropdown', (event) => {
      const toggleElement = event.target;
      const dropdownContainer = toggleElement.closest('.dropdown');
      const dropdownElement = dropdownContainer?.querySelector('.dropdown-menu');

      // Only apply to regular dropdowns in the horizontal menu, not mega menu or header dropdowns
      if (
        dropdownElement &&
        toggleElement &&
        !dropdownContainer?.classList.contains('dropdown-mega') &&
        dropdownContainer?.closest('.hui-horizontal-scroll')
      ) {

        // Small delay to let Bootstrap show the dropdown first
        setTimeout(() => {
          // Get the position of the toggle button
          const toggleRect = toggleElement.getBoundingClientRect();
          const viewportWidth = window.innerWidth;
          const dropdownWidth = 200; // Match the CSS width

          // Calculate the left position
          let leftPosition = toggleRect.left;

          // Check for right edge collision
          if (leftPosition + dropdownWidth > viewportWidth) {
            leftPosition = viewportWidth - dropdownWidth - 10; // 10px margin
          }

          // Ensure minimum left position
          if (leftPosition < 10) {
            leftPosition = 10;
          }

          // Apply the dynamic position
          dropdownElement.style.left = `${leftPosition}px`;
          dropdownElement.style.right = 'auto'; // Reset right positioning
        }, 10); // Small delay to let Bootstrap process first
      }
    });

    // Also listen for dropdown shown event to ensure positioning is maintained
    document.addEventListener('shown.bs.dropdown', (event) => {
      const toggleElement = event.target;
      const dropdownContainer = toggleElement.closest('.dropdown');
      const dropdownElement = dropdownContainer?.querySelector('.dropdown-menu');

      // Only apply to regular dropdowns in the horizontal menu
      if (
        dropdownElement &&
        toggleElement &&
        !dropdownContainer?.classList.contains('dropdown-mega') &&
        dropdownContainer?.closest('.hui-horizontal-scroll')
      ) {
        // Double-check positioning after Bootstrap has finished its positioning
        setTimeout(() => {
          const toggleRect = toggleElement.getBoundingClientRect();
          const viewportWidth = window.innerWidth;
          const dropdownWidth = 300;

          let leftPosition = toggleRect.left;

          if (leftPosition + dropdownWidth > viewportWidth) {
            leftPosition = viewportWidth - dropdownWidth - 10;
          }

          if (leftPosition < 10) {
            leftPosition = 10;
          }

          // Re-apply positioning to override any Bootstrap positioning
          dropdownElement.style.left = `${leftPosition}px`;
          dropdownElement.style.right = 'auto';
          dropdownElement.style.transform = 'none';
          dropdownElement.style.position = 'absolute';
        }, 5);
      }
    });
  }

  // Initialize dynamic dropdown positioning
  initializeDynamicDropdownPositioning();

  // Initialize SimpleBar if available
  if (typeof SimpleBar !== 'undefined') {
    document.querySelectorAll('[data-simplebar]').forEach(el => {
      new SimpleBar(el, { autoHide: false });
    });
  }

  // Watch for body style changes (Bootstrap offcanvas adds overflow: hidden)
  // When offcanvas opens, add mobile-menu-open class to body
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        const style = document.body.getAttribute('style');
        if (style && style.includes('overflow: hidden')) {
          document.body.classList.add('mobile-menu-open');
        } else if (!style || !style.includes('overflow: hidden')) {
          document.body.classList.remove('mobile-menu-open');
        }
      }
    });
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['style']
  });

  // Fixed header toggle (horizontal layout only)
  const fixedHeaderToggle = document.querySelector('[data-bs-title="Toggle Fixed Header"]');
  if (fixedHeaderToggle) {
    const header = document.querySelector('.ultraviolet-action-bar');
    const icon = fixedHeaderToggle.querySelector('.material-symbols-rounded');

    // No localStorage - server controls initial state via exported HTML

    // Toggle handler
    fixedHeaderToggle.addEventListener('click', function(e) {
      e.preventDefault();
      if (header) {
        header.classList.toggle('fixed-to-top');

        // Toggle icon color
        if (icon) {
          icon.classList.toggle('text-primary');
        }

        // Toggle background
        this.classList.toggle('bg-info');

        // Toggle body class
        document.body.classList.toggle('fixed-top-header');
      }
    });
  }

  // Initialize settings menu toggle
  const settingsToggle = document.getElementById('admin-settings-toggle');
  const settingsMenu = document.getElementById('admin-settings-menu');
  let isSettingsMenuOpen = false;

  if (settingsToggle && settingsMenu) {
    settingsToggle.addEventListener('click', (e) => {
      e.preventDefault();
      isSettingsMenuOpen = !isSettingsMenuOpen;

      if (isSettingsMenuOpen) {
        settingsMenu.classList.add('show');
      } else {
        settingsMenu.classList.remove('show');
      }
    });

    // Close settings menu when clicking outside
    document.addEventListener('click', (e) => {
      if (isSettingsMenuOpen && !settingsMenu.contains(e.target) && !settingsToggle.contains(e.target)) {
        isSettingsMenuOpen = false;
        settingsMenu.classList.remove('show');
      }
    });
  }

  // Handle RTL toggle switch (enhanced with client-side styling)
  const rtlSwitch = document.getElementById('admin-rtl-switch');
  if (rtlSwitch) {
    // Check for RTL preference in URL parameter or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const urlRTL = urlParams.get('text') === 'rtl';
    const urlLTR = urlParams.get('text') === 'ltr';
    const savedRTL = localStorage.getItem('rtl-preference') === 'true';

    // Prioritize URL parameter over localStorage
    let isRTL;
    if (urlRTL || urlLTR) {
      isRTL = urlRTL;
    } else {
      isRTL = savedRTL;
    }

    // Set initial state
    rtlSwitch.checked = isRTL;
    applyRTL(isRTL);

    // Save preference to localStorage if it came from URL
    if (urlRTL) {
      localStorage.setItem('rtl-preference', 'true');
    } else if (urlParams.get('text') === 'ltr') {
      localStorage.setItem('rtl-preference', 'false');
    }

    rtlSwitch.addEventListener('change', (e) => {
      const isRTL = e.target.checked;
      // Reload page with URL parameter
      const url = new URL(window.location.href);
      url.searchParams.set('text', isRTL ? 'rtl' : 'ltr');
      window.location.href = url.toString();
    });
  }

  // Function to apply RTL/LTR styling (enhanced for live version)
  function applyRTL(isRTL) {
    const html = document.documentElement;
    const body = document.body;

    if (isRTL) {
      html.setAttribute('dir', 'rtl');
      html.setAttribute('lang', 'ar');
      body.classList.add('rtl');
      body.classList.remove('ltr');

      // Add inline RTL styles to make text direction visible
      addRTLStyles();
    } else {
      html.setAttribute('dir', 'ltr');
      html.setAttribute('lang', 'en');
      body.classList.add('ltr');
      body.classList.remove('rtl');

      // Remove RTL styles
      removeRTLStyles();
    }
  }

  // Add RTL styles to make text direction visible
  function addRTLStyles() {
    // Remove existing RTL styles first
    removeRTLStyles();

    const style = document.createElement('style');
    style.id = 'rtl-styles';
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

      /* Fix button groups and form controls in action bar */
      [dir="rtl"] .btn-group,
      [dir="rtl"] .input-group,
      [dir="rtl"] .form-control,
      [dir="rtl"] .btn {
        direction: rtl !important;
        text-align: right !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Remove RTL styles
  function removeRTLStyles() {
    const existingStyle = document.getElementById('rtl-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
  }
});


