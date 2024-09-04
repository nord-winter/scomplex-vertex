import { redirect, fail } from '@sveltejs/kit';
import { z } from 'zod';
import { formAddressSchema as lastStep } from '$lib/validation/formShema.js';

export const load = async () => {
	const form = {
		name: '',
		email: '',
		phone: '',
		city: '',
		address: '',
		district: '',
		province: '',
		postcode: ''
	};


	// if (!form) {
	// 	throw redirect(307, '/');
	// }

	return { form };
};

export const actions = {
	default: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData());

		const validationResult = lastStep.safeParse(formData);

		if (!validationResult.success) {
			const errors = validationResult.error.flatten().fieldErrors;
			return fail(400, { form: formData, errors });
		}

		return {
			status: 200,
			body: {
				form: formData,
				message: 'Form posted successfully!'
			}
		};
	}
};
