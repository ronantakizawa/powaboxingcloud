import React, { useState, useEffect } from 'react';
import { calculateStatistics, getCombos, getPunchData } from './datahandler';
import { ComboItem, JsonData, HomeProps, Statistics} from './types';
import StatisticBox from './components/StatisticBox';
import Graph from './components/Graph';
import powaLogo from './assets/powaboxing.svg';
import { getAuth, signOut } from '@firebase/auth';
import { useNavigate } from 'react-router-dom';
import Combos from './components/Combos';
import Loading from './components/Loading';
import { useLocation } from 'react-router-dom';



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
  

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
    setIsLoading(true);
    if (workouts && workouts.length > 0 && currentWorkoutIndex < workouts.length) {
      processJsonData(workouts[currentWorkoutIndex]);
      setIsLoading(false);
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
    <div className="bg-black">
      <div className="flex items-center justify-start w-full">
        <button onClick={toggleSidebar}>
          <p className='text-4xl mb-3'>&#9776;</p>
        </button>

        <div className="flex-grow"></div>

        <div className="flex items-center justify-center">
          <h1 className="text-3xl font-bold text-center">POWA Analytics</h1>
          <img src={powaLogo} alt="POWA logo" className="w-16 h-16 ml-2" />
        </div>

        <div className="flex-grow"></div>
      </div>

      <div className={`w-60 absolute top-0 left-0 z-50 h-full bg-orange-500 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
    <div className="flex flex-col items-start justify-between h-full p-4">
      <div className="flex w-full">
        <button onClick={toggleSidebar} className="text-white text-xl font-bold mb-10">
          &#10005; 
        </button>
        <div className="flex items-center justify-center mb-10 ml-5">
        <h1 className="text-l font-bold text-center">POWA Analytics</h1>
        <img src={powaLogo} alt="POWA logo" className="w-8 h-8 ml-2" />
        </div>

      </div>
      <nav className="flex flex-col w-full font-bold h-full -mt-8"> 
        <button onClick={() => {navigate('/home'); toggleSidebar();}} className="ml-5  text-left py-2 px-4 hover:bg-orange-600 transition-colors duration-150">Home</button>
        <button onClick={() => {navigate('/singleworkout', { state: { avgstats: avgstats } }); toggleSidebar();}} className="ml-5  text-left py-2 px-4 hover:bg-orange-600 transition-colors duration-150">Single Workouts</button>
        <button onClick={() => {handleSignOut(); toggleSidebar();}} className="ml-5 text-left py-2 px-4 hover:bg-orange-600 transition-colors duration-150">Sign Out</button>
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
                    <div className="max-w-lg ml-80">
                      <Graph data={data} singleWorkout={true} />
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
