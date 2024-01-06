import React, { useState, useEffect } from 'react';
import { calculateStatistics, calculateAggregateStatistics, getPunchData, getCombos } from './datahandler';
import { Statistics, JsonData, ComboItem } from './types';
import StatisticBox from './components/StatisticBox';
import Graph from './components/Graph';
import Combos from './components/Combos';
import { Punch,FileUploadProps } from './types';
import powaLogo from './assets/powaboxing.svg';
import { getAuth, signOut } from '@firebase/auth';
import { useNavigate } from 'react-router-dom';



const Home: React.FC<FileUploadProps> = ({ workouts }) => {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [graph, setGraph] = useState<Array<{ speed: number, force: number, acceleration: number, timestamp: string, hand:number | undefined, fistType:string }>>([]);
  const [combos,setCombos] = useState<ComboItem[][] | null>(null);
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
    if (workouts && workouts.length > 0) {
      processJsonDataMultiple(workouts);
    }
  }, [workouts]); // Dependency array includes workouts

  const processJsonData = (json: JsonData) => {
      const statistics = calculateStatistics(json);
      if (statistics){
        setStats(statistics);
        setGraph(getPunchData(json))
        const combos = getCombos(json);
        setCombos(combos);

      }
  };
  
  const processJsonDataMultiple = (jsonDataArray: Punch[]) => {
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
              <Graph data={data} />
              </div>
            </>
          )}
        </div>
      }
    </div>
  );
};

export default Home;
