import React, { useState } from "react";
import Todo from "./interfaces/Todo";
import Backend from "./service/Backend";

interface editableProp{
    owner: string
    editable: Todo | null
    callback: () => void
}

export default function TodoEdit(props: editableProp) {
    var editable = props.editable == null? 
        {
            id:"",
            name: "new todo",
            owner: props.owner,
            tasks: [{
                name:"",
                isComplete: false
            }]
        } as Todo
        : props.editable

    const [todo, setTodo] = useState(editable)
    const [errors, setErrors] = useState([] as string[])
//---------------------HANDLERS------------------------------
    const onTaskChanged = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        todo.tasks[index].name = e.target.value;
        if (index + 1 === todo.tasks.length && e.target.value !== ""){ //here new field is added if last contains smth
            todo.tasks.push({isComplete: false, name: ""})
        } else if (index + 2 === todo.tasks.length && e.target.value === ""){ //..if noth, new field is removed.
            todo.tasks.pop()
        }
    }

    const onTodoChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        todo.name = e.target.value;
        console.log(todo.name)
    }

    function remove(index: number){
        if (todo.tasks.length === 1)
            todo.tasks[0] = {name: "", isComplete: false}
        else
            todo.tasks.splice(index, 1);
        setTodo(todo)
    }

    function validate(): boolean{
        var err: string[] = []
        if (todo.tasks[todo.tasks.length - 1].name === "")
        todo.tasks.pop();
        if (todo.name === "") err.push("ToDo has no name!")
        todo.tasks.forEach((task, index) => {
            if (task.name === "") err.push(`Field ${index + 1} has no name!`)
        })

        setErrors(err)
        return err.length === 0
    }

    async function onSave(){
        if (!validate()) return
        var backend: Backend = Backend.getInstance()
        if (todo.id === "")
            if (await backend.post("todo", todo))
                props.callback()
            else setErrors([...errors, "posted failed"])
        else
            if (await backend.update("todo", todo.id, todo))
                props.callback()
            else setErrors([...errors, "update failed"])
    }
//--------------------JSX ELEMENT------------------------------
    return(
        <div className="card">
            <input type="text" placeholder="Type todo name" onChange={onTodoChanged}/>
            <ul>
            {todo.tasks.map((task, index) =>
                <li key={index}>
                    <input
                        type="text"
                        placeholder="Task name"
                        onChange={(e) => onTaskChanged(e, index)}/>
                    <button onClick={() => remove(index)} >X</button>
                </li>)}
            </ul>
            <ul className="errors">
                {errors.map((error, index) => <li key={index}>{error}</li>)}
            </ul>
            <button className="btn-outline-success" onClick={onSave}>
                {editable.id === ""? "Add todo" : "Save todo"}
            </button>
        </div>
    )
}