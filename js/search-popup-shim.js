(function(){
  function qs(sel, root){return (root||document).querySelector(sel);}
  function qsa(sel, root){return Array.prototype.slice.call((root||document).querySelectorAll(sel));}
  
  function initSearch(){
    var searchInput = qs('input.search-control');
    var collapseEl = qs('#searchCollapse');
    var closeBtn = qs('.search-close');
    var mobileBtnWrap = document.querySelector('.mobile-search-btn');
    var mobileBtn = mobileBtnWrap ? (mobileBtnWrap.querySelector('a') || mobileBtnWrap) : null;
    var mobileOverlay = qs('#mobile-search-overlay');
    var mobileClose = qs('#mobile-search-close');
    var commandList = qs('#command-list');
    var searchBar = qs('.search-bar');
    
    if(!collapseEl && !mobileOverlay){return;}
    
    var collapseTimeout = null;
    var isClosing = false;
    
    // Get or create Bootstrap Collapse instance
    function getCollapseInstance(){
      if(typeof bootstrap === 'undefined' || !collapseEl) return null;
      try {
        return bootstrap.Collapse.getOrCreateInstance(collapseEl, {toggle: false});
      } catch(e) {
        return null;
      }
    }
    
    // Close collapse using Bootstrap API or fallback
    function closeCollapse(){
      if(isClosing || !collapseEl) return;
      isClosing = true;
      
      var instance = getCollapseInstance();
      if(instance) {
        try {
          instance.hide();
        } catch(e) {
          // Fallback: manual hide
          collapseEl.classList.remove('show');
        }
      } else {
        // Fallback: manual hide
        collapseEl.classList.remove('show');
      }
      
      // Clear timeout and reset flag
      if(collapseTimeout) {
        clearTimeout(collapseTimeout);
        collapseTimeout = null;
      }
      
      setTimeout(function(){
        isClosing = false;
      }, 300);
    }
    
    // Open collapse using Bootstrap API or fallback
    function openCollapse(){
      if(isClosing || !collapseEl) return;
      
      var instance = getCollapseInstance();
      if(instance) {
        try {
          instance.show();
        } catch(e) {
          // Fallback: manual show
          collapseEl.classList.add('show');
        }
      } else {
        // Fallback: manual show
        collapseEl.classList.add('show');
      }
      
      // Clear any existing timeout
      if(collapseTimeout) {
        clearTimeout(collapseTimeout);
        collapseTimeout = null;
      }
    }
    
    // Cleanup timeout - ensures collapse closes if something goes wrong
    function startCleanupTimer(){
      if(collapseTimeout) clearTimeout(collapseTimeout);
      collapseTimeout = setTimeout(function(){
        if(collapseEl && collapseEl.classList.contains('show')) {
          console.warn('[Search Popup] Cleanup timer: forcing close');
          closeCollapse();
        }
      }, 30000); // 30 second timeout
    }
    
    // Toggle close button visibility
    function toggleCloseButton(){
      if(!closeBtn || !searchInput) return;
      if(searchInput.value && searchInput.value.trim().length > 0) {
        closeBtn.style.display = 'block';
      } else {
        closeBtn.style.display = 'none';
      }
    }
    
    // Handle close button click
    if(closeBtn && searchInput) {
      closeBtn.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        searchInput.value = '';
        toggleCloseButton();
        closeCollapse();
      });
    }
    
    // Handle search input focus/click - open collapse
    if(searchInput && collapseEl) {
      searchInput.addEventListener('focus', function(){
        openCollapse();
        toggleCloseButton();
        startCleanupTimer();
      });
      
      searchInput.addEventListener('click', function(e){
        e.stopPropagation();
        openCollapse();
        toggleCloseButton();
        startCleanupTimer();
      });
      
      searchInput.addEventListener('input', function(){
        toggleCloseButton();
        // Keep open while typing
        if(collapseEl && !collapseEl.classList.contains('show')) {
          openCollapse();
        }
        startCleanupTimer();
      });
    }
    
    // Close on outside click
    document.addEventListener('click', function(e){
      if(!collapseEl) return;
      if(!collapseEl.classList.contains('show')) return;
      
      var target = e.target;
      var isClickInsideCollapse = collapseEl.contains(target);
      var isClickInSearchBar = searchBar && searchBar.contains(target);
      var isClickOnSearchInput = searchInput && (target === searchInput || searchInput.contains(target));
      
      if(!isClickInsideCollapse && !isClickInSearchBar && !isClickOnSearchInput) {
        closeCollapse();
      }
    });
    
    // Close on ESC key
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') {
        if(collapseEl && collapseEl.classList.contains('show')) {
          closeCollapse();
        }
        // Also close mobile overlay if open
        if(mobileOverlay && mobileOverlay.classList.contains('show')) {
          closeMobile();
        }
      }
    });
    
    // Mobile search functions
    function openMobile(){
      if(mobileOverlay) {
        mobileOverlay.classList.add('show');
        var mobileInput = qs('#mobile-search-main-input');
        if(mobileInput) mobileInput.focus();
      }
    }
    
    function closeMobile(){
      if(mobileOverlay) {
        mobileOverlay.classList.remove('show');
      }
    }
    
    if(mobileBtn) {
      mobileBtn.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        openMobile();
      });
    }
    
    if(mobileClose) {
      mobileClose.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        closeMobile();
      });
    }
    
    // Close mobile overlay when clicking outside
    if(mobileOverlay) {
      mobileOverlay.addEventListener('click', function(e){
        if(e.target === mobileOverlay) {
          closeMobile();
        }
      });
    }
    
    // Command list filtering (if exists)
    if(searchInput && commandList) {
      searchInput.addEventListener('input', function(){
        var term = (this.value || '').toLowerCase();
        qsa('.command-list-item', commandList).forEach(function(item){
          var nameEl = item.querySelector('.command-name');
          var descEl = item.querySelector('.command-desc');
          var name = nameEl ? nameEl.textContent.toLowerCase() : '';
          var desc = descEl ? descEl.textContent.toLowerCase() : '';
          var match = !term || name.indexOf(term) > -1 || desc.indexOf(term) > -1;
          item.style.display = match ? '' : 'none';
        });
      });
    }
    
    // Initial state - ensure collapse is closed on load
    if(collapseEl) {
      collapseEl.classList.remove('show');
    }
    if(closeBtn) {
      closeBtn.style.display = 'none';
    }
  }
  
  if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
  } else {
    initSearch();
  }
})();
