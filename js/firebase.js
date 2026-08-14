/* ═══════════ مانجا ويف — إعدادات Firebase ═══════════ */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, setPersistence, browserLocalPersistence, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBsUgAqgBRuSdggBq706jXlJ_EM451B8hI",
  authDomain: "vanitas-manga.firebaseapp.com",
  projectId: "vanitas-manga",
  storageBucket: "vanitas-manga.firebasestorage.app",
  messagingSenderId: "474926712582",
  appId: "1:474926712582:web:942392692103a4e3008087"
};

export const app  = initializeApp(firebaseConfig);
export const db   = getFirestore(app);
export const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence);

export const ADMIN_EMAIL = 'remysan102030@gmail.com';
export function isAdmin(user){
  return !!user && user.email === ADMIN_EMAIL;
}
export const googleProvider = new GoogleAuthProvider();

export const CLOUD = { name: 'djv9uolbx', preset: 'fnnukmsu' };
export async function uploadToCloud(file){
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', CLOUD.preset);
  const res = await fetch('https://api.cloudinary.com/v1_1/' + CLOUD.name + '/image/upload', { method:'POST', body:fd });
  const data = await res.json();
  if(!data.secure_url) throw new Error('فشل الرفع');
  return data.secure_url;
}
