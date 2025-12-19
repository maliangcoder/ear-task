import { useNavigate } from 'react-router-dom'
import { Card } from 'antd-mobile'
import { useAuthStore } from '@/store/useAuthStore'
import './index.css'

export default function TaskList() {
  const navigate = useNavigate()
  const userInfo = useAuthStore((state) => state.userInfo)
  const logout = useAuthStore((state) => state.logout)

  const tasks = [
    {
      id: 'island',
      title: '据点管理',
      description: '查看据点状态,收取产出,补充资源',
      path: '/island'
    }
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="task-list-container">
      <div className="task-header">
        <div>
          <h1 className="task-title">EAR Task</h1>
          <p className="task-user">你好, {userInfo?.name}</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          退出
        </button>
      </div>

      <div className="task-cards">
        {tasks.map((task) => (
          <Card
            key={task.id}
            className="task-card"
            onClick={() => navigate(task.path)}
          >
            <div className="task-card-content">
              <h3 className="task-card-title">{task.title}</h3>
              <p className="task-card-desc">{task.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
