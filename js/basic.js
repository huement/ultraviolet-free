// Basic Layout JavaScript - Static Export Version
// Minimal Bootstrap integration for freebie/basic pages
// This version works with static HTML files (no ES6 modules)

;(function () {
  'use strict'

  // Initialize Bootstrap components when DOM is ready
  document.addEventListener('DOMContentLoaded', function () {
    // Check if Bootstrap is available
    if (typeof bootstrap === 'undefined') {
      console.error(
        'Bootstrap is not loaded. Make sure bootstrap.bundle.min.js is included before basic.js'
      )
      return
    }

    // Initialize all tooltips
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    )
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })

    // Initialize all popovers
    const popoverTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="popover"]')
    )
    popoverTriggerList.map(function (popoverTriggerEl) {
      return new bootstrap.Popover(popoverTriggerEl)
    })

    // Initialize all modals
    const modalTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="modal"]')
    )
    modalTriggerList.map(function (modalTriggerEl) {
      return new bootstrap.Modal(
        document.querySelector(modalTriggerEl.getAttribute('data-bs-target'))
      )
    })

    console.log('Basic layout initialized with Bootstrap')
  })
})()
