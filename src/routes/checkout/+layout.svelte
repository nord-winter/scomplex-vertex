<script>
	import CheckoutHeader from '$lib/components/CheckoutHeader.svelte';
	import ToggleScroll from '$lib/components/ToggleScroll.svelte';
	import Footer from '$lib/components/Footer.svelte';
    import scriptSrc from 'bootstrap/dist/js/bootstrap.bundle.js?url';
</script>

<svelte:head>
	<script src={scriptSrc}></script>
</svelte:head>
<CheckoutHeader />
<slot />


