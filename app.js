const $ = (id) => document.getElementById(id);
const messagesEl = $("messages"), welcome = $("welcome"), promptEl = $("prompt");
const form = $("chatForm"), sendBtn = $("sendBtn"), historyEl = $("history");
const STORAGE_KEY = "hhh-ai-chats-v1";
let chats = loadChats(), activeId = null, busy = false;

function loadChats(){ try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]")}catch{return []} }
function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(chats.slice(0,40))); }
function id(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
function current(){return chats.find(c=>c.id===activeId)}
function toast(s){const t=$("toast");t.textContent=s;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2600)}
function escapeText(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}

function renderHistory(){
  historyEl.innerHTML="";
  [...chats].sort((a,b)=>b.updated-a.updated).forEach(c=>{
    const b=document.createElement("button");b.className="history-item"+(c.id===activeId?" active":"");
    b.textContent=c.title||"New chat";b.title=b.textContent;b.onclick=()=>openChat(c.id);historyEl.appendChild(b);
  });
}
function addMessage(role,content){
  const row=document.createElement("div");row.className="message "+role;
  const avatar=document.createElement("div");avatar.className="avatar";avatar.textContent=role==="assistant"?"HHH":"YOU";
  const bubble=document.createElement("div");bubble.className="bubble";bubble.textContent=content;
  row.append(avatar,bubble);messagesEl.append(row);messagesEl.scrollTop=messagesEl.scrollHeight;
}
function showChat(){
  messagesEl.innerHTML="";const c=current();welcome.style.display=c&&c.messages.length?"none":"block";
  if(c)c.messages.forEach(m=>addMessage(m.role,m.content));
  renderHistory();
}
function newChat(){activeId=id();chats.unshift({id:activeId,title:"New chat",messages:[],updated:Date.now()});save();showChat();promptEl.focus();$("sidebar").classList.remove("open")}
function openChat(chatId){activeId=chatId;showChat();$("sidebar").classList.remove("open")}
function setBusy(v){busy=v;sendBtn.disabled=v;sendBtn.textContent=v?"…":"↑";promptEl.disabled=v}
async function sendMessage(text){
  if(busy||!text.trim())return;
  if(!current())newChat();
  const c=current();const userText=text.trim();
  c.messages.push({role:"user",content:userText});if(c.title==="New chat")c.title=userText.slice(0,38);
  c.updated=Date.now();save();showChat();setBusy(true);
  const typing=document.createElement("div");typing.className="typing";typing.textContent="HHH AI စဉ်းစားနေပါတယ်…";messagesEl.append(typing);
  try{
    const response=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:c.messages.slice(-30)})});
    const data=await response.json();if(!response.ok)throw new Error(data.error||"Request မအောင်မြင်ပါ။");
    c.messages.push({role:"assistant",content:data.reply});c.updated=Date.now();save();
    typing.remove();addMessage("assistant",data.reply);renderHistory();
  }catch(err){typing.remove();addMessage("assistant","အမှားတစ်ခု ဖြစ်နေပါတယ်။ "+err.message);toast(err.message)}
  finally{setBusy(false);promptEl.focus()}
}
form.addEventListener("submit",e=>{e.preventDefault();const text=promptEl.value;promptEl.value="";promptEl.style.height="auto";sendMessage(text)});
promptEl.addEventListener("input",()=>{promptEl.style.height="auto";promptEl.style.height=Math.min(promptEl.scrollHeight,180)+"px"});
promptEl.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();form.requestSubmit()}});
$("newChat").addEventListener("click",newChat);
$("menuBtn").addEventListener("click",()=>$("sidebar").classList.toggle("open"));
document.querySelectorAll(".suggestion").forEach(b=>b.addEventListener("click",()=>sendMessage(b.dataset.prompt)));
if(chats.length){activeId=chats.sort((a,b)=>b.updated-a.updated)[0].id;showChat()}else showChat();
