import { create } from "zustand"

export const Zustand = create(( set, get ) => ({
  sort: "market_cap", setSort: state => set({ sort: state }),
  coins: {}, setCoins: state => set({ coins: state }),
  detail: {}, setDetail: state => set({ detail: state }),
}))