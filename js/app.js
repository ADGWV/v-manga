/═══════ مانجا ويف — المنطق المشترك ═══════════ */
import { db, auth } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { collection, getDocs, getDoc, doc, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

function avatarHTML(user){
  if(user.photoURL)
    return `<img class="avatar-img" src="${user.photoURL}" alt="">`;
  const ch = ((user.displayName || user.email || '?')[0] || '?').toUpperCase();
  return `<span class="avatar-txt">${ch}</span>`;
}

function renderUser(user){
  const chip = document.getElementById('userChip');
  if(chip){
    chip.innerHTML = user
      ? `<a class="user-chip" href="profile.html">${avatarHTML(user)}<span class="chip-name">${user.displayName || user.email}</span></a>`
      : `<a class="btn small-btn" href="login.html">دخول</a>`;
  }
  const navAcc = document.getElementById('navAcc');
  if(navAcc){
    navAcc.href = user ? 'profile.html' : 'login.html';
    navAcc.innerHTML = user
      ? `<span class="ic">👤</span>${user.displayName || user.email}`
      : `<span class="ic">👤</span>دخول`;
  }
}

onAuthStateChanged(auth, user => {
  console.log('حالة الدخول:', user ? 'داخل ✅' : 'خارج ❌');
  renderUser(user);
});

export async function getMangas(max = 200){
  const q = query(collection(db, 'mangas'), orderBy('updatedAt', 'desc'), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getManga(id){
  const snap = await getDoc(doc(db, 'mangas', id));
  return snap.exists() ? { id, ...snap.data() } : null;
}

export async function getChapters(mangaId){
  const q = query(collection(db, 'chapters'), orderBy('number', 'asc'), limit(200));
  const snap = await getDocs(q);
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(c => c.mangaId === mangaId);
}

export function mangaCard(m){
  const chap = m.lastChapter ? 'الفصل ' + m.lastChapter : 'اقرأ الآن';
  return `
  <a class="card" href="manga.html?id=${m.id}">
    <div class="cover"><img src="${m.cover || ''}" alt="${m.titleAr || ''}" loading="lazy"></div>
    <div class="info">
      <h3>${m.titleAr || m.titleEn}</h3>
      <span>${chap}</span>
    </div>
  </a>`;
}

export function fmtDate(ts){
  if(!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('ar-EG', { year:'numeric', month:'short', day:'numeric' });
}

const grid   = document.getElementById('grid');
const search = document.getElementById('search');
const empty  = document.getElementById('empty');

if(grid){
  let allMangas = [];

  function render(list){
    if(list.length === 0){
      grid.innerHTML = '';
      if(empty) empty.hidden = false;
      return;
    }
    if(empty) empty.hidden = true;
    grid.innerHTML = list.map(mangaCard).join('');
  }

  (async () => {
    try{
      allMangas = await getMangas();
      render(allMangas);
    }catch(e){
      grid.innerHTML = '<div class="empty">⚠️ حصل خطأ في تحميل البيانات</div>';
      console.error(e);
    }
  })();

  if(search){
    search.addEventListener('input', () => {
      const v = search.value.trim().toLowerCase();
      if(!v){ render(allMangas); returns return; }
      render(allMangas.filter(m =>
        ((m.titleAr || '') + ' ' + (m.titleEn || '')).toLowerCase().includes(v)));
    });
  }
}
