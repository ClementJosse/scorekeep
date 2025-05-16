import { getDatabase } from "firebase/database";
import { initializeApp } from "firebase/app";
import { environment } from '../environments/environment';

// Initialize Firebase
const app = initializeApp(environment.firebaseConfig);

const database = getDatabase(app);
export { database };