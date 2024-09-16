import omiseModule from 'omise';
import { OPN_SECRET_KEY } from '$env/static/private';
import { PUBLIC_OPN_KEY } from '$env/static/public';

const LIVEMODE = true;
const omise = omiseModule({
	secretKey: OPN_SECRET_KEY,
	publicKey: PUBLIC_OPN_KEY
});

export async function POST({ request }) {
	try {
		const host = request.headers.get('origin') || '';
		const payload = await request.json();
		payload.host = host + '/thanks';
		const paymentResult = await processPayment(payload);

		if (paymentResult.success) {

			return new Response(
				JSON.stringify({
					success: true,
					message: 'Payment processed successfully',
					data: paymentResult.data,
					qr_code_uri: paymentResult.qr_code_uri,
					authorize_uri: paymentResult.authorize_uri
				}),
				{ status: 200 }
			);
		} else {
			return new Response(
				JSON.stringify({
					success: false,
					message: 'Payment failed',
					error: paymentResult.error
				}),
				{ status: 400 }
			);
		}
	} catch (error) {
		return new Response(
			JSON.stringify({ success: false, message: 'Server error', error: error.message }),
			{ status: 500 }
		);
	}
}

async function processPayment(payload) {
	if (payload.amount > 0 && payload.omiseToken) {
		const charge = await omise.charges.create({
			amount: payload.amount,
			currency: payload.currency,
			card: payload.omiseToken,
			return_uri: payload.host,
			livemode: LIVEMODE
		});

		return {
			success: true,
			data: { transactionId: charge.id, amount: payload.amount, charge: charge },
			authorize_uri: charge.authorize_uri
		};
	} else if (payload.amount > 0 && payload.omiseSource) {
		const source = {
			type: payload.type || 'promptpay',
			barcode: payload.type || 'promptpay',
			amount: payload.amount,
			currency: payload.currency,
			livemode: LIVEMODE
		};

		const resSource = await omise.sources.create(source);
		const charge = await omise.charges.create({
			amount: payload.amount,
			currency: payload.currency,
			source: resSource.id,
			livemode: LIVEMODE
		});
		return {
			success: true,
			data: {
				transactionId: charge.id,
				amount: payload.amount,
				charge: charge
			},
			qr_code_uri: charge.source?.scannable_code.image.download_uri
		};
	} else {
		return { success: false, error: 'Invalid payment details' };
	}
}
