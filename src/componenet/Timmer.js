import { useEffect } from 'react';

function Timmer({ dispatch, secondRemining }) {
  const mins = Math.floor(secondRemining / 60);
  const seconds = secondRemining % 60;

  useEffect(() => {
    const id = setInterval(() => {
      dispatch({ type: 'tick' });
    }, 1000);

    return () => clearInterval(id);
  }, [dispatch]);

  return (
    <div className="timer">
      {mins < 10 && '0'}
      {mins}:{seconds < 10 && '0'}
      {seconds}
    </div>
  );
}

export default Timmer;
