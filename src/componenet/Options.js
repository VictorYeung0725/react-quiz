function Options({ questions, dispatch, answer }) {
  const hasAnswer = answer !== null;
  return (
    <div className="options">
      {questions.options.map((opt, index) => (
        <button
          className={`btn btn-option ${index === answer ? 'answer' : ''} 
          ${
            hasAnswer
              ? index === questions.correctOption
                ? 'correct'
                : 'wrong'
              : ''
          }
            `}
          key={opt}
          disabled={hasAnswer}
          onClick={() => dispatch({ type: 'newAnswer', payload: index })}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export default Options;
