import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getFirestore, collection, addDoc, getDocs, 
  deleteDoc, doc, updateDoc 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBxRNXTauqOB3X0FptQPeR7jkBy0gKUS3E",
  authDomain: "emotion-74f3c.firebaseapp.com",
  projectId: "emotion-74f3c",
  storageBucket: "emotion-74f3c.firebasestorage.app",
  messagingSenderId: "740825781548",
  appId: "1:740825781548:web:90d4e448d440a953440889"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ADMIN_PASSWORD = "byblublia372";

let bubbles = [];
let selectedId = null;

const colors={
1:"#C8F7DCcc",
2:"#A8D8FFcc",
3:"#FFF3B0cc",
4:"#FFCC9Acc",
5:"#FF9E9Ecc",
6:"#C3A6FFcc"
};

//////////////////////////////
// 🔘 MENU TOGGLE
//////////////////////////////
window.toggleMenu = function(){
const menu=document.getElementById("menuBox");
menu.style.display = menu.style.display==="flex"?"none":"flex";
};

//////////////////////////////
// 🔐 PASSWORD CHECK
//////////////////////////////
function checkPassword(){
const pass=prompt("Masukkan password:");
if(pass!==ADMIN_PASSWORD){
alert("Password salah!");
return false;
}
return true;
}

//////////////////////////////
// 📝 OPEN FORM
//////////////////////////////
window.openForm=function(){
if(!checkPassword()) return;
document.getElementById("formModal").style.display="flex";
};

window.closeForm=function(){
document.getElementById("formModal").style.display="none";
};

window.saveNote=async function(){

const note={
tanggal:document.getElementById("tanggal").value,
judul:document.getElementById("judul").value,
isi:document.getElementById("isi").value,
level:parseInt(document.getElementById("level").value),
kategori:document.getElementById("kategori").value,
createdAt:new Date()
};

await addDoc(collection(db,"notes"),note);

closeForm();
loadNotes();
};

//////////////////////////////
// ✏ EDIT NOTE
//////////////////////////////
window.editNote=async function(){
if(!checkPassword()) return;

if(!selectedId){
alert("Klik bubble dulu untuk memilih catatan.");
return;
}

document.getElementById("editModal").style.display="flex";
};

window.updateNote=async function(){

await updateDoc(doc(db,"notes",selectedId),{
judul:document.getElementById("eJudul").value,
isi:document.getElementById("eIsi").value,
level:parseInt(document.getElementById("eLevel").value),
kategori:document.getElementById("eKategori").value
});

document.getElementById("editModal").style.display="none";
loadNotes();
};

//////////////////////////////
// 📦 LOAD NOTES
//////////////////////////////
async function loadNotes(){

bubbles.forEach(b=>b.el.remove());
bubbles=[];

const snap=await getDocs(collection(db,"notes"));

snap.forEach(docSnap=>{
createBubble(docSnap.data(),docSnap.id);
});
}

//////////////////////////////
// 🫧 CREATE BUBBLE
//////////////////////////////
function createBubble(note,id){

const size=90+note.level*10;
const el=document.createElement("div");
el.className="bubble";
el.style.width=size+"px";
el.style.height=size+"px";
el.style.background=colors[note.level];
el.innerHTML=note.judul;

document.body.appendChild(el);

let bubble={
el,id,note,
x:Math.random()*(window.innerWidth-size),
y:Math.random()*(window.innerHeight-size),
dx:(Math.random()*2+1)*(Math.random()>.5?1:-1),
dy:(Math.random()*2+1)*(Math.random()>.5?1:-1),
size
};

el.style.left=bubble.x+"px";
el.style.top=bubble.y+"px";

el.onclick=function(){
selectedId=id;

// isi form edit otomatis
document.getElementById("eJudul").value=note.judul;
document.getElementById("eIsi").value=note.isi;
document.getElementById("eLevel").value=note.level;
document.getElementById("eKategori").value=note.kategori;

// tampil detail
document.getElementById("dJudul").innerText=note.judul;
document.getElementById("dTanggal").innerText=note.tanggal;
document.getElementById("dKategori").innerText=note.kategori;
document.getElementById("dIsi").innerText=note.isi;
document.getElementById("detailCard").style.background=colors[note.level];
document.getElementById("detailModal").style.display="flex";
};

bubbles.push(bubble);
}

//////////////////////////////
// 🎯 ANIMATION
//////////////////////////////
function animate(){
for(let i=0;i<bubbles.length;i++){
let b=bubbles[i];
b.x+=b.dx;
b.y+=b.dy;

if(b.x<=0||b.x+b.size>=window.innerWidth) b.dx*=-1;
if(b.y<=0||b.y+b.size>=window.innerHeight) b.dy*=-1;

for(let j=i+1;j<bubbles.length;j++){
let b2=bubbles[j];
let dx=b.x-b2.x;
let dy=b.y-b2.y;
let dist=Math.sqrt(dx*dx+dy*dy);
if(dist<b.size/2+b2.size/2){
[b.dx,b2.dx]=[b2.dx,b.dx];
[b.dy,b2.dy]=[b2.dy,b.dy];
}
}

b.el.style.left=b.x+"px";
b.el.style.top=b.y+"px";
}
requestAnimationFrame(animate);
}

loadNotes();
animate();
