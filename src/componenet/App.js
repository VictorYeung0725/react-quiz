import { useEffect, useReducer } from 'react';
import Error from './Error';

import Header from './Header';
import Loader from './Loader';
import Main from './Main';
import Question from './Question';
import StartScreen from './StartScreen';

const initialState = {
  question: [],
  //loading,error,ready, active,finished
  status: 'loading',
  index: 0,
  answer: null,
  score: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return {
        ...state,
        question: action.payload,
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
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        score:
          action.payload === question.correctOption
            ? state.score + 1
            : state.score,
      };
    default:
      throw new Error()('Action Unknown');
  }
}

export default function App() {
  const [{ question, status, index, answer }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const numQuestion = question.length;
  useEffect(() => {
    // async function question() {
    //   const data = await fetch(`http://localhost:8000/questions`);
    //   const question = await data.json();
    //   console.log(question);
    // }
    // question();
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
          <Question
            question={question[index]}
            dispatch={dispatch}
            answer={answer}
          />
        )}
      </Main>
    </div>
  );
}
