"use client"
import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';

const store = (set) => ({
    pubkey : "",
    privKey : null,
    setPubKey : (key) => set({pubKey: key}),
    setPrivKey : (key) => set({privKey: key})
})

const log = (config) => (set, get, api) =>
  config(
    (...args) => {
      console.log(args);
      set(...args);
    },
    get,
    api
  );

  

export const useStore = create(
    subscribeWithSelector(log(persist(devtools(store), { name: 'store' })))
  );
  