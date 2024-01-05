import React from 'react';
import { StatisticProps } from '../types';

const Statistic: React.FC<StatisticProps> = ({ title, value }) => {
    // Function to render the value

    return (
        <div className="text-left bg-gray-700 p-3 rounded-lg ">
            <div className="text-gray-400 text-sm font-medium">{title}</div>
            <div className="text-lg font-bold text-white">{value}</div>
        </div>
    );
};

export default Statistic;
