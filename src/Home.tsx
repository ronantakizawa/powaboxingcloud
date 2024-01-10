import React, { useState, useEffect } from 'react';
import {  calculateAggregateStatistics } from './datahandler';
import { JsonData, Statistics} from './types';
import StatisticBox from './components/StatisticBox';
import Graph from './components/Graph';
import {HomeProps } from './types';
import powaLogo from './assets/powaboxing.svg';
import { getAuth, signOut } from '@firebase/auth';
import { useNavigate } from 'react-router-dom';
import Loading from './components/Loading';



const Home: React.FC<HomeProps> = ({ workouts }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Statistics | null>(null);
  const [graph, setGraph] = useState<Array<{ speed: number, force: number, acceleration: number, timestamp: string, hand:number | undefined, fistType:string }>>([]);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const confirmSignOut = window.confirm("Are you sure you want to sign out?");

    if (confirmSignOut) {
        const auth = getAuth();
        try {
            await signOut(auth);
            console.log('User signed out successfully');
            navigate('/');
        } catch (error) {
            console.error('Error signing out', error);
        }
    } else {
        console.log('Sign out cancelled');
    }
};

  useEffect(() => {
    if (workouts && workouts.length > 0) {
      setIsLoading(true);
      processJsonDataMultiple(workouts);
      setIsLoading(false);
    }
  }, [workouts]); // Dependency array includes workouts
  
  const processJsonDataMultiple = (jsonDataArray: JsonData[]) => {
    const statistics = calculateAggregateStatistics(jsonDataArray);
    if (statistics) {
      setStats(statistics.aggregatedStats);
      const transformedData = statistics.speedArray.map((speed, index) => ({
        speed: speed,
        force: statistics.forceArray[index],
        acceleration: statistics.accelerationArray[index],
        timestamp: `File# ${index+1}`,
        hand:undefined,
        fistType: statistics.fistTypeArray[index]
      }));
      
      setGraph(transformedData);
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
        onClick={handleSignOut}
        className="absolute top-4 right-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition ease-in duration-200"
      >
        Sign Out
      </button>
      { isLoading ? (
        <div className="fixed inset-0 bg-black z-40  flex justify-center items-center">
          <Loading />
        </div>
      ) : (
        <div className='bg-black animate-fade-in'>
          {stats && (
            <>
              <StatisticBox stats={{
                  avgStarRating: stats.avgStarRating,
                  avgAcceleration: stats.avgAcceleration,
                  avgSpeed: stats.avgSpeed,
                  avgForce: stats.avgForce,
                  modeHand: stats.modeHand,
                  modePunchType: stats.modePunchType
                }}  />
              <div className="flex justify-center mb-5">
              <button
              onClick={() => navigate('/singleworkout')}
              className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 font-bold"
              >See my Workouts
              </button>
              </div>
              <div className="max-w-lg ml-80">
              <Graph data={data} singleWorkout={false}/>
              </div>
            </>
          )}
        </div>)
      }
    </div>
  );
};

export default Home;
