"use strict";(()=>{var e={};e.id=877,e.ids=[877],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},7561:e=>{e.exports=require("node:fs")},6871:(e,t,a)=>{a.r(t),a.d(t,{originalPathname:()=>g,patchFetch:()=>x,requestAsyncStorage:()=>i,routeModule:()=>c,serverHooks:()=>d,staticGenerationAsyncStorage:()=>m});var s={};a.r(s),a.d(s,{GET:()=>u});var o=a(9303),r=a(8716),l=a(670),n=a(7070),p=a(7561);async function u(e){let t="",a="";for(let e of["/mnt/data/agents-seed-pack-full/day15_SEO_Sentinel/sitemap.xml","/tmp/agents-seed-pack-full/day15_SEO_Sentinel/sitemap.xml","./data/agents-seed-pack-full/day15_SEO_Sentinel/sitemap.xml","/mnt/data/agents-seed-pack-full/day13_SEO_Issue_Sentinel/sitemap.xml"])try{if((0,p.existsSync)(e)){t=(0,p.readFileSync)(e,"utf8"),a=e;break}}catch(e){continue}t||(t=`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2024-01-01</lastmod>
  </url>
  <url>
    <loc>https://example.com/about</loc>
    <lastmod>2024-01-02</lastmod>
  </url>
  <url>
    <loc>https://example.com/products</loc>
    <lastmod>2024-01-03</lastmod>
  </url>
  <url>
    <loc>https://example.com/services</loc>
    <lastmod>2024-01-04</lastmod>
  </url>
  <url>
    <loc>https://example.com/contact</loc>
    <lastmod>2024-01-05</lastmod>
  </url>
</urlset>`,a="mock-data");try{let e=Array.from(t.matchAll(/<loc>(.*?)<\/loc>/g)).map(e=>e[1]);return n.NextResponse.json({count:e.length,urls:e,source:a,message:"mock-data"===a?"Using mock data - no sitemap file found":"Sitemap parsed successfully"})}catch(e){return n.NextResponse.json({error:"Failed to parse sitemap",details:e instanceof Error?e.message:"Unknown error",source:a},{status:500})}}let c=new o.AppRouteRouteModule({definition:{kind:r.x.APP_ROUTE,page:"/api/seo-pages/route",pathname:"/api/seo-pages",filename:"route",bundlePath:"app/api/seo-pages/route"},resolvedPagePath:"C:\\Users\\indra\\Downloads\\agents-starter-repo\\agents-starter-repo\\app\\api\\seo-pages\\route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:i,staticGenerationAsyncStorage:m,serverHooks:d}=c,g="/api/seo-pages/route";function x(){return(0,l.patchFetch)({serverHooks:d,staticGenerationAsyncStorage:m})}}};var t=require("../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),s=t.X(0,[789],()=>a(6871));module.exports=s})();