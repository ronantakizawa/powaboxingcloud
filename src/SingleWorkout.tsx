import React, { useState, useEffect } from 'react';
import { calculateStatistics, getCombos, getPunchData } from './utils/datahandler';
import { ComboItem, JsonData, HomeProps, Statistics} from './utils/types';
import StatisticBox from './components/StatisticBox';
import Graph from './components/Graph';
import powaLogo from './assets/powaboxing.svg';
import { useNavigate } from 'react-router-dom';
import Combos from './components/Combos';
import Loading from './components/Loading';
import { useLocation } from 'react-router-dom';
import { handleSignOut } from './utils/handlesignout';
import Title from './components/Title';


const SingleWorkouts: React.FC<HomeProps> = ({ workouts}) => {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [graph, setGraph] = useState<Array<{ speed: number, force: number, acceleration: number, timestamp: string, hand:number | undefined, fistType:string }>>([]);
  const [combos,setCombos] = useState<ComboItem[][] | null>(null);
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { avgstats } = location.state;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const body = document.body;
  
    // Handling sidebar state
    if (isSidebarOpen) {
      body.classList.add('overflow-hidden');
    } else {
      body.classList.remove('overflow-hidden');
    }
  
    // Handling workouts and currentWorkoutIndex state
    if (workouts && workouts.length > 0 && currentWorkoutIndex < workouts.length) {
      setIsLoading(true);
      processJsonData(workouts[currentWorkoutIndex]);
      setIsLoading(false);
    }
  
    // Cleanup function for sidebar state
    return () => {
      body.classList.remove('overflow-hidden');
    };
  }, [isSidebarOpen, workouts, currentWorkoutIndex]); 


  const handleLogOut = () => handleSignOut(navigate); 


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
  


  return (
    <div className="bg-black">
      <Title isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className={`w-60 absolute top-0 left-0 z-50 h-full bg-orange-500 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
        <button onClick={() => {navigate('/home');}} className="ml-5  text-left py-2 px-4 hover:bg-orange-600 transition-colors duration-150">Home</button>
        <button onClick={() => {navigate('/singleworkout', { state: { avgstats: avgstats } }); setIsSidebarOpen(!isSidebarOpen)}} className="ml-5  text-left py-2 px-4 hover:bg-orange-600 transition-colors duration-150">Single Workouts</button>
        <button onClick={() => {handleLogOut(); }} className="ml-5 text-left py-2 px-4 hover:bg-orange-600 transition-colors duration-150">Sign Out</button>
      </nav>
    </div>
</div>
      <div className="pt-10">
  {isLoading ? (
    <div className="fixed inset-0 bg-black z-40 flex justify-center items-center">
      <Loading />
    </div>
  ) : (
    <>
    <div className='flex justify-center mb-3'>
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
                    }} avg={avgstats} />
                    <div className="max-w-xs mx-auto md:max-w-3xl">
                      <Graph data={graph.map(item => ({
                        timestamp: item.timestamp,
                        hand:item.hand,
                        speed: item.speed,
                        acceleration: item.acceleration,
                        force:item.force,
                        fistType:item.fistType
                        }))} 
                        singleWorkout={true} />
                      <Combos combos={combos} />
                    </div>
                  </>
                )}
              </div></>
  )}
</div>
</div>

  );
};

export default SingleWorkouts;
