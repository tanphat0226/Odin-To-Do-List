import { v4 as uuidv4 } from 'uuid'

class TodoManager {
	constructor() {
		if (TodoManager.instance) {
			return TodoManager.instance
		}

		this.todos = []
		TodoManager.instance = this
	}

	addTodoItem({ project, title, description, dueDate, priority }) {
		const newTodo = {
			id: uuidv4(),
			title,
			description,
			dueDate,
			priority,
			project,
			completed: false,
		}

		this.todos.push(newTodo)
	}

	getAllTodo() {
		return this.todos
	}

	removeTodo(id) {
		const index = this.todos.findIndex((todo) => todo.id === id)
		if (index !== -1) {
			this.todos.splice(index, 1)
		}
	}

	updateTodo(id, data) {
		const index = this.todos.findIndex((todo) => todo.id === id)
		if (index !== -1) {
			this.todos[index] = { ...this.todos[index], ...data }
		}
	}

	toggleComplete(id) {
		const todo = this.todos.find((t) => t.id === id)
		if (todo) todo.completed = !todo.completed
	}
}

const todoManager = new TodoManager()
Object.freeze(todoManager) // đảm bảo không bị chỉnh sửa từ bên ngoài

export default todoManager
