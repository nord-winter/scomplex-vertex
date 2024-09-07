import omiseModule from 'omise';
import { OPN_SECRET_KEY } from '$env/static/private';
import { BASE_URL } from '$env/static/private'; 

const LIVEMODE = false;
const omise = omiseModule({
	secretKey: OPN_SECRET_KEY
});


export async function POST({ request }) {
	try {
		const payload = await request.json();
		const paymentResult = await processPayment(payload);

		if (paymentResult.success) {
			return new Response(
				JSON.stringify({
					success: true,
					message: 'Payment processed successfully',
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
			currency: 'THB',
			card: payload.omiseToken,
			return_uri: `${BASE_URL}/`,
			livemode: LIVEMODE
		});

		return {
			success: true,
			data: { transactionId: charge.id, amount: payload.amount, charge: charge },
      		authorize_uri: charge.authorize_uri
		};

		// TODO SOURCE
	} else if (payload.amount > 0 && payload.omiseSource) {
		const charge = await omise.charges.create({
			amount: payload.amount,
			currency: 'THB',
			source: payload.omiseSource,
			livemode: LIVEMODE
		});
		return {
			success: true,
			data: { transactionId: charge.id, amount: payload.amount, charge: charge },
			authorize_uri: charge.authorize_uri
		};
	} else {
		return { success: false, error: 'Invalid payment details' };
	}
}
