import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Toast, DotLoading, List, Card } from "antd-mobile";
import { LeftOutline } from "antd-mobile-icons";
import { useSearchStore } from "@/store/useSearchStore";
import { useBatchSearch } from "@/hooks/useBatchSearch";
import { formatOccupationName, formatPercent } from "@/utils/format";
import type { Worker } from "@/types/search";
import "./index.css";

export default function SearchPage() {
  const navigate = useNavigate();
  const { searchInfo, loading, fetchSearchInfo } = useSearchStore();
  const { searching, executeBatchSearch } = useBatchSearch();

  useEffect(() => {
    fetchSearchInfo();
  }, [fetchSearchInfo]);

  const handleSearch = async () => {
    if (!searchInfo || searchInfo.remainingFreeSearchNum <= 0) {
      Toast.show("暂无可用搜寻次数");
      return;
    }
    const result = await executeBatchSearch(searchInfo.remainingFreeSearchNum);
    if (result.success) {
      fetchSearchInfo();
    }
  };

  if (loading && !searchInfo) {
    return (
      <div className="search-loading">
        <DotLoading color="primary" />
      </div>
    );
  }

  const renderWorkerHobby = (worker: Worker) => {
    const hobbyConfig: Record<string, { className: string; text: string }> = {
      AGRICULTURE: {
        className: "agriculture",
        text: "食物产出",
      },
      FORESTRY: {
        className: "forestry",
        text: "木材产出",
      },
      MINING: {
        className: "mining",
        text: "矿石产出",
      },
    };

    const config = hobbyConfig[worker.occupationType];
    if (!config || worker.hobby <= 0) return null;

    // 使用搜寻产出的图片作为图标
    const outputImg = searchInfo?.searchOutputImgUrl;

    return (
      <div className={`worker-hobby ${config.className}`}>
        {outputImg && (
          <img
            src={outputImg}
            alt={config.text}
            className="worker-hobby-icon"
          />
        )}
        {config.text} +{formatPercent(worker.hobby)}
      </div>
    );
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <LeftOutline fontSize={24} onClick={() => navigate(-1)} />
        <h1 className="search-title">资源搜寻</h1>
        <div style={{ width: 24 }} />
      </div>

      <div className="search-content">
        {/* 产出信息卡片 */}
        <Card className="output-card">
          <div className="output-header">
            <img
              src={searchInfo?.searchOutputImgUrl}
              alt={searchInfo?.searchOutputName}
              className="output-icon"
            />
            <div className="output-info">
              <div className="output-name">
                {searchInfo?.searchOutputName || "未知产物"}
              </div>
              <div className="output-type">
                {searchInfo?.searchOutputType || "资源"}
              </div>
            </div>
          </div>
          <div className="output-stats">
            <div className="output-stat-item">
              <div className="output-stat-value">
                {searchInfo?.searchOutput || 0}
              </div>
              <div className="output-stat-label">单次产出</div>
            </div>
            <div className="output-stat-divider" />
            <div className="output-stat-item">
              <div className="output-stat-value highlight-orange">
                {searchInfo?.searchOutputToday || 0}
              </div>
              <div className="output-stat-label">今日已获得</div>
            </div>
            <div className="output-stat-divider" />
            <div className="output-stat-item">
              <div className="output-stat-value highlight-green">
                +{formatPercent(searchInfo?.searchAddition || 0)}
              </div>
              <div className="output-stat-label">产出加成</div>
            </div>
          </div>
        </Card>

        {/* 搜寻次数统计卡片 */}
        <Card className="search-stat-card">
          <div className="search-stats">
            <div className="search-stat-item">
              <div className="stat-label">总免费次数</div>
              <div className="stat-value">
                {searchInfo?.freeTotalSearchNum || 0}
              </div>
            </div>
            <div className="search-stat-item">
              <div className="stat-label">今日已搜寻</div>
              <div className="stat-value">
                {searchInfo?.todayUsedSearchNum || 0}
              </div>
            </div>
            <div className="search-stat-item">
              <div className="stat-label">今日总次数</div>
              <div className="stat-value">
                {searchInfo?.todayFreeSearchNum || 0}
              </div>
            </div>
          </div>
          <div className="search-remaining-stat">
            剩余可用次数:{" "}
            <span className="highlight">
              {searchInfo?.remainingFreeSearchNum || 0}
            </span>
          </div>
          <Button
            block
            color="primary"
            size="large"
            loading={searching}
            disabled={
              searching || (searchInfo?.remainingFreeSearchNum || 0) <= 0
            }
            onClick={handleSearch}
            className="search-main-btn"
          >
            一键执行搜寻
          </Button>
        </Card>

        <div className="worker-section">
          <h2 className="section-title">参与搜寻的工人</h2>
          <List className="worker-list">
            {searchInfo?.workerList.map((worker) => (
              <List.Item
                key={worker.id}
                prefix={
                  <img
                    src={worker.nftMainImg || worker.icon}
                    alt={worker.name}
                    className="worker-avatar"
                  />
                }
                description={
                  <div className="worker-desc-wrapper">
                    <div className="worker-title">
                      {formatOccupationName(worker.occupationType)}
                    </div>
                    {renderWorkerHobby(worker)}
                  </div>
                }
              >
                {worker.name}
              </List.Item>
            ))}
            {(!searchInfo?.workerList ||
              searchInfo.workerList.length === 0) && (
              <div className="empty-workers">暂无工人</div>
            )}
          </List>
        </div>
      </div>
    </div>
  );
}
