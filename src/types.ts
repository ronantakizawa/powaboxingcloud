export interface Punch {
    id: string;
    timestamp: number;
    starRating: number;
    acceleration: number;
    speed: number;
    inTime: number;
    outTime: number;
    force: number;
    hand: number;
    fistType: string;
  }
  
export interface JsonData {
    punches: Punch[];
  }

export interface FileUploadProps {
    workouts: JsonData[];
  }
  
  export interface Statistics {
    avgStarRating: number;
    avgAcceleration: number;
    avgSpeed: number;
    avgForce: number;
    modeHand: number;
    modePunchType: string;
  }
  export interface StatisticProps {
    title: string;
    value: number | string;
  }
  
  export interface ScrapedData {
    starRating: number;
    acceleration: number;
    speed: number;
    force: number;
    hands: number[];
    fistTypes: string[];
  }

  export interface AggregateStatistics {
    aggregatedStats: Statistics;
    starArray: number[];
    speedArray: number[];
    accelerationArray: number[];
    forceArray: number[];
    handArray: number[];
    fistTypeArray: string[];
  }

  export type GraphProps = {
    data: Array<{
      timestamp: string | undefined;
      hand:number | undefined;
      speed: number;
      acceleration: number;
      force: number;
    }>;
  };

  export type StatisticsProps = {
    stats: {
      avgStarRating: number;
      avgAcceleration: number;
      avgSpeed: number;
      avgForce: number;
      modeHand: number;
      modePunchType: string;
    };
  };

  export type ComboItem = {
  fistType: string;
  hand: number;
  timestamp: string;
};