import todoManager from './asset/modules/todoManager'
import uiManager from './asset/modules/ui'
import './styles.css'

todoManager.addTodoItem({
	projectId: 1,
	title: 'Learn JS',
	description: '',
	dueDate: '2025-07-10',
	priority: 'high',
})

todoManager.addTodoItem({
	projectId: 1,
	title: 'Learn CSS',
	description: '',
	dueDate: '2025-07-10',
	priority: 'high',
})

todoManager.addTodoItem({
	projectId: 1,
	title: 'Learn Git',
	description: '',
	dueDate: '2025-07-10',
	priority: 'low',
})

todoManager.addTodoItem({
	projectId: 1,
	title: 'Learn React',
	description: '',
	dueDate: '2025-07-10',
	priority: 'medium',
})

todoManager.addTodoItem({
	projectId: 1,
	title: 'Learn Nodejs',
	description: '',
	dueDate: '2025-07-10',
	priority: '',
})

uiManager.renderAllTodoPage()
