import React, { useState, useEffect } from 'react';
import { calculateStatistics, getCombos, getPunchData } from './datahandler';
import { ComboItem, JsonData, Statistics} from './types';
import StatisticBox from './components/StatisticBox';
import Graph from './components/Graph';
import {FileUploadProps } from './types';
import powaLogo from './assets/powaboxing.svg';
import { getAuth, signOut } from '@firebase/auth';
import { useNavigate } from 'react-router-dom';
import Combos from './components/Combos';



const SingleWorkouts: React.FC<FileUploadProps> = ({ workouts }) => {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [graph, setGraph] = useState<Array<{ speed: number, force: number, acceleration: number, timestamp: string, hand:number | undefined, fistType:string }>>([]);
  const [combos,setCombos] = useState<ComboItem[][] | null>(null);
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
  const navigate = useNavigate();

  

  const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log('User signed out successfully');
      navigate('/');
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  useEffect(() => {
    if (workouts && workouts.length > 0 && currentWorkoutIndex < workouts.length) {
      processJsonData(workouts[currentWorkoutIndex]);
    }
  }, [workouts, currentWorkoutIndex]);

  const handleNextWorkout = () => {
    if (currentWorkoutIndex < workouts.length - 1) {
      setCurrentWorkoutIndex(currentWorkoutIndex + 1);
    } 
  };

  const handlePreviousWorkout = () => {
    if (currentWorkoutIndex > 0) {
      setCurrentWorkoutIndex(currentWorkoutIndex - 1);
    } 
  };


  const processJsonData = (json: JsonData) => {
    const statistics = calculateStatistics(json);
    if (statistics){
      setStats(statistics);
      setGraph(getPunchData(json))
      const combos = getCombos(json);
      setCombos(combos);

    }
};
  
  const data = graph.map(item => ({
    timestamp: item.timestamp,
    hand:item.hand,
    speed: item.speed,
    acceleration: item.acceleration,
    force:item.force,
    fistType:item.fistType

  }));


  return (
    <div className="p-4 mx-auto bg-black text-white">
      <div className="flex items-center justify-center">
          <h1 className="text-3xl font-bold mb-6 text-center">POWA Analytics</h1>
          <img src={powaLogo} alt="POWA logo" className="mr-2 w-16 mb-5" /> 
        </div>
          <button
          onClick={() => navigate('/home')}
          className="absolute bg-orange-500 top-4 left-4 text-white py-2 px-4 rounded-md -my-1 hover:bg-orange-600 font-bold"
          >← Home
          </button>
          <button
          onClick={handleSignOut}
          className="absolute top-4 right-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition ease-in duration-200"
        >
          Sign Out
        </button>
        <div className='flex justify-center mb-7 items-center'>
    <button
      onClick={handlePreviousWorkout}
      className={`bg-orange-500 text-white px-4 rounded-md hover:bg-orange-600 font-bold ${currentWorkoutIndex === 0 ? 'invisible pointer-events-none' : ''}`}
    >
      ←
    </button>

  <span className="mx-5 text-xl text-white">{"File #" + (currentWorkoutIndex + 1)}</span>

  <button
    onClick={handleNextWorkout}
    className={`bg-orange-500 text-white px-4 rounded-md hover:bg-orange-600 font-bold ${currentWorkoutIndex === workouts.length - 1 ? 'invisible pointer-events-none' : ''}`}
  >
    →
  </button>
</div>
<div className='mb-5 flex text-sm justify-center -my-1'>
    <p>You have {workouts.length} workouts</p>
  </div>

      { 
        <div className='bg-black'>
          {stats && (
            <>
              <StatisticBox stats={{
                avgStarRating: stats.avgStarRating,
                avgAcceleration: stats.avgAcceleration,
                avgSpeed: stats.avgSpeed,
                avgForce: stats.avgForce,
                modeHand: stats.modeHand,
                modePunchType: stats.modePunchType
              }} />
              <div className="max-w-lg ml-80">
              <Graph data={data} singleWorkout={true}/>
              <Combos combos={combos} />
              </div>
            </>
          )}
        </div>
      }
    </div>
  );
};

export default SingleWorkouts;
