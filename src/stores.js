// src/stores.js
import { writable } from 'svelte/store';

export const selectedProduct = writable(null);

export const refStore = writable('');
