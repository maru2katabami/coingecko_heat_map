import React, { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { Zustand } from "@/lib/zustand"

export const Treemap = () => {

  const svgRef = useRef()
  const [ progress, setProgress ] = useState( 0 )

  const { sort, coins, detail, setDetail } = Zustand()

  const formatNumber = ( num ) => {
    if ( num >= 1000000000 ) return ( num / 1000000000 ).toFixed(2) + " B"
    if ( num >= 1000000 ) return (num / 1000000 ).toFixed(2) + " M"
    if ( num >= 1000 ) return (num / 1000 ).toFixed(2) + " K"
    return num
  }

  useEffect(() => {
    const drawChart = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      const root = d3.hierarchy({ children: coins?.data })
        .sum( d => d[ sort ])
        .sort(( a, b ) => b.value - a.value )

      d3.treemap()
        .size([ width, height ])
        .padding(0)( root )

      const svg = d3.select( svgRef.current )
        .attr("width", width )
        .attr("height", height )

      svg.selectAll("*").remove()

      const node = svg.selectAll("g")
        .data( root.leaves())
        .enter().append("g")
        .attr("transform", d => `translate(${ d.x0 },${ d.y0 })`)
        .on("pointerdown", ( event, d ) => {
          const timer = setTimeout(() => window.open(`https://www.coingecko.com/en/coins/${ d.data.id }`), 3000 )
          const interval = setInterval(() => setProgress( prev => Math.min( prev + 1, 100 )), 25 )
          const clearProgress = () => {
            clearTimeout( timer )
            clearInterval( interval )
            setProgress( 0 )
          }
          event.target.addEventListener("pointerup", clearProgress )
          event.target.addEventListener("pointerout", clearProgress )
          setDetail( d.data )
          console.log( d.data )
        })
        .on("pointermove", ( event, d ) => {
          d3.select( event.target )
            .attr("fill", d => d.data.price_change_percentage_24h >= 0 ? "#CCFFCC": "#FFCCCC")
          d3.select( event.target.nextSibling )
            .attr("fill", "black")
          setDetail( d.data )
        })
        .on("pointerout", ( event, d ) => {
          d3.select( event.target )
            .attr("fill", d => {
              if (d.data.price_change_percentage_24h >= 10) return "#336633"
              if (d.data.price_change_percentage_24h >= 5) return "#669966"
              if (d.data.price_change_percentage_24h >= 0) return "#99CC99"
              if (d.data.price_change_percentage_24h <= 0) return "#CC9999"
              if (d.data.price_change_percentage_24h <= -5) return "#996666"
              if (d.data.price_change_percentage_24h <= -10) return "#663333"
            })
          d3.select( event.target.nextSibling )
            .attr("fill", "white")
        })

      node.append("rect")
        .attr("width", d => d.x1 - d.x0 )
        .attr("height", d => d.y1 - d.y0 )
        .attr("fill", d => {
          if (d.data.price_change_percentage_24h >= 10) return "#336633"
          if (d.data.price_change_percentage_24h >= 5) return "#669966"
          if (d.data.price_change_percentage_24h >= 0) return "#99CC99"
          if (d.data.price_change_percentage_24h <= 0) return "#CC9999"
          if (d.data.price_change_percentage_24h <= -5) return "#996666"
          if (d.data.price_change_percentage_24h <= -10) return "#663333"
        })
        .attr("stroke", "#999999")

      const textNode = node.append("text")
        .attr("x", d => (d.x1 - d.x0) / 2)
        .attr("y", d => (d.y1 - d.y0) / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", "white")
        .style("pointer-events", "none")
      
      const symbolFontSize = d => Math.min(( d.x1 - d.x0 ), ( d.y1 - d.y0 )) * 0.5
      
      textNode.append("tspan")
        .attr("x", d => ( d.x1 - d.x0 ) / 2 )
        .attr("font-size", symbolFontSize )
        .text( d => d.data.symbol.toUpperCase())
        .attr("dy", "0")
      
      textNode.append("tspan")
        .attr("x", d => ( d.x1 - d.x0 ) / 2 )
        .attr("dy", d => `${ symbolFontSize(d) / 2 }px`)
        .attr("font-size", d => symbolFontSize(d) * 0.1 )
        .text( d => `$${ Number( d.data.current_price )}`)
      
      textNode.append("tspan")
        .attr("x", d => ( d.x1 - d.x0 ) / 2 )
        .attr("dy", d => `${ symbolFontSize(d) * 0.12 }px`)
        .attr("font-size", d => symbolFontSize(d) * 0.1 )
        .text( d => `${ d.data.price_change_percentage_24h * 100 > 0 ? "▲ +" : "▼ "}
                     ${ Math.floor( d.data.price_change_percentage_24h * 100 ) / 100 }%`)
      
      textNode.append("tspan")
        .attr("x", d => ( d.x1 - d.x0 ) / 2 )
        .attr("dy", d => `${ symbolFontSize(d) * 0.12 }px`)
        .attr("font-size", d => symbolFontSize(d) * 0.1 )
        .text( d => `Volume[ ${ formatNumber( d.data.total_volume )} ]`)
    }

    if ( coins.data && coins.mcap ) {
      drawChart()
      const handleResize = () => drawChart()
      window.addEventListener("resize", handleResize )
      return () => window.removeEventListener("resize", handleResize )
    }
  }, [ sort, coins ])

  return (
    <div
      className="absolute top-0 size-full">
      <svg
        ref={ svgRef }/>
      <div
        className="absolute top-0 h-1 bg-black/20"
        style={{ width: `${ progress }%`, transition: "width 0.3s ease"}}/>
      { detail.name &&
      <div
        className="absolute top-20 left-1/2 -translate-x-1/2 p-2 space-x-2 space-y-2 size-80 rounded-3xl bg-black/20 backdrop-blur-lg">
        <div
          className="space-x-2 space-y-2 w-full flex flex-wrap justify-around items-center">
          <div
            className="size-14 bg-no-repeat bg-center bg-[size:100%]"
            style={{ backgroundImage: `url(${ detail.image })`}}/>
          <div
            className="text-3xl font-bold">
            { detail.name }
          </div>
          <div
            className="text-3xl text-white font-bold flex-shrink-0">
            { detail.symbol.toUpperCase()}
          </div>
        </div>
        <div
          className="p-1 font-bold">
          {`RANK : ${ detail.market_cap_rank }`}
        </div>
        <div
          className="p-1 font-bold">
          {`PRICE : $${ Number( detail.current_price ).toLocaleString()} : ${ detail.market_cap_change_percentage_24h }%`}
        </div>
      </div>
      }
    </div>
  )
}
