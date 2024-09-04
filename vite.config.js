import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
    	rollupOptions: {
      		external: [
        		'sveltekit-superforms/adapters' // Указываем внешний модуль
      		]
    	}
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
