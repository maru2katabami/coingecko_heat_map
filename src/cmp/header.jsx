import React, { useEffect, useState } from "react"
import { Zustand } from "@/lib/zustand"

export const Header = () => {

  const [ category, setCategory ] = useState("layer-1")
  const [ categories, setCategories ] = useState( null )

  const { setSort, setCoins, detail, setDetail } = Zustand()

  const handleCategories = async () => {
    const res = await fetch("https://api.coingecko.com/api/v3/coins/categories")
    const data = await res.json()
    data.sort(( a, b ) => b.total_volume - a.total_volume )
    setCategories( data )
  }

  const handleCoins = async ( id ) => {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=${ id }&order=market_cap_desc&per_page=250&page=1&sparkline=false`)
    const data = await res.json()
    data.sort(( a, b ) => b.total_volume - a.total_volume )
    const mcap = data.reduce(( sum, coin ) => sum + coin.market_cap, 0 )
    setCoins({ data, mcap })
  }
  
  useEffect(() => {
    handleCategories()
    handleCoins( category )
  }, [])

  return (
    <div
      className="absolute top-0 p-5 pb-0 w-full flex justify-center items-center pointer-events-none">
      <div
        className="p-1 space-x-2 w-96 rounded-3xl bg-black/60 flex flex-wrap justify-between items-center">
        <div
          className="px-2 h-10 rounded-3xl bg-white flex items-center">
          <select
            className="text-center text-xs font-bold"
            value={ category }
            onChange={ event => {
              handleCoins( event.target.value )
              setCategory( event.target.value )
              setDetail({})
            }}>
            { categories?.map( item => (
            <option key={ item.id } value={ item.id }>{ item.name }</option>
            ))}
          </select>
        </div>
        <div
          className="px-2 h-10 rounded-3xl bg-white flex items-center">
          <select
            className="text-center text-xs font-bold"
            onChange={ event => setSort( event.target.value )}>
            <option value="market_cap">Market Cap</option>
            <option value="total_volume">Tatal Volume</option>
          </select>
        </div>
        { detail.name &&
        <div
          className=" py-2 space-x-2 space-y-2 w-full">
          <div
            className="space-x-2 space-y-2 w-full flex flex-wrap justify-around items-center">
            <div
              className="size-10 bg-no-repeat bg-center bg-[size:100%]"
              style={{ backgroundImage: `url(${ detail.image })`}}/>
            <div
              className="text-3xl font-bold text-white">
              { detail.name }
            </div>
            <div
              className="text-3xl text-white font-bold flex-shrink-0">
              { detail.symbol.toUpperCase()}
            </div>
          </div>
          <div
            className="p-1 font-bold text-white">
            {`RANK : ${ detail.market_cap_rank }`}
          </div>
          <div
            className="p-1 font-bold text-white flex">
            {`PRICE : $${ Number( detail.current_price ).toLocaleString()}`}
            <div
              className={`${ detail.market_cap_change_percentage_24h >= 0 ? "text-green-500": "text-red-500"}`}>
              { `${ detail.market_cap_change_percentage_24h >= 0 ? "▲": "▼"}${ detail.market_cap_change_percentage_24h }%`}
            </div>
          </div>
          <div
            className="p-1 font-bold text-white">
            {`VOLUME : $${ Number( detail.total_volume ).toLocaleString()}`}
          </div>
          <div
            className="p-1 text-xs text-white">
            {`LAST_UPDATE_${ new Date( detail.last_updated ).toLocaleString()}`}
          </div>
          <div
            className="text-xs text-white/30">
            Long press to jump to CoinGecko page
          </div>
          <div
            className="w-[calc(100%-40px)] h-[100px] bg-white pointer-events-auto">

          </div>
        </div>
        }
      </div>
    </div>
  )
}
