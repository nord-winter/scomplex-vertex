<script>
	// @ts-nocheck

	import FormInfo from '$lib/components/FormInfo.svelte';
	import FormAddress from '$lib/components/FormAddress.svelte';
	import { selectedProduct } from '../../stores';
	import { formInfoSchema, formAddressSchema } from '$lib/validation/formShema';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import productPhoto from '$lib/images/product.png';
	import photoFirstSet from '$lib/images/set_1.png';
	import photoSecondSet from '$lib/images/set_2.png';
	import photoThirdSet from '$lib/images/set_3.png';

	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters'

	export let data;

	if (!selectedProduct) {
		goto('/');
	}

	const CURRENCY_TYPE = 'THB';
	const steps = [zod(formInfoSchema), zod(formAddressSchema), 3];
	const { form, errors, message, enhance, validateForm, options } = superForm(data.form, {
		dataType: 'json',
		async onSubmit({ cancel, customRequest }) {
			if (step == steps.length) {
				return;
			} else cancel();

			const result = await validateForm({ update: true });

			if (result.valid) step = step + 1;
		},

		async onUpdated({ form }) {
			if (form.valid) step = 1;
		}
	});

	const images = {
		'36': photoFirstSet,
		'37': photoSecondSet,
		'38': photoThirdSet
	};

	let payload;
	let step = 1;
	let product = null;
	let isPayButtonEnabled = false;

	selectedProduct.subscribe((value) => {
		product = value;
	});

	$: selectedImage = product ? images[product.id] : '';
	$: options.validators = steps[step - 1];
	$: isPayButtonEnabled = step === 3 && document.getElementById('CheckPolicy').checked;

	function handlePayment() {
		OmiseCard.configure({
			publicKey: 'pkey_test_60441fm7b49zlzbf5ni'
		});

		OmiseCard.open({
			amount: product.price * 100,
			currency: CURRENCY_TYPE,
			defaultPaymentMethod: 'credit_card',
			otherPaymentMethods: 'promptpay, truemoney',
			onCreateTokenSuccess: (nonce) => {
				if (nonce.startsWith('tokn_')) {
					payload = {
						omiseToken: nonce,
						amount: product.price * 100,
						productId: product.id,
						...$form
					};
				} else {
					payload = {
						omiseSource: nonce,
						amount: product.price * 100,
						productId: product.id,
						...$form
					};
				}
				processPayment(payload);
			}
		});
	}
	/**
	 * @param {any} payload
	 */
	async function processPayment(payload) {
		try {
			const response = await fetch('/api/payment', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			if (response.ok) {
				const result = response.json();
				console.log('Payment Successful:', result);
				return response;
			} else {
				return response;
				console.error('Payment Failed:', response.status);
			}
		} catch (error) {
			return error;
			console.error('Error:', error);
		}
	}
</script>

<div class="container pt-5 pb-5">
	<div class="py-5 text-center">
		<h2>Checkout form</h2>
		<!-- <p class="lead">
			Below is an example form built entirely with Bootstrap’s form controls. Each required form
			group has a validation state that can be triggered by attempting to submit the form without
			completing it.
		</p> -->
		<!-- TODO Progress bar -->
	</div>
	<div class="row g-5">
		<div class="col-md-5 col-lg-4 order-md-last">
			<h4 class="d-flex justify-content-between align-items-center mb-3">
				<h3>Your cart</h3>
				<span class="badge bg-primary rounded-pill">{product.count}</span>
			</h4>

			<div class="card p-4">
				<div class="row m-2">
					<div class="col">
						<img
							src={selectedImage}
							class="card-img-top"
							alt="product img"
							style="width: 100px; hight: 100px;"
						/>
					</div>
					<div class="col">
						<h6 class="card-title"><b>{product.title}</b></h6>
						<!-- <small>
                            Some quick example text to build on the card title and make up the bulk of the card's
							content.
                        </small> -->
					</div>
				</div>

				<div class="border-top p-4 m-2 justify-content-between">
					<div class="row">
						<div class="col text-end">
							<div class="h6 text-body-tertiary">
								<strong
									>฿<s>{Math.round(Number(product.noDiscount) / Number(product.count))}</s></strong
								>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col text-start">รวม</div>
						<div class="col text-end">
							<div class="h6">
								<strong>฿{Math.round(Number(product.price) / Number(product.count))}</strong>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col text-start">ปริมาณ</div>
						<div class="col text-end">
							<div class="h6"><strong>{product.count}</strong></div>
						</div>
					</div>
				</div>
				<!-- Total -->

				<div class="row border-top border-bottom p-4 m-2 justify-content-between">
					<div class="col text-start h5">ราคารวม</div>
					<div class="col text-end">
						<div class="h5"><strong>฿{product.price}</strong></div>
					</div>
					<div class="row text-body-tertiary">
						<div class="text-end">
							<div class="h6"><strong>฿<s>{product.noDiscount}</s></strong></div>
						</div>
					</div>
				</div>
				<form action="">
					<div class="form-check p-4">
						<input
							class="form-check-input"
							type="checkbox"
							value=""
							id="CheckPolicy"
							on:change={() =>
								(isPayButtonEnabled = step === 3 && document.getElementById('CheckPolicy').checked)}
						/>
						<label class="form-check-label" for="CheckPolicy">
							ฉันยอมรับ <a href="#">ข้อตกลงและเงื่อนไข</a> และ <a href="#">นโยบายความเป็นส่วนตัว</a>
						</label>
					</div>
					<input type="hidden" name="omiseToken" />
					<input type="hidden" name="omiseSource" />
					<button
						type="button"
						id="checkoutButton"
						class="btn cta-btn btn-lg"
						disabled={!isPayButtonEnabled}
						on:click={handlePayment}>Pay</button
					>
				</form>
			</div>
		</div>

		<div class="col-md-7 col-lg-8">
			<h4 class="d-flex justify-content-between align-items-center mb-3">
				<h3>กรุณากรอกแบบฟอร์ม</h3>
			</h4>
			{#if $message}
				<div class="status" class:error={$page.status >= 400} class:success={$page.status == 200}>
					{$message}
				</div>
			{/if}
			<div class="card p-4 pt-5">
				<form class="form-container" method="POST" use:enhance>
					{#if step === 1}
						<FormInfo {form} {errors} />
					{/if}
					{#if step === 2}
						<FormAddress {form} {errors} />
					{/if}
					{#if step === 3}
						<div class="order">
							<h3>Order details:</h3>
							<ul>
								<li><strong>Name:</strong> {$form.name}</li>
								<li><strong>Email:</strong> {$form.email}</li>
								<li><strong>Phone:</strong> {$form.phone}</li>
								<li><strong>City:</strong> {$form.city}</li>
								<li><strong>Address:</strong> {$form.address}</li>
								<li><strong>District:</strong> {$form.district}</li>
								<li><strong>Province:</strong> {$form.province}</li>
								<li><strong>Postcode:</strong> {$form.postcode}</li>
							</ul>
						</div>
					{/if}
				</form>
			</div>
		</div>

		<!-- <MultiStepForm {data} /> -->
	</div>
</div>
