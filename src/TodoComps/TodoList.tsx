import React from "react";

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
                                <input type="checkbox" 
                                    onChange={async () => {
                                        this.state.todoes.find(td => td.id===todo.id)!
                                            .tasks.find(t => t.name===task.name)!.isComplete = !task.isComplete  
                                        if (await this.update(todo)){
                                            this.setState({ todoes: this.state.todoes, loading: false}) 
                                        }
                                    }}
                                    checked={task.isComplete} />{task.isComplete? <s>{task.name}</s> : task.name}
                            </li>)}
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

    async update(td: Todo): Promise<boolean> {
        const response = await fetch(`https://localhost:44314/todo/upd/${td.id}`,
            {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(td)
            })
        return response.ok
    }
}