
import React from 'react';
import Statistic from "./Statistic";
import { StatisticsProps } from '../types';

const StatisticBox: React.FC<StatisticsProps> = ({ stats }) => {
  return (
    <div className="bg-black p-4 bg-gray-800 shadow rounded-lg mb-10 mx-auto" style={{ maxWidth: '1200px' }}>
      <div className="text-center font-bold text-xl mb-4 text-white">Performance from Workouts</div>
      <div className="grid grid-cols-6 gap-y-5 gap-x-5">
        <Statistic title="Average Star Rating ⭐️" value={stats.avgStarRating.toFixed(2)} />
        <Statistic title="Average Speed" value={stats.avgSpeed.toFixed(2) + " km/h"} />
        <Statistic title="Average Acceleration" value={stats.avgAcceleration.toFixed(2) +" Gs"} />
        <Statistic title="Average Force" value={stats.avgForce.toFixed(2) + " Newtons" }/>
        <Statistic title="Most Common Hand" value={stats.modeHand === 0 ? "Left" : "Right"} />
        <Statistic title="Most Common Punch" value={stats.modePunchType} />
      </div>
    </div>
  );
};

export default StatisticBox;
