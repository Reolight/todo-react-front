import React from "react";
import Todo from "./interfaces/Todo"
import TodoView from "./TodoView";
import TodoEdit from "./TodoEdit";
import Backend from "./service/Backend";

export default class TodoList extends React.Component<{ owner: string },{ todoes: Todo[], loading: boolean }>
{
    backend: Backend = Backend.getInstance()
    editMode: boolean = false

    constructor (props: any){
        super(props)
        this.state = { todoes: [], loading: true }
        this.updateTodo = this.updateTodo.bind(this)
        this.editModeEnable = this.editModeEnable.bind(this);
        this.populate = this.populate.bind(this)
    }

    componentDidMount(): void {
        this.populate()
    }

    render() {
        var comp;
        if (this.state.loading && this.editMode == false){
            return <p><em>Loading...</em></p>
        }

        comp = <div>
        <h1>ToDoes</h1>
            {this.state.todoes.map(td =>
                <TodoView 
                    key={td.id}
                    todo={td}
                    callback={this.updateTodo}
                    isOwner={td.owner === this.props.owner}
                    deleteback={this.populate}
                />
            )}
            <button className="btn-outline-success" onClick={this.editModeEnable}>Add new</button>
        </div>
        
        return !this.editMode? 
            comp 
            : <TodoEdit 
                    editable={null} 
                    owner={this.props.owner} 
                    callback={this.editModeExit} 
                />
    }

    async updateTodo(todo: Todo, taskName: string) {
        var task = todo.tasks.find(task => task.name === taskName)!
        this.state.todoes.find(t => t === todo)!
            .tasks.find(ts => ts.name === taskName)!.isComplete = !task.isComplete
        if (await this.backend.update("todo", todo.id, todo)){
            this.setState({ todoes: this.state.todoes, loading: false}) 
        }
    }

    async populate() {
        const data = await this.backend.getBy<Todo>("todo", this.props.owner)
        console.log(data)
        this.setState({todoes: data, loading: false})
    }

    
    editModeEnable(): void {
        this.editMode = true;
        this.setState({loading : true})
    }

    editModeExit(){
        this.setState({loading: true})
        this.editMode = false;
        this.populate()
    }
}