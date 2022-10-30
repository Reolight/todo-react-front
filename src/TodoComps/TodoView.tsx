import React, { useState } from "react";
import Todo from "./interfaces/Todo";
import Backend from "./service/Backend";
import TodoEdit from "./TodoEdit";

interface viewProp{
    todo: Todo,
    callback: (todo: Todo, taskName: string) => void
    deleteback: () => void
    isOwner: boolean
}

export default function TodoView(props: viewProp): JSX.Element
 {
    const [editmode, setEditmode] = useState(false)
    const {todo} = props;
    
    const editModeExit = () => setEditmode(false);

    const del = async () => 
        await Backend.getInstance().delete("todo", todo.id)?
            props.deleteback() 
            : alert(`Smth wrong. Todo ${todo.name} with id = ${todo.id} wasn't deleted`)

    return editmode? <TodoEdit editable={todo} callback={editModeExit} owner={todo.name} />
        : (<div key={todo.id} className="card">
            <h3>{todo.name} <i>({todo.owner})</i> </h3>                        
            <ul>
            {todo.tasks.map(task =>
                <li key={`${todo.id}-${task.name}`}>
                    <input type="checkbox" onChange={() =>props.callback(todo, task.name) }
                        checked={task.isComplete} />{task.isComplete? <s>{task.name}</s> : task.name}
                </li>)}
            </ul>
            {props.isOwner && 
                <div className="flex flex-row">
                    <button 
                        className="btn-outline-success"
                        onClick={()=>setEditmode(true)}
                    >edit</button>
                    <button
                        className="btn-outline-error"
                        onClick={del}
                    >delete</button>
                </div>
                }
        </div>
    )
}