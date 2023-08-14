import { useEffect, useReducer } from 'react';
import Error from './Error';

import Header from './Header';
import Loader from './Loader';
import Main from './Main';
import NextButton from './NextButton';
import Question from './Question';
import StartScreen from './StartScreen';

const initialState = {
  questions: [],
  //loading,error,ready, active,finished
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
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
    default:
      throw new Error()('Action Unknown');
  }
}

export default function App() {
  const [{ questions, status, index, answer }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const numQuestion = questions.length;
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
            <Question
              questions={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <NextButton dispatch={dispatch} answer={answer} />
          </>
        )}
      </Main>
    </div>
  );
}
