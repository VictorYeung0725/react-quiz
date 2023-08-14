import { useEffect, useReducer } from 'react';
import Error from './Error';
import FinishedScreen from './FinishedScreen';
import Footer from './Footer';

import Header from './Header';
import Loader from './Loader';
import Main from './Main';
import NextButton from './NextButton';
import ProgressBar from './ProgressBar';
import Question from './Question';
import StartScreen from './StartScreen';
import Timmer from './Timmer';

const SECS_PER_QUESTION = 10;

const initialState = {
  questions: [],
  //loading,error,ready, active,finished
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondRemining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return {
        ...state,
        questions: action.payload,
        status: 'ready',
      };
    case 'dataFailed':
      return {
        ...state,
        status: 'error',
      };
    case 'start':
      return {
        ...state,
        status: 'active',
        secondRemining: state.questions.length * SECS_PER_QUESTION,
      };
    case 'newAnswer':
      const question1 = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question1.correctOption
            ? state.points + question1.points
            : state.points,
      };
    case 'nextQuestion':
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };

    case 'finished':
      return {
        ...state,
        status: 'finished',
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case 'restart':
      return { ...initialState, questions: state.questions, status: 'ready' };
    case 'tick':
      return {
        ...state,
        secondRemining: state.secondRemining - 1,
        status: state.secondRemining === 0 ? 'finished' : state.status,
      };
    default:
      throw new Error()('Action Unknown');
  }
}

export default function App() {
  const [
    { questions, status, index, answer, points, highscore, secondRemining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestion = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );
  console.log(maxPossiblePoints);

  useEffect(() => {
    // async function questions() {
    //   const data = await fetch(`http://localhost:8000/questions`);
    //   const questions = await data.json();
    //   console.log(questions);
    // }
    // questions();
    fetch(`http://localhost:8000/questions`)
      .then((res) => res.json())
      .then((data) => dispatch({ type: 'dataReceived', payload: data }))
      .catch((err) => dispatch({ type: 'dataFailed' }));
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && (
          <StartScreen numQuestion={numQuestion} dispatch={dispatch} />
        )}
        {status === 'active' && (
          <>
            <ProgressBar
              index={index}
              numQuestions={numQuestion}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              questions={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timmer dispatch={dispatch} secondRemining={secondRemining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestion={numQuestion}
              />
            </Footer>
          </>
        )}
        {status === 'finished' && (
          <FinishedScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
