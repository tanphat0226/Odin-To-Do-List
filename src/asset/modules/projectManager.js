import storage from './storage'

class ProjectManager {
	constructor() {
		this.projects = storage.getItem('projects') || []
		if (ProjectManager.instance) {
			return ProjectManager.instance
		}
		ProjectManager.instance = this
	}

	addProject(name) {
		const newProjectName = name.trim()
		if (!newProjectName) return false // Không thêm nếu tên rỗng
		if (newProjectName.length < 3) return false // Không thêm nếu tên quá ngắn
		if (newProjectName.length > 20) return false // Không thêm nếu tên quá dài

		const isExistingProject = this.projects.some(
			(project) => project.name === newProjectName
		)
		if (isExistingProject) {
			return false // Không thêm nếu tên đã tồn tại
		}

		const projectObj = {
			name: newProjectName,
			todos: [],
		}

		if (!name || this.projects.includes(name)) {
			return false // Không thêm nếu tên rỗng hoặc đã tồn tại
		} else {
			storage.setItem('projects', [...this.projects, projectObj])
			this.projects.push(projectObj) // Cập nhật danh sách dự án
			return true // Thêm thành công
		}
	}

	getAllProjects() {
		return this.projects
	}
}

const projectManager = new ProjectManager()
Object.freeze(projectManager) // đảm bảo không bị chỉnh sửa từ bên ngoài

export default projectManager
