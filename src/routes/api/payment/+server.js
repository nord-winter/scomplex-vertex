import omiseModule from 'omise';
import { SECRET_KEY } from '$env/static/private';

const omise = omiseModule({
	secretKey: SECRET_KEY
});

const SR_COMPANY_ID = '54';
const SR_API_TOKEN =
	'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2RlLmJhY2tlbmQuc2FsZXNyZW5kZXIuY29tLyIsImF1ZCI6IkNSTSIsImp0aSI6ImUzMjhhMjkwMTZhMDRhODQ5NDRiZGFlOWE3ZDM2ZDQxIiwiaWF0IjoxNzIxMTkyMTE4LCJ0eXBlIjoiYXBpIiwiY2lkIjoiNTQiLCJyZWYiOnsiYWxpYXMiOiJBUEkiLCJpZCI6IjIifX0.3TrkHOL42Z9c_flGBuPi8nymoSQk2Hm39-NbUuRUsxA';
const SR_STATUS_ID = '19';
const SR_PROJECT_ID = '3';

export async function POST({ request }) {
	try {
		const payload = await request.json();

		const headers = request.headers;
		
		const refererUri = headers.get('referer');

		const forwardedFor = headers.get('x-forwarded-for');
		const realIp = headers.get('x-real-ip');
		const socketIp = request.socket?.remoteAddress || '';

		payload.ip = forwardedFor?.split(',').shift().trim() || realIp || socketIp || '';


		// payload.ip = ip.length == 0 ? null : ip;
		payload.refererUri = refererUri;

		console.log(request);

		const paymentResult = await processPayment(payload);
		const srApiResponse = await salesRenderApi(payload);

		if (paymentResult.success && srApiResponse.success) {
			return new Response(
				JSON.stringify({
					success: true,
					message: 'Payment and CRM processing successfully completed',
					data: {
						paymentData: paymentResult.data,
						srApiData: srApiResponse.data
					}
				}),
				{ status: 200 }
			);
		} else {
			return new Response(
				JSON.stringify({
					success: false,
					message: 'Payment or CRM processing failed',
					error: {
						paymentError: paymentResult.error,
						srApiError: srApiResponse.error
					}
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
			card: payload.omiseToken
		});

		return {
			success: true,
			data: { transactionId: charge.id, amount: payload.amount, charge: charge }
		};
	} else if (payload.amount > 0 && payload.omiseSource) {
		const charge = await omise.charges.create({
			amount: payload.amount,
			currency: 'THB',
			source: payload.omiseSource
		});
		return {
			success: true,
			data: { transactionId: charge.id, amount: payload.amount, charge: charge }
		};
	} else {
		return { success: false, error: 'Invalid payment details' };
	}
}

async function salesRenderApi(payload) {
	try {

		payload.phone = formatPhoneNumber(payload.phone);

		const query = `
			mutation ($input: AddOrderInput!) {
				orderMutation {
					addOrder(input: $input) {
						id
					}
				}
			}
		`;

		const variables = {
			input: {
				statusId: SR_STATUS_ID,
				projectId: SR_PROJECT_ID,
				orderData: {
					humanNameFields: [
						{
							field: 'name1',
							value: {
								firstName: payload.name || '',
								lastName: '' 
							}
						}
					],
					phoneFields: [
						{
							field: 'phone',
							value: payload.phone || ''
						}
					],
					addressFields: [
						{
							field: 'adress', // your address field ID
							value: {
								postcode: payload.postcode || '',
								region: payload.province || '',
								city: payload.district || '',
								address_1: payload.address || ''
							}
						}
					]
				},
				cart: {
					items: [
						{
							itemId: parseInt(payload.productId, 10),
							quantity: 1,
							variation: 1,
							price: parseInt(payload.price, 10) || 0
						}
					]
				},
				source: {
					refererUri: payload.refererUri || '',
					ip: payload.ip || ''
				}
			}
		};

		// HTTP клиент для отправки данных в CRM
		const response = await fetch(
			'https://de.backend.salesrender.com/companies/' +
				SR_COMPANY_ID +
				'/CRM?token=' +
				SR_API_TOKEN,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					query,
					variables
				})
			}
		);

		const result = await response.json();

		if (result.errors) {
			throw new Error('CRM Error: ' + JSON.stringify(result.errors));
		}

		return { success: true, data: result.data };
	} catch (error) {
		return { success: false, error: error.message };
	}
}

function formatPhoneNumber(phone) {
	
	if (phone.startsWith('+66')) {
		
		phone = phone.slice(3);

		
		return '0' + phone;
	}
	return phone;
}
