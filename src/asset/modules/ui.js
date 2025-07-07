import projectManager from './projectManager'
import todoManager from './todoManager'

class UIManager {
	constructor() {
		this.projects = projectManager.getAllProjects()
		this.todos = todoManager.getAllTodo()
		this.currentPage = 'all' // Default page

		this.appContent = document.getElementById('app-content')
		this.todoList = document.getElementById('todo-list')
		this.addProjectBtn = document.getElementById('add-project-btn')
		this.addTodoBtn = document.getElementById('add-todo-btn')

		this.eventListeners()
		this.renderSidebarProjectList()
		this.renderAllTodoPage()
	}

	setCurrentPage(pageName) {
		this.currentPage = pageName
	}

	eventListeners() {
		// Add Project button
		this.addProjectBtn.addEventListener('click', () => {
			this.showModal({
				title: '➕ Add Project',
				contentHTML: `
					<div class="form-group">
						<label for="projectName">Project Name</label>
						<input id="projectName" type="text" name="projectName" required min="3" max="20" />
					</div>
				`,
				onSubmit: (data) => {
					const projectName = data.projectName.trim()
					if (projectManager.addProject(projectName)) {
						this.renderSidebarProjectList()
					}
				},
			})
		})

		// Add Todo button
		this.addTodoBtn.addEventListener('click', () => {
			this.showModal({
				title: '➕ Add Todo',
				contentHTML: `
					<div class="form-group">
						<label for="project">Project</label>
						<select id="project" name="project">
							<option value="default" selected>Default</option>
							${this.projects
								.map(
									(project) => `
								<option value="${project.name}">${project.name}</option>
							`
								)
								.join('')}
						</select>
					</div>
					<div class="form-group">
						<label for="title">Title</label>
						<input id="title" type="text" name="title" required />
					</div>
					<div class="form-group">
						<label for="description">Description</label>
						<input id="description" type="text" name="description" />
					</div>
					<div class="form-group">
						<label for="dueDate">Due Date</label>
						<input id="dueDate" type="date" name="dueDate" required />
					</div>
					<div class="form-group">
						<label for="priority">Priority</label>
						<select id="priority" name="priority">
							<option value="low">Low</option>
							<option value="medium">Medium</option>
							<option value="high">High</option>
						</select>
					</div>
				`,
				onSubmit: (data) => {
					todoManager.addTodoItem(data)
					if (this.currentPage === 'all') {
						this.renderAllTodoPage()
					} else {
						this.renderPageProject(this.currentPage)
					}
				},
			})
		})
	}

	appendPageHeading(heading) {
		const h2El = document.createElement('h2')
		h2El.classList.add('page-heading')
		h2El.innerHTML = heading
		this.appContent.appendChild(h2El)
	}

	renderAllTodoPage(todoList = this.todos) {
		this.appContent.innerHTML = ''
		this.appendPageHeading('All')

		this.renderTodo(todoList)
	}

	renderTodo(todos) {
		const todolist = document.createElement('ul')
		todolist.classList.add('todolist')

		if (todos.length === 0) {
			this.renderEmptyTodoMessage('No todos found. Please add some!')
			this.appContent.appendChild(todolist)
			return
		}

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
			desc.textContent = todo.description || 'No description provided.'
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

	renderSidebarProjectList() {
		const projectListEl = document.getElementById('project-list')
		projectListEl.innerHTML = '' // Clear cũ nếu có

		const projects = projectManager.getAllProjects()
		if (projects.length > 0) {
			projects.forEach((project) => {
				const li = document.createElement('li')
				li.className = 'project-item'

				const span = document.createElement('span')
				span.className = 'project-item-label'
				span.textContent = project.name

				// Optional: gắn click để render todo theo project
				li.addEventListener('click', () => {
					this.renderPageProject(project.name)
					this.setCurrentPage(project.name)
				})

				li.appendChild(span)
				projectListEl.appendChild(li)
			})
		}
	}

	renderPageProject(projectName) {
		this.appContent.innerHTML = ''
		this.appendPageHeading(projectName)

		const filteredTodos = this.todos.filter(
			(todo) => todo.project === projectName
		)

		if (filteredTodos.length === 0) {
			this.renderEmptyTodoMessage(
				`No todos found in project "${projectName}". Please add some!`
			)
			return
		}

		this.renderTodo(filteredTodos)
	}

	renderEmptyTodoMessage(message = 'No todos found. Please add some!') {
		const emptyMessage = document.createElement('div')
		emptyMessage.className = 'empty-message'
		emptyMessage.textContent = message
		this.appContent.appendChild(emptyMessage)
		return
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

export default uiManager
