import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PullToRefresh, Dialog, Toast, DotLoading } from 'antd-mobile'
import { LeftOutline } from 'antd-mobile-icons'
import { islandApi } from '@/api/island'
import { useIslandStore } from '@/store/useIslandStore'
import { formatDuration, calculateResourceNeeded } from '@/utils/time'
import type { Island } from '@/types/island'
import './index.css'

export default function IslandPage() {
  const navigate = useNavigate()
  const { islands, loading, setIslands, setLoading } = useIslandStore()
  const [operating, setOperating] = useState(false)

  useEffect(() => {
    fetchIslands()
  }, [])

  const fetchIslands = async () => {
    setLoading(true)
    try {
      const res = await islandApi.getList()
      setIslands(res.data.records)
    } catch (error) {
      console.error('获取据点列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStart = async (island: Island) => {
    const needed = calculateResourceNeeded(island.resource)
    const message = needed > 0
      ? `需要补充 ${needed} 个资源才能生产24小时,是否确认启动?`
      : '资源充足,是否确认启动?'

    const result = await Dialog.confirm({
      content: message
    })

    if (result) {
      setOperating(true)
      try {
        const res = await islandApi.start({ id: island.id, start: true })
        if (res.data) {
          Toast.show({ icon: 'success', content: '启动成功' })
          fetchIslands()
        }
      } catch (error) {
        console.error('启动失败:', error)
      } finally {
        setOperating(false)
      }
    }
  }

  const handleCollect = async (island: Island) => {
    const result = await Dialog.confirm({
      content: `确认收取 ${island.produceNum.toFixed(2)} 个产出?`
    })

    if (result) {
      setOperating(true)
      try {
        const res = await islandApi.collect({ id: island.id })
        if (res.data) {
          Toast.show({ icon: 'success', content: '收取成功' })
          fetchIslands()
        }
      } catch (error) {
        console.error('收取失败:', error)
      } finally {
        setOperating(false)
      }
    }
  }

  const handleSupplement = async (island: Island) => {
    const result = await Dialog.confirm({
      content: '确认补充 10 个资源?'
    })

    if (result) {
      setOperating(true)
      try {
        const res = await islandApi.supplement({ id: island.id, consume: 10 })
        if (res.data) {
          Toast.show({ icon: 'success', content: '补充成功' })
          fetchIslands()
        }
      } catch (error) {
        console.error('补充失败:', error)
      } finally {
        setOperating(false)
      }
    }
  }

  const getStatusText = (island: Island) => {
    if (island.status === 'UN_USE') {
      return '未启动'
    }
    if (island.status === 'DOING') {
      return '生产中'
    }
    return '已停止'
  }

  if (loading && islands.length === 0) {
    return (
      <div className="island-loading">
        <DotLoading color="primary" />
      </div>
    )
  }

  return (
    <div className="island-container">
      <div className="island-header">
        <LeftOutline fontSize={24} onClick={() => navigate(-1)} />
        <h1 className="island-title">据点管理</h1>
        <div style={{ width: 24 }} />
      </div>

      <PullToRefresh onRefresh={fetchIslands}>
        <div className="island-list">
          {islands.map((island) => {
            const showStartButton = island.status === 'UN_USE'
            return (
              <div key={island.id} className="island-card">
                <div className="island-card-header">
                  <img src={island.nftMainImg} alt={island.nftTitle} className="island-img" />
                  <div className="island-info">
                    <h3 className="island-name">{island.nftTitle}</h3>
                    <p className="island-number">{island.numberStr}</p>
                  </div>
                </div>

                <div className="island-stats">
                  <div className="island-stat-item">
                    <span className="stat-label">运行时长</span>
                    <span className="stat-value">{formatDuration(island.startTime)}</span>
                  </div>
                  <div className="island-stat-item">
                    <span className="stat-label">状态</span>
                    <span className={`stat-value ${showStartButton ? 'status-stopped' : 'status-running'}`}>
                      {getStatusText(island)}
                    </span>
                  </div>
                  <div className="island-stat-item">
                    <span className="stat-label">可收取</span>
                    <span className="stat-value">{island.produceNum.toFixed(2)}</span>
                  </div>
                  <div className="island-stat-item">
                    <span className="stat-label">当前资源</span>
                    <span className="stat-value">
                      {island.resource} / {island.resourceLimit}
                    </span>
                  </div>
                </div>

                <div className="island-actions">
                  {showStartButton ? (
                    <button
                      className="island-btn island-btn-primary"
                      onClick={() => handleStart(island)}
                      disabled={operating}
                    >
                      启动
                    </button>
                  ) : (
                    <>
                      <button
                        className="island-btn island-btn-success"
                        onClick={() => handleCollect(island)}
                        disabled={operating}
                      >
                        收取
                      </button>
                      <button
                        className="island-btn island-btn-warning"
                        onClick={() => handleSupplement(island)}
                        disabled={operating}
                      >
                        补充
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </PullToRefresh>
    </div>
  )
}
