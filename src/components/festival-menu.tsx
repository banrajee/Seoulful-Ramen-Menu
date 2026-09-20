"use client";
import { useEffect, useState } from "react";
import { addonImage, SpiceRow, spiceLevel, useProductImage } from "./live-menu";
import { fetchFestival, festivalSections, orderedFestival, type FestivalEntry, type FestivalSection } from "@/lib/festival-service";
import type { MenuItem } from "@/lib/types";
import "./festival.css";
function FestivalCard({entry}: {entry: FestivalEntry}) {
 const product = entry.product;
 const item = product ?? {id:entry.id,name:entry.name ?? "",description:entry.description ?? "",image_url:entry.image_url,category_id:"combos"} as MenuItem;
 const imageItem = entry.section === "addons" ? {...item,image_url:item.image_url || addonImage(item)} : item;
 const {imageSrc,tryNextImage} = useProductImage(imageItem);
 const image = product ? imageSrc : entry.image_url;
 return <article className={"festival-card " + entry.status}>
 <div className="festival-image">{image && <img src={image} alt={item.name} loading="lazy" decoding="async" onError={product ? tryNextImage : (event) => { event.currentTarget.hidden = true; }}/>}</div>
 <div className="festival-copy"><h3>{item.name}</h3><p className="festival-description">{item.description}</p>
 <div className="festival-meta">{item.food_type && <span><span className={"food-marker " + item.food_type}/>{item.food_type === "veg" ? "Veg" : "Non-Veg"}</span>}
 {(entry.section === "ramen" || entry.section === "snacks") && <SpiceRow level={spiceLevel(item)}/>}</div>
 <strong><small>Festival Price </small>{new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:2}).format(entry.price)}</strong>
 {entry.status === "out_of_stock" && <span className="festival-sold-out">Sold Out</span>}</div></article>;
}
export function FestivalMenu() {
 const [entries,setEntries]=useState<FestivalEntry[]>([]);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState(false);
 useEffect(()=>{
 let active=true;
 async function refresh(){try {const data=await fetchFestival();if(active){setEntries(data);setError(false);}}catch{if(active)setError(true);}finally{if(active)setLoading(false);}}
 void refresh();
 const timer=window.setInterval(()=>{if(document.visibilityState === "visible")void refresh();},60000);
 const focus=()=>void refresh();window.addEventListener("focus",focus);
 return ()=>{active=false;window.clearInterval(timer);window.removeEventListener("focus",focus);};
 },[]);
 return <main className="menu-page festival-page"><div className="menu-shell festival-shell">
 <header className="festival-header"><img src="/menu-right-logo-transparent.png" alt="Seoulful Ramen"/><div><p>Shillong Cherry Blossom Festival</p><h1>Festival Menu</h1><p>Prepared by Seoulful. Served ready to eat.</p></div></header>
 <nav className="festival-nav" aria-label="Festival sections">{Object.entries(festivalSections).map(([key,label])=><a key={key} href={"#festival-"+key}>{label}</a>)}</nav>
 {loading ? <p role="status">Loading festival menu…</p> : error ? <p role="alert">The festival menu is temporarily unavailable. Please refresh or check at the stall.</p> : Object.entries(festivalSections).map(([key,label])=>{
 const rows=orderedFestival(entries,key as FestivalSection);
 return <section className="festival-section" id={"festival-"+key} key={key}><h2>{label}</h2>{rows.length ? <div className="festival-grid">{rows.map(entry=><FestivalCard key={entry.id} entry={entry}/>)}</div>:<p>Selection coming soon.</p>}</section>;})}
 </div></main>;
}

