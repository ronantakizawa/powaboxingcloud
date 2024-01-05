import React from 'react';
import { ComboItem} from '../types';

interface ComboProps {
  combos: ComboItem[][] | null;
}

const Combo: React.FC<{ combo: ComboItem[] }> = ({ combo }) => {
  return (
    // Use 'flex-wrap' to allow items to wrap and 'gap-2' for spacing between them
    <div className="flex items-center gap-2 p-2 rounded bg-gray-700 flex-wrap">
      {combo.map((punch, index) => (
        // 'mr-2' adds margin to the right of each punch except the last one
        <span key={index} className="text-white font-mono">
          {punch.fistType + (punch.hand === 0 ? '(L)' : '(R)')} {index < combo.length - 1 ? ',' : ''}
        </span>
      ))}
      <p className="text-orange-400">{combo[0].timestamp + "-"+combo[combo.length-1].timestamp}</p>
    </div>
  );
};

const Combos: React.FC<ComboProps> = ({ combos }) => {
  if (!combos) {
    return null;
  }

  return (
    <div className="p-6 bg-gray-800 shadow rounded-lg mb-10 overflow-hidden" style={{ height: '500px', overflowY: 'auto' }}>
      <div className="font-bold text-2xl mb-4 text-white">Combos</div>
      <div className="flex flex-col space-y-3">
        {combos.map((combo: ComboItem[], index: number) => (
          <Combo key={index} combo={combo} />
        ))}
      </div>
    </div>
  );
};

export default Combos;
