import React, { Component } from "react";

interface Task{
    name: string;
    isComplete: boolean;
}

interface Todo{
    id: string;
    name: string;
    owner: string;
    tasks: Task[];
}

export default class TodoList extends React.Component<{ owner: string }, { todoes: Todo[], loading: boolean }>
{
    constructor (props: any){
        super(props)
        this.state = { todoes: [], loading: true}
    }

    componentDidMount(): void {
        this.populate()
    }

    renderTodoes(todoes: Todo[]) {
        return (<div>
            {
                todoes.map(todo =>
                    <div key={todo.id}>
                        <h3>{todo.name} <i>({todo.owner})</i> </h3>                        
                        <ul>
                        {todo.tasks.map(task =>
                            <li key={`${todo.id}-${task.name}`}>
                            <input type="checkbox" checked={task.isComplete} />{task.name} </li>)}
                        </ul>
                    </div>
                )
            }
        </div>)
    }

    render() {
        var comp = this.state.loading ? <p><em>Loading...</em></p>
            : this.renderTodoes(this.state.todoes);
        
        return(
            <div>
                <h1 id="todoList">ToDoes</h1>
                {comp}
            </div>
        )
    }

    async populate() {
        const response = await fetch("https://localhost:44314/todo")
        const data = await response.json()
        this.setState({todoes: data, loading: false})
    }
}