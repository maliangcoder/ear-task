import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, Toast, DotLoading, Card } from "antd-mobile";
import { LeftOutline } from "antd-mobile-icons";
import { islandApi } from "@/api/island";
import { useIslandStore } from "@/store/useIslandStore";
import {
  formatDuration,
  calculateRemainingHours,
  calculateCrystalNeededFor24Hours,
} from "@/utils/time";
import type { Island } from "@/types/island";
import "./index.css";

/** 请求延迟，避免频率过快 */
const DELAY_MS = 500;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function IslandPage() {
  const navigate = useNavigate();
  const { islands, loading, setIslands, setLoading } = useIslandStore();
  const [operating, setOperating] = useState(false);
  const hasFetchedRef = useRef(false);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    // 防止重复请求：只在首次挂载且没有正在请求时执行
    if (!hasFetchedRef.current && !isFetchingRef.current) {
      hasFetchedRef.current = true;
      fetchIslands();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchIslands = async () => {
    // 防止重复请求
    if (isFetchingRef.current) {
      return;
    }
    isFetchingRef.current = true;
    setLoading(true);
    try {
      const res = await islandApi.getList();
      setIslands(res.data.records);
    } catch (error) {
      console.error("获取据点列表失败:", error);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  // 计算总可收取产出
  const totalProduction = islands.reduce(
    (sum, island) => sum + island.produceNum,
    0
  );

  // 计算总需补充空晶数量（满足24小时）
  const totalCrystalNeeded = islands.reduce((sum, island) => {
    const needed = calculateCrystalNeededFor24Hours(
      island.resource,
      island.supplementRate,
      island.realResourceRate
    );
    return sum + needed;
  }, 0);

  // 统计未启动的据点数量
  const notStartedCount = islands.filter(
    (island) => island.status === "UN_USE"
  ).length;

  // 判断是否所有据点都是生产中
  const allRunning = islands.length > 0 && notStartedCount === 0;

  // 一键收取所有
  const handleCollectAll = async () => {
    const collectableIslands = islands.filter(
      (island) => island.produceNum > 0
    );

    if (collectableIslands.length === 0) {
      Toast.show({ icon: "fail", content: "暂无可收取的产出" });
      return;
    }

    const result = await Dialog.confirm({
      content: `确认收取所有据点共 ${totalProduction.toFixed(2)} 个产出？\n共 ${
        collectableIslands.length
      } 个据点有产出`,
    });

    if (!result) return;

    setOperating(true);
    let successCount = 0;
    let totalCollected = 0;

    for (const island of collectableIslands) {
      try {
        const res = await islandApi.collect({ id: island.id });
        if (res.data) {
          successCount++;
          totalCollected += island.produceNum;
        }
        await delay(DELAY_MS);
      } catch (error) {
        console.error(`收取据点 ${island.nftTitle} 失败:`, error);
      }
    }

    Toast.show({
      icon: successCount > 0 ? "success" : "fail",
      content: `收取完成！成功 ${successCount} 个据点，共 ${totalCollected.toFixed(
        2
      )} 产出`,
    });

    await fetchIslands();
    setOperating(false);
  };

  // 一键补充满24小时并启动所有据点
  const handleSupplementAll = async () => {
    // 统计需要补充的据点
    const needSupplementIslands = islands.filter((island) => {
      const needed = calculateCrystalNeededFor24Hours(
        island.resource,
        island.supplementRate,
        island.realResourceRate
      );
      return needed > 0;
    });

    // 统计未启动的据点
    const notStartedIslands = islands.filter(
      (island) => island.status === "UN_USE"
    );

    if (needSupplementIslands.length === 0 && notStartedIslands.length === 0) {
      Toast.show({ icon: "success", content: "所有据点已启动且资源充足" });
      return;
    }

    let confirmMessage = "";
    if (needSupplementIslands.length > 0) {
      confirmMessage += `补充 ${needSupplementIslands.length} 个据点，消耗 ${totalCrystalNeeded} 空晶\n`;
    }
    if (notStartedIslands.length > 0) {
      confirmMessage += `启动 ${notStartedIslands.length} 个未启动据点\n`;
    }
    confirmMessage += "是否确认执行？";

    const result = await Dialog.confirm({ content: confirmMessage });
    if (!result) return;

    setOperating(true);
    let supplementSuccess = 0;
    let totalCrystalUsed = 0;
    let startSuccess = 0;

    // 1. 先执行补充操作
    for (const island of needSupplementIslands) {
      const crystalNeeded = calculateCrystalNeededFor24Hours(
        island.resource,
        island.supplementRate,
        island.realResourceRate
      );

      if (crystalNeeded <= 0) continue;

      try {
        const res = await islandApi.supplement({
          id: island.id,
          consume: crystalNeeded,
        });
        if (res.data) {
          supplementSuccess++;
          totalCrystalUsed += crystalNeeded;
        }
        await delay(DELAY_MS);
      } catch (error) {
        console.error(`补充据点 ${island.nftTitle} 失败:`, error);
      }
    }

    if (supplementSuccess > 0) {
      Toast.show({
        icon: "success",
        content: `补充完成！${supplementSuccess} 个据点，消耗 ${totalCrystalUsed} 空晶`,
      });
    }

    // 2. 执行启动操作（所有未启动的据点）
    for (const island of notStartedIslands) {
      try {
        // 如果有产出先收取
        if (island.produceNum > 0) {
          await islandApi.collect({ id: island.id });
          await delay(DELAY_MS);
        }

        const res = await islandApi.start({ id: island.id, start: true });
        if (res.data) {
          startSuccess++;
        }
        await delay(DELAY_MS);
      } catch (error) {
        console.error(`启动据点 ${island.nftTitle} 失败:`, error);
      }
    }

    if (startSuccess > 0) {
      Toast.show({
        icon: "success",
        content: `启动完成！成功启动 ${startSuccess} 个据点`,
      });
    }

    await fetchIslands();
    setOperating(false);
  };

  // 单个据点启动
  const handleStart = async (island: Island) => {
    const hasProduction = island.produceNum > 0;
    const remainingHours = calculateRemainingHours(
      island.resource,
      island.realResourceRate
    );
    const crystalNeeded = calculateCrystalNeededFor24Hours(
      island.resource,
      island.supplementRate,
      island.realResourceRate
    );

    let message = "";
    if (hasProduction) {
      message = `将先收取 ${island.produceNum.toFixed(
        2
      )} 个产出，然后启动生产。\n`;
    }
    message += `当前资源可运行 ${remainingHours.toFixed(1)} 小时。\n`;
    if (crystalNeeded > 0) {
      message += `需要补充 ${crystalNeeded} 个空晶才能生产24小时。\n`;
    } else {
      message += "资源充足，可运行超过24小时。\n";
    }
    message += "是否确认启动?";

    const result = await Dialog.confirm({ content: message.trim() });
    if (!result) return;

    setOperating(true);
    try {
      if (hasProduction) {
        const collectRes = await islandApi.collect({ id: island.id });
        if (collectRes.data) {
          Toast.show({
            icon: "success",
            content: `已收取 ${island.produceNum.toFixed(2)} 个产出`,
          });
        }
      }

      const res = await islandApi.start({ id: island.id, start: true });
      if (res.data) {
        Toast.show({ icon: "success", content: "启动成功" });
        fetchIslands();
      }
    } catch (error) {
      console.error("启动失败:", error);
    } finally {
      setOperating(false);
    }
  };

  const getStatusText = (island: Island) => {
    if (island.status === "UN_USE") return "未启动";
    if (island.status === "DOING") return "生产中";
    return "已停止";
  };

  const getStatusClassName = (island: Island) => {
    return island.status === "DOING" ? "status-running" : "status-stopped";
  };

  if (loading && islands.length === 0) {
    return (
      <div className="island-loading">
        <DotLoading color="primary" />
      </div>
    );
  }

  return (
    <div className="island-container">
      <div className="island-header">
        <LeftOutline fontSize={24} onClick={() => navigate(-1)} />
        <h1 className="island-title">据点管理</h1>
        <div style={{ width: 24 }} />
      </div>

      <div className="island-content">
        {/* 操作面板 */}
        <Card className="action-panel">
          <div className="action-stats">
            <div className="action-stat-item">
              <div className="action-stat-value">
                {totalProduction.toFixed(2)}
              </div>
              <div className="action-stat-label">可收取产出</div>
            </div>
            <div className="action-stat-divider" />
            <div className="action-stat-item">
              <div className="action-stat-value">{totalCrystalNeeded}</div>
              <div className="action-stat-label">需补空晶</div>
            </div>
            <div className="action-stat-divider" />
            <div className="action-stat-item">
              <div className="action-stat-value">
                {islands.length - notStartedCount}/{islands.length}
              </div>
              <div className="action-stat-label">运行中</div>
            </div>
          </div>
          <div className="action-buttons">
            <button
              className="action-btn action-btn-collect"
              onClick={handleCollectAll}
              disabled={operating || totalProduction <= 0}
            >
              {operating ? "处理中..." : "一键收取"}
            </button>
            <button
              className="action-btn action-btn-supplement"
              onClick={handleSupplementAll}
              disabled={operating}
            >
              {operating ? "处理中..." : allRunning ? "一键补充" : "补充并启动"}
            </button>
          </div>
        </Card>

        {/* 据点列表 */}
        <div className="island-list">
          {islands.map((island) => {
            const showStartButton = island.status === "UN_USE";
            const remainingHours = calculateRemainingHours(
              island.resource,
              island.realResourceRate
            );

            return (
              <div key={island.id} className="island-card">
                <div className="island-card-header">
                  <img
                    src={island.nftMainImg}
                    alt={island.nftTitle}
                    className="island-img"
                  />
                  <div className="island-info">
                    <h3 className="island-name">{island.nftTitle}</h3>
                    <p className="island-number">{island.numberStr}</p>
                  </div>
                  <span
                    className={`island-status-badge ${getStatusClassName(
                      island
                    )}`}
                  >
                    {getStatusText(island)}
                  </span>
                </div>

                <div className="island-stats">
                  <div className="island-stat-item">
                    <span className="stat-label">运行</span>
                    <span className="stat-value">
                      {formatDuration(island.startTime)}
                    </span>
                  </div>
                  <div className="island-stat-item">
                    <span className="stat-label">可收</span>
                    <span className="stat-value highlight-green">
                      {island.produceNum.toFixed(2)}
                    </span>
                  </div>
                  <div className="island-stat-item">
                    <span className="stat-label">资源</span>
                    <span className="stat-value">
                      {island.resource}/{island.resourceLimit}
                    </span>
                  </div>
                  <div className="island-stat-item">
                    <span className="stat-label">剩余</span>
                    <span
                      className={`stat-value ${
                        remainingHours < 12 ? "highlight-warning" : ""
                      }`}
                    >
                      {remainingHours.toFixed(1)}h
                    </span>
                  </div>
                </div>

                {showStartButton && (
                  <div className="island-actions">
                    <button
                      className="island-btn island-btn-primary"
                      onClick={() => handleStart(island)}
                      disabled={operating}
                    >
                      启动生产
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
