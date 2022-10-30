import React, { useEffect, useState } from "react";
import Task from "./interfaces/Task";
import Todo from "./interfaces/Todo";
import Backend from "./service/Backend";

interface editableProp{
    owner: string
    editable: Todo | null
    callback: () => void
}

export default function TodoEdit(props: editableProp) {
    const [todo, setTodo] = useState({} as Todo)
    const [errors, setErrors] = useState([] as string[])

    function init(){
        console.log(props.editable)
        const editable = !props.editable? 
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
        setTodo(editable)
    }


    useEffect(init, [props.editable, props.owner])
//---------------------HANDLERS------------------------------
    const onTaskChanged = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        let t: Task[] = todo.tasks
        t[index].name = e.target.value
        if (index + 1 === todo.tasks.length && todo.tasks[index].name !== ""){ //here new field is added if last contains smth
            t.push({isComplete: false, name: ""})
        } else if (index + 2 === todo.tasks.length && todo.tasks[index].name === ""
            && todo.tasks[index].name === ""){ //..if noth, new field is removed.
            t.pop()
        }

        setTodo({...todo, tasks: t})
    }

    const onTodoChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTodo({...todo, name: e.target.value})
    }

    function remove(index: number){
        let t = todo.tasks
        if (t.length == 1) 
            t[0].name = ""
        else t.splice(index, 1)
        setTodo({...todo, tasks: t})
    }

    function validate(): boolean{
        let err: string[] = []
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
        const backend: Backend = Backend.getInstance()
        if (todo.id === "")
            if (await backend.post("todo", todo))
                props.callback()
            else setErrors(["posted failed"])
        else
            if (await backend.update("todo", todo.id, todo))
                props.callback()
            else setErrors(["update failed"])
    }
//--------------------JSX ELEMENT------------------------------
    return !todo.tasks? <p>Loading</p> : (
        <div className="card">
            <input 
                type="text" 
                placeholder="Type todo name"
                onChange={onTodoChanged} 
                value={todo.name}
            />
            <i>({todo.owner})</i>
            <ul>
            {todo.tasks.map((task, index) =>
                <li key={index}>
                    <input
                        type="text"
                        placeholder="Task name"
                        onChange={(e) => onTaskChanged(e, index)}
                        value={task.name}
                    />
                    <button className="btn-outline-error-compact" onClick={() => remove(index)} >X</button>
                </li>)}
            </ul>
            <ul className="errors">
                {errors.map((error, index) => <li key={index}>{error}</li>)}
            </ul>
            <button className="btn-outline-success" onClick={onSave}>
                {todo.id === ""? "Add todo" : "Save todo"}
            </button>
        </div>
    )
}