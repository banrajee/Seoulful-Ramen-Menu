const fs=require('fs'),path=require('path'),assert=require('node:assert/strict'),Module=require('node:module');
const root=path.resolve(__dirname,'..');
const ts=require(path.join(root,'node_modules/typescript'));
let service=fs.readFileSync(path.join(root,'src/lib/festival-service.ts'),'utf8');
const compiled=ts.transpileModule(service,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
let writes=[]; const chain={eq(){return this},select(){return this},single:async()=>({error:null})}; const client={from(table){return {update(payload){writes.push({table,payload});return chain},insert(payload){writes.push({table,payload});return chain}}}};
const m=new Module('festival-test');m.require=(name)=>name==='./supabase'?{createBrowserSupabaseClient:()=>client}:require(name);m._compile(compiled,'festival-test.cjs');
const {orderedFestival,saveFestival}=m.exports;
(async()=>{
 const entries=[{id:'a',section:'ramen',status:'available',sort_order:20,price:10,product:{status:'hidden'}},{id:'b',section:'ramen',status:'out_of_stock',sort_order:10,price:300,product:{status:'available'}},{id:'c',section:'ramen',status:'hidden',sort_order:0,price:0}];
 assert.deepEqual(orderedFestival(entries,'ramen').map(x=>x.id),['b','a']);
 await saveFestival({...entries[0],menu_item_id:'product-id'});
 assert.equal(writes[0].table,'festival_items');assert.deepEqual(Object.keys(writes[0].payload).sort(),['menu_item_id','price','section','sort_order','status']);
 await saveFestival({id:'',section:'combos',name:'Custom combo',price:240,status:'hidden',sort_order:1});assert.equal(writes[1].table,'festival_combos');
 await assert.rejects(()=>saveFestival({id:'',section:'ramen',price:-1,sort_order:1}));
 await assert.rejects(()=>saveFestival({id:'',section:'ramen',price:1,sort_order:1}));
 console.log('PASS: manual order, hidden exclusion, independent stock, isolated writes, combos, validation');
})().catch(e=>{console.error(e);process.exitCode=1});

