"use client"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"

interface ForecastData {
  id: string
  period: string
  revenue: number
  expenses: number
  profit: number
  growth: number
}

interface Scenario {
  id: string
  name: string
  description: string
  probability: number
  impact: "low" | "medium" | "high"
  revenue_multiplier: number
  expense_multiplier: number
}

export default function ForecastPage() {
  const [activeTab, setActiveTab] = useState<"revenue" | "scenarios" | "analysis">("revenue")
  const [forecastData, setForecastData] = useState<ForecastData[]>([])
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [selectedScenario, setSelectedScenario] = useState<string>("base")
  const [timeframe, setTimeframe] = useState<"monthly" | "quarterly" | "yearly">("monthly")

  useEffect(() => {
    // Initialize with mock forecast data
    const baseForecast: ForecastData[] = [
      {
        id: uuidv4(),
        period: "2024-01",
        revenue: 125000,
        expenses: 85000,
        profit: 40000,
        growth: 8.5,
      },
      {
        id: uuidv4(),
        period: "2024-02",
        revenue: 135000,
        expenses: 88000,
        profit: 47000,
        growth: 8.0,
      },
      {
        id: uuidv4(),
        period: "2024-03",
        revenue: 142000,
        expenses: 91000,
        profit: 51000,
        growth: 5.2,
      },
      {
        id: uuidv4(),
        period: "2024-04",
        revenue: 155000,
        expenses: 95000,
        profit: 60000,
        growth: 9.2,
      },
      {
        id: uuidv4(),
        period: "2024-05",
        revenue: 168000,
        expenses: 98000,
        profit: 70000,
        growth: 8.4,
      },
      {
        id: uuidv4(),
        period: "2024-06",
        revenue: 175000,
        expenses: 102000,
        profit: 73000,
        growth: 4.2,
      },
    ]

    setForecastData(baseForecast)

    setScenarios([
      {
        id: "optimistic",
        name: "Optimistic Scenario",
        description: "Best case scenario with strong market conditions and successful product launches",
        probability: 25,
        impact: "high",
        revenue_multiplier: 1.3,
        expense_multiplier: 1.1,
      },
      {
        id: "base",
        name: "Base Case",
        description: "Most likely scenario based on current trends and market conditions",
        probability: 50,
        impact: "medium",
        revenue_multiplier: 1.0,
        expense_multiplier: 1.0,
      },
      {
        id: "pessimistic",
        name: "Pessimistic Scenario",
        description: "Conservative scenario accounting for market downturns and challenges",
        probability: 25,
        impact: "high",
        revenue_multiplier: 0.7,
        expense_multiplier: 0.95,
      },
    ])
  }, [])

  const getAdjustedForecast = (scenario: string) => {
    const scenarioData = scenarios.find((s) => s.id === scenario)
    if (!scenarioData) return forecastData

    return forecastData.map((data) => ({
      ...data,
      revenue: Math.round(data.revenue * scenarioData.revenue_multiplier),
      expenses: Math.round(data.expenses * scenarioData.expense_multiplier),
      profit: Math.round(
        data.revenue * scenarioData.revenue_multiplier - data.expenses * scenarioData.expense_multiplier,
      ),
    }))
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "#dc2626"
      case "medium":
        return "#d97706"
      case "low":
        return "#65a30d"
      default:
        return "#6b7280"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatPeriod = (period: string) => {
    const date = new Date(period + "-01")
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" })
  }

  const adjustedData = getAdjustedForecast(selectedScenario)
  const totalRevenue = adjustedData.reduce((sum, data) => sum + data.revenue, 0)
  const totalExpenses = adjustedData.reduce((sum, data) => sum + data.expenses, 0)
  const totalProfit = totalRevenue - totalExpenses
  const avgGrowth = adjustedData.reduce((sum, data) => sum + data.growth, 0) / adjustedData.length

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", padding: "20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#1f2937", marginBottom: "8px" }}>
            Business Forecast
          </h1>
          <p style={{ color: "#6b7280", fontSize: "16px" }}>
            Revenue projections, scenario planning, and business analytics
          </p>
        </div>

        {/* Summary Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#6b7280", margin: "0 0 8px 0" }}>
              Total Revenue
            </h3>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#10b981" }}>{formatCurrency(totalRevenue)}</div>
          </div>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#6b7280", margin: "0 0 8px 0" }}>
              Total Expenses
            </h3>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#ef4444" }}>
              {formatCurrency(totalExpenses)}
            </div>
          </div>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#6b7280", margin: "0 0 8px 0" }}>Net Profit</h3>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: totalProfit > 0 ? "#10b981" : "#ef4444" }}>
              {formatCurrency(totalProfit)}
            </div>
          </div>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#6b7280", margin: "0 0 8px 0" }}>Avg Growth</h3>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#3b82f6" }}>{avgGrowth.toFixed(1)}%</div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "30px", alignItems: "center" }}>
          <div>
            <label
              style={{ fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "8px", display: "block" }}
            >
              Scenario:
            </label>
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              style={{
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
                backgroundColor: "white",
              }}
            >
              {scenarios.map((scenario) => (
                <option key={scenario.id} value={scenario.id}>
                  {scenario.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              style={{ fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "8px", display: "block" }}
            >
              Timeframe:
            </label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as "monthly" | "quarterly" | "yearly")}
              style={{
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
                backgroundColor: "white",
              }}
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: "30px" }}>
          <div
            style={{
              display: "flex",
              gap: "4px",
              backgroundColor: "#f1f5f9",
              padding: "4px",
              borderRadius: "8px",
              width: "fit-content",
            }}
          >
            {(["revenue", "scenarios", "analysis"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: activeTab === tab ? "white" : "transparent",
                  color: activeTab === tab ? "#1f2937" : "#6b7280",
                  fontWeight: activeTab === tab ? "600" : "400",
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === "revenue" && (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937", marginBottom: "20px" }}>
              Revenue Forecast - {scenarios.find((s) => s.id === selectedScenario)?.name}
            </h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "left",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#374151",
                      }}
                    >
                      Period
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "right",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#374151",
                      }}
                    >
                      Revenue
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "right",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#374151",
                      }}
                    >
                      Expenses
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "right",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#374151",
                      }}
                    >
                      Profit
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "right",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#374151",
                      }}
                    >
                      Growth
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {adjustedData.map((data, index) => (
                    <tr key={data.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "12px", fontSize: "14px", color: "#1f2937" }}>
                        {formatPeriod(data.period)}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "right",
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#10b981",
                        }}
                      >
                        {formatCurrency(data.revenue)}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "right",
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#ef4444",
                        }}
                      >
                        {formatCurrency(data.expenses)}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "right",
                          fontSize: "14px",
                          fontWeight: "500",
                          color: data.profit > 0 ? "#10b981" : "#ef4444",
                        }}
                      >
                        {formatCurrency(data.profit)}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "right",
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#3b82f6",
                        }}
                      >
                        {data.growth.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "scenarios" && (
          <div style={{ display: "grid", gap: "20px" }}>
            {scenarios.map((scenario) => (
              <div
                key={scenario.id}
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "24px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  border: selectedScenario === scenario.id ? "2px solid #3b82f6" : "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    marginBottom: "16px",
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#1f2937", margin: "0 0 8px 0" }}>
                      {scenario.name}
                    </h3>
                    <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>{scenario.description}</p>
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span
                      style={{
                        backgroundColor: getImpactColor(scenario.impact),
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "500",
                        textTransform: "capitalize",
                      }}
                    >
                      {scenario.impact} Impact
                    </span>
                    <button
                      onClick={() => setSelectedScenario(scenario.id)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: selectedScenario === scenario.id ? "#3b82f6" : "#f3f4f6",
                        color: selectedScenario === scenario.id ? "white" : "#374151",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      {selectedScenario === scenario.id ? "Selected" : "Select"}
                    </button>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", textAlign: "center" }}>
                  <div>
                    <div style={{ fontSize: "20px", fontWeight: "bold", color: "#1f2937" }}>
                      {scenario.probability}%
                    </div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>Probability</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "20px", fontWeight: "bold", color: "#1f2937" }}>
                      {((scenario.revenue_multiplier - 1) * 100).toFixed(0)}%
                    </div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>Revenue Impact</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "20px", fontWeight: "bold", color: "#1f2937" }}>
                      {((scenario.expense_multiplier - 1) * 100).toFixed(0)}%
                    </div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>Expense Impact</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "analysis" && (
          <div style={{ display: "grid", gap: "20px" }}>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937", marginBottom: "16px" }}>
                Forecast Analysis
              </h3>
              <div style={{ display: "grid", gap: "16px" }}>
                <div style={{ padding: "16px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
                  <h4 style={{ fontSize: "16px", fontWeight: "600", color: "#1f2937", margin: "0 0 8px 0" }}>
                    Revenue Trends
                  </h4>
                  <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>
                    Based on the current forecast, revenue shows a positive growth trend with an average monthly growth
                    rate of {avgGrowth.toFixed(1)}%. The strongest growth is projected for April with{" "}
                    {Math.max(...adjustedData.map((d) => d.growth)).toFixed(1)}% growth.
                  </p>
                </div>
                <div style={{ padding: "16px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
                  <h4 style={{ fontSize: "16px", fontWeight: "600", color: "#1f2937", margin: "0 0 8px 0" }}>
                    Profitability Analysis
                  </h4>
                  <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>
                    The profit margin is expected to improve over time, with total projected profit of{" "}
                    {formatCurrency(totalProfit)}
                    representing a {((totalProfit / totalRevenue) * 100).toFixed(1)}% profit margin across the forecast
                    period.
                  </p>
                </div>
                <div style={{ padding: "16px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
                  <h4 style={{ fontSize: "16px", fontWeight: "600", color: "#1f2937", margin: "0 0 8px 0" }}>
                    Risk Assessment
                  </h4>
                  <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>
                    The forecast shows moderate risk with scenario planning indicating potential variations of -30% to
                    +30% in revenue. Key risk factors include market volatility and competitive pressures.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
