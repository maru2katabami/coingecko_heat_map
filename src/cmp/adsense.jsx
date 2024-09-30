import React, { useEffect, useState } from "react"

export const Adsense = () => {

  const [ width, setWidth ] = useState( 0 )

  useEffect(() => {
    const updateWidth = () => setWidth( window.innerWidth )
    updateWidth()
    window.addEventListener("resize", updateWidth )
    return () => window.removeEventListener("resize", updateWidth )
  }, [])

  return (
    <div className="absolute bottom-0 w-full h-[100px] flex justify-around items-center pointer-events-none">
      <div id="frame" className="relative w-[320px] h-[100px] pointer-events-auto">
        <iframe data-aa="2355758" src="//ad.a-ads.com/2355758?size=320x100" className="p-0 size-full border-none bg-transparent overflow-hidden"></iframe>
        <a className="absolute top-0 size-full" id="preview-link" href="https://aads.com/campaigns/new/?source_id=2355758&source_type=ad_unit&partner=2355758"></a>
      </div>
      <div id="frame" className={`relative w-[320px] h-[100px] ${ width <= 640 ? "hidden": "block"} pointer-events-auto`}>
        <iframe data-aa="2355760" src="//ad.a-ads.com/2355760?size=320x100" className="p-0 size-full border-none bg-transparent overflow-hidden"></iframe>
        <a className="absolute top-0 size-full" id="preview-link" href="https://aads.com/campaigns/new/?source_id=2355760&source_type=ad_unit&partner=2355760"></a>
      </div>
      <div id="frame" className={`relative w-[320px] h-[100px] ${ width <= 960 ? "hidden": "block"} pointer-events-auto`}>
        <iframe data-aa="2355762" src="//ad.a-ads.com/2355762?size=320x100" className="p-0 size-full border-none bg-transparent overflow-hidden"></iframe>
        <a className="absolute top-0 size-full" id="preview-link" href="https://aads.com/campaigns/new/?source_id=2355762&source_type=ad_unit&partner=2355762"></a>
      </div>
    </div>
  )
}
