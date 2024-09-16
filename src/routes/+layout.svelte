<script>
	import 'bootstrap/dist/css/bootstrap.min.css';
	import '$lib/vendor/bootstrap-icons/bootstrap-icons.css';
	import 'aos/dist/aos.css';
	// @ts-ignore
	import AOS from 'aos';
	import '$lib/vendor/glightbox/css/glightbox.min.css';
	import '$lib/vendor/swiper/swiper-bundle.min.css';
	import '$lib/vendor/theme-bootlander/main.css';
	import '$lib/vendor/custom/style.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import scriptSrc from 'bootstrap/dist/js/bootstrap.bundle.js?url';
	import Header from '$lib/components/Header.svelte';
	import ToggleScroll from '$lib/components/ToggleScroll.svelte';
	import Footer from '$lib/components/Footer.svelte';

	onMount(async () => {
		// @ts-ignore
		const theme_js = await import('$lib/vendor/theme-bootlander/main.js');
		// @ts-ignore
		const glightbox = await import('$lib/vendor/glightbox/js/glightbox.min.js');
		// @ts-ignore
		const purecounter_vanilla = await import('$lib/vendor/purecounter/purecounter_vanilla.js');
		// @ts-ignore
		const swiper = await import('$lib/vendor/swiper/swiper-bundle.min.js');

		AOS.init({
			duration: 1000,
			once: true
		});
	});
</script>

<svelte:head>
	<script src={scriptSrc}></script>
</svelte:head>
<main class="main">
	{#if !$page.url.pathname.startsWith('/checkout')}
		<Header />
	{/if}
	<slot />
	<ToggleScroll />
	<Footer />
</main>
