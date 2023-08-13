import { useEffect } from 'react';

import Header from './Header';
import Main from './Main';

export default function App() {
  useEffect(() => {
    // async function question() {
    //   const data = await fetch(`http://localhost:8000/questions`);
    //   const question = await data.json();
    //   console.log(question);
    // }
    // question();
    fetch(`http://localhost:8000/questions`)
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.err('Error'));
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        <p>1/15</p>
        <p>Question?</p>
      </Main>
    </div>
  );
}
