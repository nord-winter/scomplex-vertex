<script>
	// @ts-nocheck
	import productPhoto from '$lib/images/product.png';
	import photoFirstSet from '$lib/images/set_1.png';
	import photoSecondSet from '$lib/images/set_2.png';
	import photoThirdSet from '$lib/images/set_3.png';
	import FormInfo from '$lib/components/FormInfo.svelte';
	import FormAddress from '$lib/components/FormAddress.svelte';
	import { selectedProduct } from '../../stores';
	import { formInfoSchema, formAddressSchema } from '$lib/validation/formShema';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { PUBLIC_OPN_KEY, PUBLIC_CURRENCY_TYPE } from '$env/static/public';
	import { onMount } from 'svelte';
	import { superForm } from '/node_modules/sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';

	export let data;

	const steps = [zod(formInfoSchema), zod(formAddressSchema), 3];
	const { form, errors, message, enhance, validateForm, options } = superForm(data.form, {
		dataType: 'json',
		async onSubmit({ cancel, customRequest }) {
			if (step == steps.length) {
				return;
			} else cancel();

			const result = await validateForm({ update: true });
			if (result.valid) {
				if (step == 2) {
					$form.productId = product.id;
					const crmResponse = await crmRequest($form);

					if (crmResponse.success) {
						step = step + 1;
					} else {
						errors.push(crmResponse.errors || crmResponse.message);
					}
				} else {
					step = step + 1;
				}
			}
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
	let selectedImage = '';

	let qr_link = '';
	let modalVisible = true;
	let modalElement;
	let modal;

	selectedProduct.subscribe((value) => {
		product = value;
		if (product) {
			selectedImage = images[product.id] || '';
		}
	});

	onMount(() => {
		if (!product) {
			const storedProduct = localStorage.getItem('selectedProduct');
			if (storedProduct) {
				product = JSON.parse(storedProduct);
				selectedImage = images[product.id] || '';
			} else {
				goto('/');
			}
		}
		if (modalElement) {
			const bootstrapModal = new bootstrap.Modal(modalElement);
		}
	});

	$: {
		if (qr_link) {
			const bootstrapModal = new bootstrap.Modal(modalElement);
			bootstrapModal.show();
			console.log(bootstrapModal);
			console.log(qr_link);
		}
	}

	$: options.validators = steps[step - 1];
	$: isPayButtonEnabled = step === 3 && document.getElementById('CheckPolicy')?.checked;

	async function handlePayment() {
		OmiseCard.configure({
			publicKey: PUBLIC_OPN_KEY
		});

		OmiseCard.open({
			amount: product.price * 100,
			currency: PUBLIC_CURRENCY_TYPE,
			defaultPaymentMethod: 'credit_card',
			otherPaymentMethods: 'promptpay, truemoney',
			onCreateTokenSuccess: async (nonce) => {
				if (nonce.startsWith('tokn_')) {
					payload = {
						omiseToken: nonce,
						amount: product.price * 100,
						productId: product.id,
						currency: PUBLIC_CURRENCY_TYPE,
						...$form
					};
				} else {
					payload = {
						omiseSource: nonce,
						type: 'promptpay',
						amount: product.price * 100,
						productId: product.id,
						currency: PUBLIC_CURRENCY_TYPE,
						...$form
					};
				}
				const paymentResult = await processPayment(payload);

				if (paymentResult.success && paymentResult.authorize_uri) {
					window.location.href = paymentResult.authorize_uri;
				} else if (paymentResult.success && paymentResult.qr_code_uri) {
					qr_link = paymentResult.qr_code_uri;
				} else {
					console.error('Error during payment:', paymentResult);
				}
			}
		});
	}

	async function crmRequest(formData) {
		try {
			const response = await fetch('/api/crm', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});
			const result = await response.json();
			if (response.ok) {
				const orderId = result.data.orderMutation.addOrder.id;
				localStorage.setItem('orderId', orderId);
				return {
					success: true,
					data: result
				};
			} else {
				return { success: false, errors: result.errors };
			}
		} catch (error) {
			return { success: false, message: 'Failed Network' + error };
		}
	}

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
				const result = await response.json();
				console.log('Payment Successful:', result);
				return result;
			} else {
				console.error('Payment Failed:', response.status);
				return response;
			}
		} catch (error) {
			console.error('Error:', error);
			return error;
		}
	}

	function downloadQRCode() {
		const link = document.createElement('a');
		link.href = qr_link;
		link.download = 'qrcode.png';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
</script>

<!-- // TODO: Topbar -->
<div bind:this={modalElement} class="modal fade" tabindex="-1" role="dialog" id="modalQR">
	<div class="modal-dialog modal-dialog-centered" role="document">
		<div class="modal-content rounded-4 shadow">
			<div class="modal-body p-5">
				<div id="omise-promptpay-qrcode">
					<img alt="Omise PromptPay QR Code" src={qr_link} />
				</div>
				<button type="button" class="btn btn-lg btn-success mt-3 w-100" on:click={downloadQRCode}>
					Download QR-code
				</button>
				<button type="button" class="btn btn-lg btn-danger mt-5 w-100" data-bs-dismiss="modal">
					Close
				</button>
			</div>
		</div>
	</div>
</div>

<div class="container pt-5 pb-5 mt-5">
	<div class="py-5 text-center">
		<h2>Checkout form</h2>
	</div>
	{#if product}
		<div class="row g-5">
			<div class="col-md-5 col-lg-4 order-md-last">
				<h4 class="d-flex justify-content-between align-items-center mb-3">
					<h3>Your cart</h3>
					<span class="badge dark-background rounded-pill">{product.count}</span>
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
						</div>
					</div>

					<div class="border-top p-4 m-2 justify-content-between">
						<div class="row">
							<div class="col text-end">
								<div class="h6 text-body-tertiary">
									<strong
										>฿<s>{Math.round(Number(product.noDiscount) / Number(product.count))}</s
										></strong
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
									(isPayButtonEnabled =
										step === 3 && document.getElementById('CheckPolicy').checked)}
							/>
							<label class="form-check-label" for="CheckPolicy">
								ฉันยอมรับ <a href="/privacy">ข้อตกลงและเงื่อนไข</a> และ
								<a href="/privacy">นโยบายความเป็นส่วนตัว</a>
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
		</div>
	{:else}
		<p>
			Продукт не выбран или отсутствует. Пожалуйста, вернитесь на главную страницу и выберите
			продукт.
		</p>
	{/if}
</div>
