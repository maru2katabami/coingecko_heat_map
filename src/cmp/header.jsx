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
      className="absolute top-0 p-5 pb-0 w-full flex items-center overflow-x-scroll">
      <div
        className="p-1 space-x-2 h-12 rounded-3xl bg-black/30 flex items-center">
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
        { detail.id &&
        <div
          className="px-1 space-x-3 h-10 rounded-3xl bg-white text-xl font-bold flex items-center">
          <div
            className="px-2 h-8 rounded-3xl bg-black text-xs text-white flex items-center">
            RANK { detail?.market_cap_rank }</div>
          <div
            className="size-8 bg-no-repeat bg-center bg-[size:100%]"
            style={{ backgroundImage: `url(${ detail?.image || "./favicon.ico"})`}}/>
          <div>{ detail?.symbol.toUpperCase()}</div>
          <div>${ Number( detail?.current_price )}</div>
          <div
            className={`${ detail?.price_change_percentage_24h >= 0 ? "text-green-500": "text-red-500"}`}
            >{ detail?.price_change_percentage_24h * 100 > 0 ? "+": ""}{ Math.floor( detail?.price_change_percentage_24h * 100 ) / 100 }%</div>
        </div>
        }
      </div>
    </div>
  )
}
