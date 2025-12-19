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
           <div className="task-grid">
          <div className="task-card" onClick={() => navigate('/island')}>
            <div className="task-icon island-icon">🏝️</div>
            <div className="task-info">
              <h2 className="task-name">据点管理</h2>
              <p className="task-desc">管理据点生产、收取产出与补充资源</p>
            </div>
          </div>

          <div className="task-card" onClick={() => navigate('/search')}>
            <div className="task-icon search-icon">🔍</div>
            <div className="task-info">
              <h2 className="task-name">资源搜寻</h2>
              <p className="task-desc">派遣工人执行免费搜寻,获取丰厚资源</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
