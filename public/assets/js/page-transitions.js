// Page Transitions JavaScript
class PageTransitions {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.addTransitionClasses();
    this.showLoadingSpinner();
  }

  setupEventListeners() {
    // Intercept semua link navigasi
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && this.shouldAnimate(link)) {
        e.preventDefault();
        this.navigateWithTransition(link.href);
      }
    });

    // Intercept form submissions
    document.addEventListener('submit', (e) => {
      if (e.target.tagName === 'FORM') {
        this.showLoadingSpinner();
      }
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
      this.handlePageLoad();
    });

    // Handle page load completion
    window.addEventListener('load', () => {
      this.handlePageLoad();
    });

    // Handle DOM content loaded
    document.addEventListener('DOMContentLoaded', () => {
      this.handlePageLoad();
    });
  }

  shouldAnimate(link) {
    // Jangan animasi untuk link eksternal, anchor links, atau link dengan target="_blank"
    const href = link.getAttribute('href');
    const target = link.getAttribute('target');
    
    return href && 
           !href.startsWith('#') && 
           !href.startsWith('mailto:') && 
           !href.startsWith('tel:') && 
           !href.startsWith('javascript:') && 
           target !== '_blank' && 
           !link.classList.contains('no-transition');
  }

  navigateWithTransition(url) {
    // Tambahkan class exit untuk animasi keluar
    document.body.classList.add('page-exit');
    
    // Tampilkan loading spinner
    this.showLoadingSpinner();

    // Delay sebelum navigasi untuk animasi exit
    setTimeout(() => {
      window.location.href = url;
    }, 300);
  }

  handlePageLoad() {
    // Sembunyikan loading spinner
    this.hideLoadingSpinner();
    
    // Hapus class exit
    document.body.classList.remove('page-exit');
    
    // Tambahkan class enter untuk animasi masuk
    document.body.classList.add('page-transition');
    
    // Hapus class enter setelah animasi selesai
    setTimeout(() => {
      document.body.classList.remove('page-transition');
    }, 600);

    // Animate elements with stagger effect
    this.animateElements();
  }

  animateElements() {
    // Animate cards
    const cards = document.querySelectorAll('.card-hover, .bg-white.rounded-2xl, .bg-white.rounded-lg');
    cards.forEach((card, index) => {
      card.classList.add('stagger-animation');
      card.style.animationDelay = `${index * 0.1}s`;
    });

    // Animate buttons
    const buttons = document.querySelectorAll('button, .btn, input[type="submit"]');
    buttons.forEach(button => {
      button.classList.add('button-transition');
    });

    // Animate links
    const links = document.querySelectorAll('a');
    links.forEach(link => {
      link.classList.add('link-transition');
    });

    // Animate icons
    const icons = document.querySelectorAll('i, .fas, .far, .fab');
    icons.forEach(icon => {
      icon.classList.add('icon-transition');
    });

    // Animate images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.classList.add('image-transition');
    });

    // Animate form elements
    const formElements = document.querySelectorAll('input, select, textarea');
    formElements.forEach(element => {
      element.classList.add('form-transition');
    });

    // Animate table rows
    const tableRows = document.querySelectorAll('tr');
    tableRows.forEach((row, index) => {
      row.classList.add('table-row-transition');
      row.style.animationDelay = `${index * 0.05}s`;
    });

    // Animate sidebar items
    const sidebarItems = document.querySelectorAll('.sidebar a, .sidebar li');
    sidebarItems.forEach(item => {
      item.classList.add('sidebar-transition');
    });

    // Animate badges
    const badges = document.querySelectorAll('.badge, .status-badge, .tag');
    badges.forEach(badge => {
      badge.classList.add('badge-transition');
    });

    // Animate progress bars
    const progressBars = document.querySelectorAll('.progress-bar, .w-full.bg-gray-200');
    progressBars.forEach(bar => {
      bar.classList.add('progress-transition');
    });

    // Animate search inputs
    const searchInputs = document.querySelectorAll('input[type="search"], .search-input');
    searchInputs.forEach(input => {
      input.classList.add('search-transition');
    });

    // Animate upload areas
    const uploadAreas = document.querySelectorAll('.upload-area, .file-upload');
    uploadAreas.forEach(area => {
      area.classList.add('upload-transition');
    });

    // Animate charts and graphs
    const charts = document.querySelectorAll('.chart, .graph, .statistics');
    charts.forEach(chart => {
      chart.classList.add('chart-transition');
    });

    // Animate alerts and notifications
    const alerts = document.querySelectorAll('.alert, .notification, .message');
    alerts.forEach(alert => {
      alert.classList.add('alert-transition');
    });

    // Animate breadcrumbs
    const breadcrumbs = document.querySelectorAll('.breadcrumb, .breadcrumb-item');
    breadcrumbs.forEach(breadcrumb => {
      breadcrumb.classList.add('breadcrumb-transition');
    });

    // Animate pagination
    const paginationItems = document.querySelectorAll('.pagination a, .pagination li');
    paginationItems.forEach(item => {
      item.classList.add('pagination-transition');
    });

    // Animate tooltips
    const tooltips = document.querySelectorAll('.tooltip, [title]');
    tooltips.forEach(tooltip => {
      tooltip.classList.add('tooltip-transition');
    });

    // Animate dropdowns
    const dropdowns = document.querySelectorAll('.dropdown, .dropdown-menu');
    dropdowns.forEach(dropdown => {
      dropdown.classList.add('dropdown-transition');
    });

    // Animate modals
    const modals = document.querySelectorAll('.modal, .modal-content');
    modals.forEach(modal => {
      modal.classList.add('modal-transition');
    });

    // Animate floating elements
    const floatingElements = document.querySelectorAll('.floating, .floating-icon');
    floatingElements.forEach(element => {
      element.classList.add('floating-transition');
    });

    // Animate pulse elements
    const pulseElements = document.querySelectorAll('.pulse, .pulse-icon');
    pulseElements.forEach(element => {
      element.classList.add('pulse-transition');
    });

    // Animate circle elements
    const circleElements = document.querySelectorAll('.circle, .circle-icon');
    circleElements.forEach(element => {
      element.classList.add('circle-transition');
    });
  }

  addTransitionClasses() {
    // Tambahkan class transisi ke body
    document.body.classList.add('page-transition');
    
    // Tambahkan class transisi ke main content
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.classList.add('page-transition');
    }

    // Tambahkan class transisi ke sidebar
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.classList.add('sidebar-transition');
    }
  }

  showLoadingSpinner() {
    // Buat loading spinner jika belum ada
    if (!document.getElementById('loading-spinner')) {
      const spinner = document.createElement('div');
      spinner.id = 'loading-spinner';
      spinner.className = 'loading-spinner';
      spinner.innerHTML = `
        <div class="spinner"></div>
        <p class="mt-3 text-gray-600 font-medium">Memuat...</p>
      `;
      document.body.appendChild(spinner);
    }

    // Tampilkan spinner
    const spinner = document.getElementById('loading-spinner');
    spinner.classList.add('show');
  }

  hideLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
      spinner.classList.remove('show');
    }
  }

  // Method untuk animasi khusus
  animateElement(element, animationClass) {
    element.classList.add(animationClass);
    setTimeout(() => {
      element.classList.remove(animationClass);
    }, 1000);
  }

  // Method untuk shake animation (untuk error)
  shakeElement(element) {
    this.animateElement(element, 'shake-transition');
  }

  // Method untuk bounce animation (untuk success)
  bounceElement(element) {
    this.animateElement(element, 'bounce-transition');
  }

  // Method untuk pulse animation (untuk loading)
  pulseElement(element) {
    this.animateElement(element, 'pulse-transition');
  }

  // Method untuk slide animation
  slideElement(element) {
    this.animateElement(element, 'slide-transition');
  }

  // Method untuk zoom animation
  zoomElement(element) {
    this.animateElement(element, 'zoom-transition');
  }

  // Method untuk flip animation
  flipElement(element) {
    this.animateElement(element, 'flip-transition');
  }

  // Method untuk elastic animation
  elasticElement(element) {
    this.animateElement(element, 'elastic-transition');
  }
}

// Initialize page transitions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.pageTransitions = new PageTransitions();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PageTransitions;
} 