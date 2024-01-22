import React, { useState, useEffect } from 'react';
import {  calculateAggregateStatistics } from './utils/datahandler';
import { JsonData, Statistics} from './utils/types';
import StatisticBox from './components/StatisticBox';
import Graph from './components/Graph';
import {HomeProps } from './utils/types';
import powaLogo from './assets/powaboxing.svg';
import { useNavigate } from 'react-router-dom';
import Loading from './components/Loading';
import { handleSignOut } from './utils/handlesignout';
import Title from './components/Title';

const Home: React.FC<HomeProps> = ({ workouts }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Statistics | null>(null);
  const [graph, setGraph] = useState<Array<{ speed: number, force: number, acceleration: number, timestamp: string, hand:number | undefined, fistType:string }>>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const body = document.body;
    if (isSidebarOpen) {
      body.classList.add('overflow-hidden');
    } else {
      body.classList.remove('overflow-hidden');
    }
    if (workouts && workouts.length > 0) {
      setIsLoading(true);
      processJsonDataMultiple(workouts);
      setIsLoading(false);
    }
    return () => {
      body.classList.remove('overflow-hidden');
    };
  }, [isSidebarOpen, workouts]);


  const handleLogOut = () => handleSignOut(navigate); 
  
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


  return (
    <div className="bg-black">
    <Title isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
<div className={`w-60 absolute top-0 left-0 z-50 min-h-screen bg-orange-500 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
    <div className="flex flex-col items-start justify-between h-full p-4">
      <div className="flex w-full">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white text-xl font-bold mb-10">
          &#10005; 
        </button>
        <div className="flex items-center justify-center mb-10 ml-5">
        <h1 className="text-l font-bold text-center">POWA Analytics</h1>
        <img src={powaLogo} alt="POWA logo" className="w-8 h-8 ml-2" />
        </div>

      </div>
      <nav className="flex flex-col w-full font-bold h-full -mt-8"> 
        <button onClick={() => {navigate('/home');}} className="ml-5 text-left py-2 px-4 hover:bg-orange-600 transition-colors duration-150">Home</button>
        <button onClick={() => {navigate('/singleworkout', { state: { avgstats: stats } }); setIsSidebarOpen(!isSidebarOpen)}} className="ml-5 text-left py-2 px-4 hover:bg-orange-600 transition-colors duration-150">Single Workouts</button>
        <button onClick={() => {handleLogOut();}} className="ml-5 text-left py-2 px-4 hover:bg-orange-600 transition-colors duration-150">Sign Out</button>
      </nav>
    </div>
</div>
      <div className="pt-10">
        {isLoading ? (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black">
            <Loading />
          </div>
        ) : (
          <div className="animate-fade-in">
            {stats && (
              <>
                <StatisticBox stats={{
                    avgStarRating: stats.avgStarRating,
                    avgAcceleration: stats.avgAcceleration,
                    avgSpeed: stats.avgSpeed,
                    avgForce: stats.avgForce,
                    modeHand: stats.modeHand,
                    modePunchType: stats.modePunchType
                  }} 
                />
                <div className="flex justify-center my-5">
                  <button
                    onClick={() => navigate('/singleworkout', { state: { avgstats: stats } })}
                    className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 font-bold"
                  >
                    See my Workouts
                  </button>
                </div>
                <div>
                  <Graph data={graph.map(item => ({
                    timestamp: item.timestamp,
                    hand:item.hand,
                    speed: item.speed,
                    acceleration: item.acceleration,
                    force:item.force,
                    fistType:item.fistType

                    }))} 
                   singleWorkout={false}/>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
