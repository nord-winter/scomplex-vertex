<script>
	import { onMount } from 'svelte';
	import IMask from 'imask';

	export let form;
	export let errors;

	/**
	 * @type {import("imask").InputMaskElement}
	 */
	let phoneInput;


	onMount(() => {
		const maskOptions = {
			mask: '+66000000000',
            lazy: true,

		};
		IMask(phoneInput, maskOptions);
	});

</script>

<div class="step step-info">
	<h3>Info</h3>
	<div class="mb-3">
		<label for="name" class="form-label">Name</label>
		<input
			type="text"
			class="form-control"
			id="name"
			name="name"
			aria-invalid={$errors.name ? 'true' : undefined}
            placeholder="John"
			bind:value={$form.name}
		/>
		{#if $errors.name}
			<div class="invalid-feedback">Invalid name format</div>
		{/if}
	</div>
	<div class="mb-3">
		<label for="email" class="form-label">Email</label>
		<input
			type="email"
			class="form-control {$errors.email ? 'is-invalid' : ''}"
			id="email"
			name="email"
            placeholder="example@example.com"
			bind:value={$form.email}
		/>
		{#if $errors.email}
			<div class="invalid-feedback">Invalid email format</div>
		{/if}
	</div>
	<div class="mb-3">
		<label for="phone" class="form-label">Phone</label>
		<input
			type="text"
			class="form-control {$errors.phone ? 'is-invalid' : ''}"
			id="phone"
			name="phone"
            placeholder="+66001234567"
			bind:value={$form.phone}
			bind:this={phoneInput}
		/>
		{#if $errors.phone}
			<div class="invalid-feedback">Invalid phone format</div>
		{/if}
	</div>
	<div class="d-flex justify-content-between mt-4">
		<button class="btn cta-btn"> Next </button>
	</div>
</div>
