import { useState } from 'react';
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from 'react-icons/md';

const Controls = ({ page, setPage, amount }) => {
  // Each page has 10 echoes
  const [pagesAmount, setPagesAmount] = useState(Math.ceil(amount / 10));

  return (
    <div className='controls-horizontal'>
      <button
        className={`controls prev ${page === 0 ? 'hidden' : ''}`}
        onClick={() => setPage(page - 1)}>
        <MdOutlineKeyboardArrowLeft size={20} />
      </button>
      <button
        className={`controls next ${page === pagesAmount - 1 ? 'hidden' : ''}`}
        onClick={() => setPage(page + 1)}>
        <MdOutlineKeyboardArrowRight size={20} />
      </button>
    </div>
  );
};

export default Controls;
