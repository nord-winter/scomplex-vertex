import { SR_COMPANY_ID, SR_API_TOKEN, SR_STATUS_ID, SR_PROJECT_ID } from '$env/static/private';

export async function POST({ request }) {
	try {
		const formData = await request.json();
        const headers = request.headers;
        const refererUri = headers.get('referer');
        const forwardedFor = headers.get('x-forwarded-for');
        const realIp = headers.get('x-real-ip');
        const socketIp = request.socket?.remoteAddress || '';

        formData.ip = forwardedFor?.split(',').shift().trim() || realIp || socketIp || '127.0.0.1';
        formData.refererUri = refererUri;

        console.log(formData);

		const srApiResponse = await salesRenderApi(formData);

		if (srApiResponse.success) {
			return new Response(
				JSON.stringify({
					success: true,
					message: 'Data sent to CRM successfully',
					data: srApiResponse.data
				}),
				{ status: 200 }
			);
		} else {
			return new Response(
				JSON.stringify({
					success: false,
					message: 'CRM processing failed',
					error: srApiResponse.error
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

async function salesRenderApi(formData) {
	try {
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
								firstName: formData.name || '',
								lastName: ''
							}
						}
					],
					emailFields: [
						{
							field: 'email',
							value: formData.email || ''
						}
					],
					phoneFields: [
						{
							field: 'phone',
							value: formData.phone || ''
						}
					],
					addressFields: [
						{
							field: 'adress', // your address field ID
							value: {
								postcode: formData.postcode || '',
								region: formData.province || '',
								city: formData.district || '',
								address_1: formData.address || ''
							}
						}
					]
				},
				cart: {
					items: [
						{
							itemId: parseInt(formData.productId, 10),
							quantity: 1,
							variation: 1
						}
					]
				},
				source: {
					refererUri: formData.refererUri || '',
					ip: formData.ip || ''
				}
			}
		};

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
