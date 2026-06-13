import { createStore } from 'jotai';

// Single Jotai store instance for the mobile app. The <Providers> tree and
// non-React code (http-client interceptors) read and write through it.
export const jotaiStore = createStore();
