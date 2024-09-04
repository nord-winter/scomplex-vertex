<script>
  import { onMount } from 'svelte';

  let isActive = false;

  function toggleScrollTop() {
    isActive = window.scrollY > 100;
  }

  function scrollToTop(event) {
    event.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  onMount(() => {
    window.addEventListener('scroll', toggleScrollTop);
    toggleScrollTop(); // Проверка при загрузке страницы

    return () => {
      window.removeEventListener('scroll', toggleScrollTop);
    };
  });
</script>

<a
  href="#"
  class="scroll-top d-flex align-items-center justify-content-center {isActive ? 'active' : ''}"
  on:click={scrollToTop}
>
  <i class="bi bi-arrow-up-short"></i>
</a>

<style>
  .scroll-top {
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
  }

  .scroll-top.active {
    opacity: 1;
    visibility: visible;
  }
</style>
