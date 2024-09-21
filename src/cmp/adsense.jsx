import React, { useEffect, useState } from "react"

export const Adsense = () => {

  const [ width, setWidth ] = useState( 0 )

  useEffect(() => {
    setWidth( window.innerWidth )
    try {
      ( window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch ( err ) {
      console.log( err )
    }
  }, [])

  return (
    <div className="w-full h-[100px] flex justify-around items-center bg-white">
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "340px", height: "100px" }}
        data-ad-client="ca-pub-7513541440780811"
        data-ad-slot="7363878258"></ins>
      <ins 
        className="adsbygoogle"
        style={{ display: width >= 640 ? "block": "none", width: "340px", height: "100px" }}
        data-ad-client="ca-pub-7513541440780811"
        data-ad-slot="5738261110"></ins>
      <ins 
        className="adsbygoogle"
        style={{ display: width >= 1020 ? "block": "none", width: "340px", height: "100px" }}
        data-ad-client="ca-pub-7513541440780811"
        data-ad-slot="9518285104"></ins>
    </div>
  )
}
