function FinishedScreen({ points, maxPossiblePoints, highscore, dispatch }) {
  const precentage = (points / maxPossiblePoints) * 100;

  let emoji;
  if (precentage === 100) emoji = '🥇';
  if (precentage >= 80 && precentage < 100) emoji = '🎉';
  if (precentage >= 50 && precentage < 80) emoji = '🙃';
  if (precentage >= 0 && precentage < 50) emoji = '🤨';
  if (precentage === 0) emoji = '🤦‍♂️';

  return (
    <>
      <div className="result">
        <span>{emoji}</span> Your Scored <strong>{points}</strong> / out of{' '}
        {maxPossiblePoints} ({Math.ceil(precentage)}%)
      </div>
      <p className="highscore">(Highscore: {highscore} points)</p>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: 'restart' })}
      >
        Restart the Quiz
      </button>
    </>
  );
}

export default FinishedScreen;
