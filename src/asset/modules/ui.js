import todoManager from './todoManager'

class UIManager {
	constructor() {
		this.appContent = document.getElementById('app-content')
		this.todoList = document.getElementById('todo-list')
	}

	appendPageHeading(heading) {
		const h2El = document.createElement('h2')
		h2El.classList.add('page-heading')
		h2El.innerHTML = heading
		this.appContent.appendChild(h2El)
	}

	renderAllTodoPage() {
		this.appContent.innerHTML = ''
		this.appendPageHeading('All')

		const todolist = document.createElement('ul')
		todolist.classList.add('todolist')

		const todos = todoManager.getAllTodo()

		todos.forEach((todo) => {
			const li = document.createElement('li')
			li.className =
				'todo-item' +
				(todo.completed ? ' completed' : '') +
				` priority-${todo.priority}`

			// checkbox
			const checkbox = document.createElement('input')
			checkbox.type = 'checkbox'
			checkbox.name = 'completed'
			checkbox.checked = todo.completed
			checkbox.addEventListener('change', () => {
				todoManager.toggleComplete(todo.id)
				this.renderAllTodoPage()
			})

			// content div
			const content = document.createElement('div')
			content.className = 'todo-content'

			// title
			const title = document.createElement('div')
			title.className = 'todo-title'
			title.textContent = todo.title
			title.addEventListener('click', () => {
				desc.style.display =
					desc.style.display === 'none' ? 'block' : 'none'
			})

			// description
			const desc = document.createElement('div')
			desc.className = 'todo-description'
			desc.textContent = todo.description || ''
			desc.style.display = 'none'

			// meta: due date + priority
			const meta = document.createElement('div')
			meta.className = 'todo-meta'
			meta.innerHTML = `<span>📅 ${todo.dueDate}</span>`

			content.append(title, desc, meta)

			// Edit button
			const editBtn = document.createElement('button')
			editBtn.className = 'editBtn'
			editBtn.textContent = '✏️'
			editBtn.addEventListener('click', () => {
				this.showModal({
					title: '✏️ Edit Todo',
					contentHTML: `
                    <div class="form-group">
                        <label for="title" >Title</label>
                        <input id="title" type="text" name="title" value="${
							todo.title
						}" required />
                    </div>
                    <div class="form-group">
                        <label for="description">Description</label>
                        <input id="description" type="text" name="description" value="${
							todo.description
						}" />
                    </div>
                    <div class="form-group">
                    <label for="dueDate">Due Date</label>
                    <input id="dueDate" type="date" name="dueDate" value="${
						todo.dueDate
					}" required />
                    </div>
                    <div class="form-group">
                    <label for="priority">Priority</label>
                    <select id="priority" name="priority">
                        <option value="low" ${
							todo.priority === 'low' ? 'selected' : ''
						}>Low</option>
                        <option value="medium" ${
							todo.priority === 'medium' ? 'selected' : ''
						}>Medium</option>
                        <option value="high" ${
							todo.priority === 'high' ? 'selected' : ''
						}>High</option>
                    </select>
                    </div>
                `,
					onSubmit: (data) => {
						todoManager.updateTodo(todo.id, data)
						this.renderAllTodoPage()
					},
					confirmText: 'Save',
					cancelText: 'Close',
				})
			})

			// delete button
			const delBtn = document.createElement('button')
			delBtn.className = 'deleteBtn'
			delBtn.textContent = '🗑️'
			delBtn.addEventListener('click', () => {
				todoManager.removeTodo(todo.id)
				this.renderAllTodoPage()
			})

			li.append(checkbox, content, editBtn, delBtn)
			todolist.appendChild(li)
		})

		this.appContent.appendChild(todolist)
	}

	showModal({
		title = '',
		contentHTML = '',
		onSubmit,
		confirmText = 'Save',
		cancelText = 'Cancel',
	}) {
		const modalContainer = document.getElementById('modal-container')
		modalContainer.innerHTML = ''
		modalContainer.style.display = 'flex'

		const modal = document.createElement('div')
		modal.className = 'modal'

		modal.innerHTML = `
			<h3>${title}</h3>
			<form id="modal-form">
				${contentHTML}
				<div class="modal-actions">
					<button type="submit" class="btn btn--medium modal-confirm">${confirmText}</button>
					<button type="button" class="btn btn--medium modal-close">${cancelText}</button>
				</div>
			</form>
		`

		modalContainer.appendChild(modal)

		// Submit
		modal.querySelector('#modal-form').addEventListener('submit', (e) => {
			e.preventDefault()
			const formData = new FormData(e.target)
			const data = Object.fromEntries(formData.entries())

			if (onSubmit) onSubmit(data)

			modalContainer.style.display = 'none'
		})

		// Cancel
		modal.querySelector('.modal-close').addEventListener('click', () => {
			modalContainer.style.display = 'none'
		})
	}
}

const uiManager = new UIManager()
Object.freeze(uiManager) // đảm bảo không bị chỉnh sửa từ bên ngoài

export default uiManager
