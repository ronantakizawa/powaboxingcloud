import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import CustomTooltip from './CustomToolTip';
import {GraphProps} from "../types"


const Graph: React.FC<GraphProps> = ({ data,singleWorkout }) => {

  const [graphResizeIndex1, setGraphResizeIndex1] = useState(2);
  const [graphResizeIndex2, setGraphResizeIndex2] = useState(2);
  const [graphResizeIndex3, setGraphResizeIndex3] = useState(2);
  const [chartWidthMultiplier, setChartWidthMultiplier] = useState(150);




  useEffect(() => {
    const handleResize = () => {
      // Change multiplier based on screen width
      if (window.innerWidth >= 768) {
        setChartWidthMultiplier(400); // Desktop
      } else {
        setChartWidthMultiplier(150); // Mobile
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const calculateSize = (data: GraphProps['data']) => {
    if (!Array.isArray(data)) {
      throw new Error('Input must be an array');
    }
    return Math.ceil(data.length / 2) + 1;
  }

const handleSliderChange1: React.ChangeEventHandler<HTMLInputElement> = (event) => {
  setGraphResizeIndex1(Number(event.target.value));
};

const handleSliderChange2: React.ChangeEventHandler<HTMLInputElement> = (event) => {
  setGraphResizeIndex2(Number(event.target.value));
};

const handleSliderChange3: React.ChangeEventHandler<HTMLInputElement> = (event) => {
  setGraphResizeIndex3(Number(event.target.value));
};
  
  return (
    <div className="chart-container space-y-4 mb-5 bg-black">
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-lg font-bold text-white mb-2 text-center">{singleWorkout ? "Speed Performance": "Average Speed from Workouts"} </h2>
        <div className="flex items-center space-x-4 mb-5">
          <h3 className="text-lg font-bold text-white">Zoom</h3>
          <input 
            type="range" 
            min="2" 
            max={calculateSize(data)*2}  
            value={graphResizeIndex1}
            onChange={handleSliderChange1}
            className="slider" 
          />
        </div>
        <div className="w-[150%] md:w-[75%] overflow-x-auto max-w-xs mx-auto md:max-w-3xl">
        <LineChart width={chartWidthMultiplier*graphResizeIndex1} height={300} data={data}>
          <XAxis dataKey="timestamp" interval="preserveStartEnd" />
          <YAxis label={{ value: 'Speed (km/h)', angle: -90, position: 'insideLeft' }} dataKey="speed" />
          <Tooltip content={<CustomTooltip active={undefined} payload={undefined} label={undefined} />} />
          <Line type="monotone" dataKey="speed" stroke="#FFA500" />
        </LineChart>
        </div>
        <div className="text-center mt-2">
            <span className="text-orange-400">Scroll to see data →</span>
          </div>
      </div>

      <div className="flex flex-col items-center justify-center">
        <h2 className="text-lg font-bold text-white mb-2 text-center">{singleWorkout ? "Acceleration Performance": "Average Acceleration from Workouts"}</h2>
        <div className="flex items-center space-x-4 mb-5">
          <h3 className="text-lg font-bold text-white mb">Zoom</h3>
          <input 
            type="range" 
            min="2" 
            max={calculateSize(data)*2}  
            value={graphResizeIndex2}
            onChange={handleSliderChange2}
            className="slider" 
          />
        </div>
        <div className="w-[150%] md:w-[75%] overflow-x-auto max-w-xs mx-auto md:max-w-3xl">
        <LineChart width={graphResizeIndex2*chartWidthMultiplier} height={300} data={data}>
          <XAxis dataKey="timestamp"/>
          <YAxis label={{ value: 'Acceleration (Gs)', angle: -90, position: 'insideLeft' }} dataKey="acceleration"/>
          <Tooltip content={<CustomTooltip active={undefined} payload={undefined} label={undefined} />} />
          <Line type="monotone" dataKey="acceleration" stroke="#FFA500" />
        </LineChart>
        </div>
        <div className="text-center mt-2">
            <span className="text-orange-400">Scroll to see data →</span>
          </div>
      </div>

      <div className="flex flex-col items-center justify-center">
        <h2 className="text-lg font-bold text-white mb-2 text-center">{singleWorkout ? "Force Performance": "Average Force from Workouts"}</h2>
        <div className="flex items-center space-x-4 mb-5">
          <h3 className="text-lg font-bold text-white mb">Zoom</h3>
          <input 
            type="range" 
            min="2" 
            max={calculateSize(data)*2}  
            value={graphResizeIndex3}
            onChange={handleSliderChange3}
            className="slider" 
          />
        </div>
        <div className="w-[150%] md:w-[75%] overflow-x-auto max-w-xs mx-auto md:max-w-3xl">
        <LineChart width={graphResizeIndex3*chartWidthMultiplier} height={300} data={data}>
          <XAxis dataKey="timestamp" />
          <YAxis label={{ value: 'Force (Newtons)', angle: -90, position: 'insideLeft' }} dataKey="force"/>
          <Tooltip content={<CustomTooltip active={undefined} payload={undefined} label={undefined} />} />
          <Line type="monotone" dataKey="force" stroke="#FFA500" />
        </LineChart>
        </div>
        <div className="text-center mt-2">
            <span className="text-orange-400">Scroll to see data →</span>
          </div>
      </div>
    </div>
  );
};

export default Graph;
