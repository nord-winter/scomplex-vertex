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
<!-- Yandex.Metrika counter -->
<script type="text/javascript" >
   (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();
   for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
   k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

   ym(98461054, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
   });
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/98461054" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex.Metrika counter -->
</main>
