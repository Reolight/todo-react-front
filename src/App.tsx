import React, { useState } from 'react';
import Backend from './TodoComps/service/Backend';
import './App.css';
import TodoList from './TodoComps/TodoList';
import Login from './TodoComps/Login';

function App() {
  var [own, setOwn] = useState("")
  Backend.getInstance("https://localhost:44314")

  return (
    <div>
      { own === ""? 
        <Login callback={setOwn} />
        : <TodoList owner={own} />
      }
    </div> 
  );
}

export default App;
