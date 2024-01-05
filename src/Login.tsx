import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, getBlob, listAll } from 'firebase/storage';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged , User as FirebaseUser} from 'firebase/auth';
import firebaseConfig from "../firebase";
import FileUpload from './FileUpload';
import { JsonData } from './types';

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);


const Login: React.FC = () => {
  const [workouts, setWorkouts] = useState<JsonData[]>([]);
  const [user, setUser] = useState<FirebaseUser | null>(null); // Specify the type for user state

  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        console.log("Logged in");
      } else {
        console.log("User is not signed in");
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchWorkoutData();
    }
  }, [user]); // Add user as a dependency

  const fetchWorkoutData = async () => {
    if (!user) return;

    const filesRef = ref(storage, `punches/${user.uid}`); // Reference to the directory

    try {
      const fileList = await listAll(filesRef); // List all files in the directory

      const filePromises = fileList.items.map(async (fileRef) => {
        const blob = await getBlob(fileRef);
        return new Response(blob).json();
      });

      const filesData = await Promise.all(filePromises); // Fetch and parse all files
      setWorkouts(filesData); // Update the state with all fetched data
    } catch (error) {
      console.error("Failed to fetch workout data", error);
    }
  };

  return (

      <div className="text-center mb-6">
        {!auth.currentUser && (
          <button
            onClick={googleSignIn}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign in with Google
          </button>
        )}
      <FileUpload workouts={workouts} />
      </div>
  );
};

export default Login;
