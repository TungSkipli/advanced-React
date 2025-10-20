import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCSLE4CmWxFDI1nprIiSbsskDLWN6ibv-0",
  authDomain: "project-learning-9fdad.firebaseapp.com",
  projectId: "project-learning-9fdad",
  storageBucket: "project-learning-9fdad.firebasestorage.app"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;