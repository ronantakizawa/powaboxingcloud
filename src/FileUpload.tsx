import React, { useState, useEffect } from 'react';
import { calculateStatistics, calculateAggregateStatistics, getPunchData, getCombos } from './datahandler';
import { Statistics, JsonData, ComboItem } from './types';
import StatisticBox from './components/StatisticBox';
import Graph from './components/Graph';
import Combos from './components/Combos';
import { Punch,FileUploadProps } from './types';



const FileUpload: React.FC<FileUploadProps> = ({ workouts }) => {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [graph, setGraph] = useState<Array<{ speed: number, force: number, acceleration: number, timestamp: string, hand:number | undefined, fistType:string }>>([]);
  const [combos,setCombos] = useState<ComboItem[][] | null>(null);

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
    <div className="p-4 max-w-lg mx-auto bg-black text-white">
      { 
        <div>
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
              <Graph data={data} />
            </>
          )}
        </div>
      }
    </div>
  );
};

export default FileUpload;
