import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
    	rollupOptions: {
      		external: [
				'sveltekit-superforms',
        		'sveltekit-superforms/dist/adapters',
      		]
    	}
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
