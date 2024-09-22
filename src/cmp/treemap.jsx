import React, { Suspense, useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { Zustand } from "@/lib/zustand"
import { Adsense } from "./adsense"

export const Treemap = () => {

  const svgRef = useRef()
  const [ progress, setProgress ] = useState( 0 )

  const { sort, coins, setDetail } = Zustand()

  const formatNumber = ( num ) => {
    if ( num >= 1000000000 ) return ( num / 1000000000 ).toFixed( 2 ) + " B"
    if ( num >= 1000000 ) return ( num / 1000000 ).toFixed( 2 ) + " M"
    if ( num >= 1000 ) return ( num / 1000 ).toFixed( 2 ) + " K"
    return num
  }

  useEffect(() => {
    const drawChart = () => {
      const width = window.innerWidth
      const height = window.innerHeight - 100

      const root = d3.hierarchy({ children: coins?.data }).sum( d => d[ sort ]).sort(( a, b ) => b.value - a.value )

      d3.treemap()
        .size([ width, height ])
        .padding( 0 )( root )

      const svg = d3.select( svgRef.current )
        .attr("width", width )
        .attr("height", height )

      svg.selectAll("*").remove()

      const g = svg.append("g")

      const node = g.selectAll("g")
        .data( root.leaves())
        .enter().append("g")
        .attr("transform", d => `translate(${ d.x0 }, ${ d.y0 })`)
        .on("pointerdown touchstart", ( event, d ) => {
          const timer = setTimeout(() => {
            clearProgress()
            window.location.href = `https://www.coingecko.com/en/coins/${ d.data.id }`
          }, 3000 )
          const interval = setInterval(() => setProgress( prev => Math.min( prev + 1, 100 )), 30 )
          const clearProgress = () => {
            clearTimeout( timer )
            clearInterval( interval )
            setProgress( 0 )
            event.target.removeEventListener("pointerup", clearProgress )
            event.target.removeEventListener("pointerout", clearProgress )
            event.target.removeEventListener("touchend", clearProgress )
            event.target.removeEventListener("touchcancel", clearProgress )
            window.removeEventListener("beforeunload", clearProgress )
          }
          event.target.addEventListener("pointerup", clearProgress, { passive: true })
          event.target.addEventListener("pointerout", clearProgress, { passive: true })
          event.target.addEventListener("touchend", clearProgress, { passive: true })
          event.target.addEventListener("touchcancel", clearProgress, { passive: true })
          window.addEventListener("beforeunload", clearProgress )
          setDetail( d.data )
        })
        .on("pointermove", ( event, d ) => {
          d3.select( event.target )
            .attr("fill", d => d.data.price_change_percentage_24h >= 0 ? "#CCFFCC" : "#FFCCCC")
          d3.select( event.target.nextSibling )
            .attr("fill", "black")
          setDetail( d.data )
        })
        .on("pointerout", ( event, d ) => {
          d3.select( event.target )
            .attr("fill", d => {
              if ( d.data.price_change_percentage_24h >= 10 ) return "#336633"
              if ( d.data.price_change_percentage_24h >= 5 ) return "#669966"
              if ( d.data.price_change_percentage_24h >= 0 ) return "#99CC99"
              if ( d.data.price_change_percentage_24h <= 0 ) return "#CC9999"
              if ( d.data.price_change_percentage_24h <= -5 ) return "#996666"
              if ( d.data.price_change_percentage_24h <= -10 ) return "#663333"
            })
          d3.select( event.target.nextSibling )
            .attr("fill", "white")
        })

      node.append("rect")
        .attr("width", d => d.x1 - d.x0 )
        .attr("height", d => d.y1 - d.y0 )
        .attr("fill", d => {
          if ( d.data.price_change_percentage_24h >= 10 ) return "#336633"
          if ( d.data.price_change_percentage_24h >= 5 ) return "#669966"
          if ( d.data.price_change_percentage_24h >= 0 ) return "#99CC99"
          if ( d.data.price_change_percentage_24h <= 0 ) return "#CC9999"
          if ( d.data.price_change_percentage_24h <= -5 ) return "#996666"
          if ( d.data.price_change_percentage_24h <= -10 ) return "#663333"
        })
        .attr("stroke", "#999999")

      const textNode = node.append("text")
        .attr("x", d => ( d.x1 - d.x0 ) / 2 )
        .attr("y", d => ( d.y1 - d.y0 ) / 2 )
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
        .attr("dy", d => `${ symbolFontSize( d ) / 2 }px`)
        .attr("font-size", d => symbolFontSize( d ) * 0.1 )
        .text( d => `$${ Number( d.data.current_price )}`)

      textNode.append("tspan")
        .attr("x", d => ( d.x1 - d.x0 ) / 2 )
        .attr("dy", d => `${ symbolFontSize( d ) * 0.12 }px`)
        .attr("font-size", d => symbolFontSize( d ) * 0.1 )
        .text( d => `${ d.data.price_change_percentage_24h * 100 > 0 ? "▲ +" : "▼ "}${ Math.floor( d.data.price_change_percentage_24h * 100 ) / 100 }%`)

      textNode.append("tspan")
        .attr("x", d => ( d.x1 - d.x0 ) / 2 )
        .attr("dy", d => `${ symbolFontSize( d ) * 0.12 }px`)
        .attr("font-size", d => symbolFontSize( d ) * 0.1 )
        .text( d => `Volume[ ${ formatNumber( d.data.total_volume )} ]`)

      const zoom = d3.zoom()
        .scaleExtent([ 1, 100000 ])
        .on("zoom", ( event ) => {
          g.transition().duration( 500 ).ease( d3.easeCubicInOut ).attr("transform", event.transform )
          g.selectAll("rect").attr("stroke-width", 1 / event.transform.k )
          if ( event.transform.k === 1 && event.transform.x !== 0 ) {
            g.transition()
              // .duration( 200 )
              .ease( d3.easeCubicInOut )
              .attr("transform", `translate(0,0) scale(1)`)
          }
        })

      svg.call( zoom )
      svg.call( zoom.transform, d3.zoomIdentity )
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
      className="absolute top-0 size-full bg-[url(/img/gecko.webp)] bg-no-repeat bg-center bg-[size:cover]"
      id="background"
      onClick={ event => { if ( event.target.id === "background") setDetail({})}}
      onPointerMove={ event => { if ( event.target.id === "background") setDetail({})}}>
      <Suspense fallback={ null }>
        <svg className="w-full h-[calc(100%-100px)] overflow-visible" ref={ svgRef } onContextMenu={ event => event.preventDefault()}/>
      </Suspense>
      <div style={{ position: "absolute", top: "0px", left: "0px", width: `${ progress }%`, height: "5px", background: "#3b82f6", transition: "width 0.3s ease"}}/>
      <Adsense/>
    </div>
  )
}