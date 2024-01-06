// Login.tsx
import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';
import firebaseConfig from "../firebase";
import { useNavigate } from 'react-router-dom';
import image1 from './assets/image1.png';
import image2 from './assets/image2.png';
import image3 from './assets/image3.png';
import punchsensors1 from './assets/punchsensors1.jpg';
import punchsensors2 from './assets/punchsensors2.jpg';
import punchsensors3 from './assets/punchsensors3.jpg';
import powaLogo from './assets/powaboxing.svg';
import { getStorage, ref, listAll, getBlob } from 'firebase/storage';
import { LoginProps } from './types';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Login: React.FC<LoginProps> = ({ onUserLogin }) => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(false);

  async function checkFilesAndNavigate(user: User) {
    const storage = getStorage(app);
    const filesRef = ref(storage, `punches/${user.uid}`);
      const fileList = await listAll(filesRef);

      if (fileList.items.length !== 0) {
        const filePromises = fileList.items.map(async (fileRef) => {
          const blob = await getBlob(fileRef);
          return new Response(blob).json();
        });

        await Promise.all(filePromises);
        onUserLogin(user);
        navigate('/home');
      }
      else{
        setLoginError(true);
        await signOut(auth);
        console.log("Signed out");
      }
    } 

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        checkFilesAndNavigate(user);
      } 
    });
  
    return () => unsubscribe(); // Clean up the subscription on unmount
  }, [onUserLogin, navigate]);
  

  

  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user) {
        try{
          checkFilesAndNavigate(user);
        }
        catch{
          setLoginError(true);
        }

      }
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      setLoginError(true);
    }
  };
  

  return (
    <div className="flex flex-col items-center bg-black text-white mt-10">
      <div className="text-center mb-6">
        <div className='flex mb-4'>
        <h1 className="text-4xl font-bold mb-4 ">Welcome to POWA Analytics</h1>
        <img src={powaLogo} alt="POWA logo" className=" w-16 -mt-2" />
        </div>
        <p className="mb-4 text-xl">Your Comprehensive Boxing Analytics Platform</p>
          <>
            <button
              onClick={googleSignIn}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition ease-in duration-200 mb-4"
            >
              Sign in with Google
            </button>
            {loginError && <p className="text-red-500">Failed login. Make sure you have a connected account.</p>}
          </>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        <img src={image1} alt="Feature demonstration 1" className="shadow-lg rounded max-w-full h-auto align-middle border-none" />
        <img src={image2} alt="Feature demonstration 2" className="shadow-lg rounded max-w-full h-auto align-middle border-none" />
        <img src={image3} alt="Feature demonstration 3" className="shadow-lg rounded max-w-full h-auto align-middle border-none" />
      </div>
      <h1 className="text-2xl font-bold mt-10">
        Don't have the POWA Punch Sensors? Get them &nbsp; 
        <a href="https://powaboxing.com/" className="underline">HERE</a>
      </h1>
      <div className='flex space-x-10 mt-10 mb-20'>
      <img src={punchsensors1} className=' h-40'/>
      <img src={punchsensors2} className=' h-40'/>
      <img src={punchsensors3} className=' h-40'/>
      </div>
      <footer className='mb-5 mt-5 text-sm'>© 2024, POWA Boxing. </footer>
      

    </div>
  );
};

export default Login;
