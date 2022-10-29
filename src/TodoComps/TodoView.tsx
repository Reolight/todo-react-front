import React from "react";
import Todo from "./interfaces/Todo";

interface viewProp{
    todo: Todo,
    callback: (todo: Todo, taskName: string) => void
    isOwner: boolean
}

export default function TodoView(props: viewProp): JSX.Element
 {
    var {todo} = props;
    return(
        <div key={todo.id} className="card">
            <h3>{todo.name} <i>({todo.owner})</i> </h3>                        
            <ul>
            {todo.tasks.map(task =>
                <li key={`${todo.id}-${task.name}`}>
                    <input type="checkbox" onChange={() =>props.callback(todo, task.name) }
                        checked={task.isComplete} />{task.isComplete? <s>{task.name}</s> : task.name}
                </li>)}
            </ul>
        </div>
    )
}