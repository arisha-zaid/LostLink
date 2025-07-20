
  document.addEventListener('DOMContentLoaded', function () {
    const clearBtn = document.getElementById('clearSearch');
    const searchInput = document.getElementById('searchInput');
    const searchForm = document.getElementById('searchForm');

    clearBtn.addEventListener('click', function (e) {
      e.preventDefault();

      // Clear the input
      searchInput.value = '';

      // Smooth reload of all items using redirection
      window.location.href = '/items';

      // OR if items are dynamically rendered via JS:
      // const itemList = document.querySelector('.lost-items-list');
      // itemList.classList.add('fade-glide');
      // Fetch and re-render full item list using AJAX (if needed)
    });
  });
