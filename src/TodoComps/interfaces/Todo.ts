import Task from "./Task";

export default interface Todo{
    id: string;
    name: string;
    owner: string;
    tasks: Task[];
}