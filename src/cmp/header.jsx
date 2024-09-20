import React, { useEffect, useState } from "react"
import { Zustand } from "@/lib/zustand"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

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
    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=${ id }&order=market_cap_desc&per_page=250&page=1&sparkline=false`)
      const data = await res.json()
      data.sort(( a, b ) => b.total_volume - a.total_volume )
      const mcap = data.reduce(( sum, coin ) => sum + coin.market_cap, 0 )
      setCoins({ data, mcap })
    } catch ( err ) {
      toast.error("Traffic is high. Please retry after this message disappears.", {
        position: "top-right",
        autoClose: 60000,
        // hideProgressBar: true,
        closeButton: false,
        theme: "light",
      })
    }
  }
  
  useEffect(() => {
    handleCategories()
    handleCoins( category )
  }, [])

  return (
    <div className="absolute top-0 pt-7 w-full flex justify-center items-center pointer-events-none overflow-visible">
      <div className="p-1 w-[370px] rounded-3xl bg-black/80 flex flex-wrap justify-between items-center overflow-visible">
        <div className="px-2 h-10 rounded-3xl bg-white flex items-center pointer-events-auto">
          <select
            className="h-full text-center text-xs hover:text-blue-500 font-bold"
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
        <div className="px-2 h-10 rounded-3xl bg-white flex items-center">
          <select
            className="h-full text-center text-xs hover:text-blue-500 font-bold pointer-events-auto"
            onChange={ event => setSort( event.target.value )}>
            <option value="market_cap">Market Cap</option>
            <option value="total_volume">Tatal Volume</option>
          </select>
        </div>
        <div id="frame" className={`p-2 w-full flex justify-center items-center ${ !detail.name && "hidden"} pointer-events-auto`}>
          <iframe data-aa="2353483" src="//ad.a-ads.com/2353483?size=320x100" className="w-[320px] h-[100px]"></iframe>
          <a id="preview-link" href="https://aads.com/campaigns/new/?source_id=2353483&source_type=ad_unit&partner=2353483"></a>
        </div>
        { detail.name &&
        <div className="p-2 space-y-2 w-full overflow-visible">
          {/* ここに広告を注入する */}
          <div className="space-y-2 w-full flex flex-wrap justify-between items-center">
            <div style={{ width: "40px", height: "40px", background: `url(${ detail.image }) no-repeat center center /100%`}}/>
            <div className="text-3xl font-bold text-white">{ detail.name }</div>
            <div className="text-3xl text-white font-bold flex-shrink-0">{ detail.symbol.toUpperCase()}</div>
          </div>
          <div className="p-1 font-bold text-white">{`RANK : ${ detail.market_cap_rank }`}</div>
          <div className="p-1 font-bold text-white flex">{`PRICE : $${ Number( detail.current_price ).toLocaleString()}`}
            <div className={`${ detail.market_cap_change_percentage_24h >= 0 ? "text-green-500": "text-red-500"}`}>
              { `${ detail.market_cap_change_percentage_24h >= 0 ? "▲": "▼"}${ detail.market_cap_change_percentage_24h }%`}
            </div>
          </div>
          <div className="p-1 font-bold text-white">{`VOLUME : $${ Number( detail.total_volume ).toLocaleString()}`}</div>
          <div className="p-1 font-bold text-xs text-white/30 flex justify-between">
            <div>{`LAST_UPDATE_${ new Date( detail.last_updated ).toLocaleString()}`}</div>
            <div>powered by CoinGecko</div>
          </div>
        </div>
        }
      </div>
      <ToastContainer/>
    </div>
  )
}
