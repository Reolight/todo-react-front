import React from "react";
import Todo from "./interfaces/Todo"
import Task from "./interfaces/Task"
import TodoView from "./TodoView";

export default class TodoList extends React.Component<{ owner: string }, { todoes: Todo[], loading: boolean }>
{
    constructor (props: any){
        super(props)
        this.state = { todoes: [], loading: true}
        this.updateTodo = this.updateTodo.bind(this)
    }

    componentDidMount(): void {
        this.populate()
    }

    render() {
        var comp = this.state.loading ? <p><em>Loading...</em></p>
            : this.state.todoes.map(td =>
                <TodoView key={td.id} todo={td} callback={this.updateTodo} />
            )

        return(
            <div>
                <h1 id="todoList">ToDoes</h1>
                {comp}
            </div>
        )
    }

    async updateTodo(todo: Todo, taskName: string) {
        var task = todo.tasks.find(task => task.name == taskName)!
        this.state.todoes.find(t => t == todo)!
            .tasks.find(ts => ts.name === taskName)!.isComplete = !task.isComplete
        if (await this.updateOnBack(todo)){
            this.setState({ todoes: this.state.todoes, loading: false}) 
        }
    }

    async populate() {
        const response = await fetch("https://localhost:44314/todo")
        const data = await response.json()
        this.setState({todoes: data, loading: false})
    }

    async updateOnBack(td: Todo): Promise<boolean> {
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