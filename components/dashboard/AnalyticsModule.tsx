'use client';

import { useState } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PieChart, Pie, Cell } from 'recharts';
import ReactECharts from 'echarts-for-react';
import { TrendingUp, Calendar, BarChart3, Activity, Zap, TrendingDown, Download, Filter, RefreshCw } from 'lucide-react';

const monthlyAQI = [
  { month: 'Oct', aqi: 85, target: 75 }, 
  { month: 'Nov', aqi: 98, target: 75 }, 
  { month: 'Dec', aqi: 112, target: 75 },
  { month: 'Jan', aqi: 105, target: 75 }, 
  { month: 'Feb', aqi: 88, target: 75 }, 
  { month: 'Mar', aqi: 72, target: 75 },
];
const monthlyTraffic = [
  { month: 'Oct', index: 71, incidents: 45 }, 
  { month: 'Nov', index: 68, incidents: 38 }, 
  { month: 'Dec', index: 62, incidents: 32 },
  { month: 'Jan', index: 74, incidents: 48 }, 
  { month: 'Feb', index: 70, incidents: 42 }, 
  { month: 'Mar', index: 67, incidents: 35 },
];

const categoryData = [
  { name: 'Traffic', value: 35, color: '#00b4d8' },
  { name: 'Environment', value: 25, color: '#06d6a0' },
  { name: 'Utilities', value: 20, color: '#ffd166' },
  { name: 'Safety', value: 15, color: '#ef476f' },
  { name: 'Other', value: 5, color: '#7c3aed' },
];

const radarData = [
  { metric: 'Air Quality', score: 62, fullMark: 100 },
  { metric: 'Traffic', score: 74, fullMark: 100 },
  { metric: 'Water', score: 92, fullMark: 100 },
  { metric: 'Power', score: 85, fullMark: 100 },
  { metric: 'Safety', score: 70, fullMark: 100 },
  { metric: 'Waste', score: 55, fullMark: 100 },
];

const TT = { contentStyle: { background: 'oklch(0.12 0.02 250)', border: '1px solid rgba(0,180,216,0.3)', borderRadius: 8 }, labelStyle: { color: '#00b4d8' }, itemStyle: { color: '#e0f0ff' } };

// ECharts configuration for advanced gauge
const getGaugeOption = (value: number, title: string) => ({
  backgroundColor: 'transparent',
  series: [
    {
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: 100,
      splitNumber: 4,
      radius: '90%',
      center: ['50%', '75%'],
      axisLine: {
        lineStyle: {
          width: 20,
          color: [
            [0.5, '#06d6a0'],
            [0.75, '#ffd166'],
            [1, '#ef476f']
          ]
        }
      },
      pointer: {
        icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
        length: '75%',
        width: 12,
        offsetCenter: [0, '5%'],
        itemStyle: {
          color: '#00b4d8'
        }
      },
      axisTick: {
        length: 8,
        lineStyle: {
          color: 'rgba(255,255,255,0.2)',
          width: 2
        }
      },
      splitLine: {
        length: 12,
        lineStyle: {
          color: 'rgba(255,255,255,0.3)',
          width: 3
        }
      },
      axisLabel: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 11,
        distance: -50,
        formatter: (value: number) => value === 0 || value === 100 ? value : ''
      },
      title: {
        offsetCenter: [0, '-20%'],
        fontSize: 14,
        color: '#e0f0ff',
        fontWeight: 700
      },
      detail: {
        fontSize: 32,
        offsetCenter: [0, '0%'],
        valueAnimation: true,
        formatter: '{value}',
        color: '#00b4d8',
        fontWeight: 800
      },
      data: [{ value, name: title }]
    }
  ]
});

// ECharts heatmap for hourly patterns
const getHeatmapOption = () => {
  const hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a',
                 '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p'];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const data = days.map((day, i) => 
    hours.map((hour, j) => [j, i, Math.floor(Math.random() * 100)])
  ).flat();

  return {
    backgroundColor: 'transparent',
    tooltip: {
      position: 'top',
      backgroundColor: 'oklch(0.12 0.02 250)',
      borderColor: 'rgba(0,180,216,0.3)',
      textStyle: { color: '#e0f0ff' }
    },
    grid: {
      height: '70%',
      top: '10%',
      left: '10%',
      right: '5%'
    },
    xAxis: {
      type: 'category',
      data: hours,
      splitArea: { show: true },
      axisLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10 },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
    },
    yAxis: {
      type: 'category',
      data: days,
      splitArea: { show: true },
      axisLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 11 },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
    },
    visualMap: {
      min: 0,
      max: 100,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '0%',
      inRange: {
        color: ['#06d6a0', '#ffd166', '#ef476f']
      },
      textStyle: { color: 'rgba(255,255,255,0.6)' }
    },
    series: [{
      name: 'Traffic Intensity',
      type: 'heatmap',
      data: data,
      label: { show: false },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 180, 216, 0.5)'
        }
      }
    }]
  };
};

export default function AnalyticsModule() {
  const [timeRange, setTimeRange] = useState('30D');
  
  return (
    <div className="slide-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Enhanced Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#f0f8ff', margin: 0, letterSpacing: '-0.03em' }}>
            📊 Historical Analytics
          </h2>
          <p style={{ color: 'oklch(0.55 0.02 240)', fontSize: 14, margin: '6px 0 0', fontWeight: 500 }}>
            Trend analysis, forecasts, and city performance metrics
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {['7D', '30D', '6M', '1Y'].map(r => (
            <button 
              key={r} 
              onClick={() => setTimeRange(r)}
              style={{
                padding: '8px 16px', 
                fontSize: 13, 
                fontWeight: 700,
                borderRadius: 10,
                background: timeRange === r ? 'linear-gradient(135deg, #00b4d8, #0096b7)' : 'rgba(255,255,255,0.04)',
                color: timeRange === r ? 'white' : 'oklch(0.60 0.02 240)',
                border: timeRange === r ? 'none' : '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: timeRange === r ? '0 4px 12px rgba(0,180,216,0.3)' : 'none'
              }}
            >
              {r}
            </button>
          ))}
          <button className="btn-ghost" style={{ padding: '8px 14px' }}>
            <Filter size={14} />
          </button>
          <button className="btn-primary" style={{ padding: '8px 16px' }}>
            <Download size={14} />Export
          </button>
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { label: 'Avg City Score', value: '78.2', trend: '+5.1', up: true, color: '#06d6a0', icon: Activity, desc: 'vs last month' },
          { label: 'Total Incidents', value: '74', trend: '-12%', up: true, color: '#00b4d8', icon: BarChart3, desc: '30 days' },
          { label: 'Avg AQI', value: '93', trend: '+8', up: false, color: '#ffd166', icon: TrendingUp, desc: 'vs previous' },
          { label: 'Satisfaction', value: '87%', trend: '+3%', up: true, color: '#7c3aed', icon: Zap, desc: 'this quarter' },
        ].map(({ label, value, trend, up, color, icon: Icon, desc }, idx) => (
          <div 
            key={label} 
            className="glass-card kpi-card" 
            style={{ 
              padding: 22, 
              background: `linear-gradient(135deg, ${color}12, ${color}05)`,
              borderColor: `${color}30`,
              position: 'relative',
              overflow: 'hidden',
              animation: `slideInUp 0.4s ease forwards ${idx * 0.1}s`,
              opacity: 0
            }}
          >
            <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: `${color}15`, filter: 'blur(30px)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: 12, 
                  background: `${color}20`, 
                  border: `1px solid ${color}40`,
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: `0 4px 12px ${color}25`
                }}>
                  <Icon size={22} color={color} strokeWidth={2.5} />
                </div>
                <div style={{ 
                  padding: '4px 10px', 
                  borderRadius: 8, 
                  background: up ? 'rgba(6,214,160,0.15)' : 'rgba(239,71,111,0.15)',
                  border: `1px solid ${up ? 'rgba(6,214,160,0.3)' : 'rgba(239,71,111,0.3)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}>
                  {up ? <TrendingUp size={12} color="#06d6a0" /> : <TrendingDown size={12} color="#ef476f" />}
                  <span style={{ fontSize: 12, fontWeight: 700, color: up ? '#06d6a0' : '#ef476f' }}>{trend}</span>
                </div>
              </div>
              <div style={{ fontSize: 36, fontWeight: 900, color, lineHeight: 1, letterSpacing: '-0.03em', marginBottom: 8 }}>
                {value}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'oklch(0.80 0.01 240)', marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 11, color: 'oklch(0.50 0.02 240)', fontWeight: 500 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* AQI Trend with Target Line */}
        <div className="glass-card" style={{ padding: 28, background: 'linear-gradient(135deg, rgba(255,209,102,0.05), rgba(255,209,102,0.02))' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#f0f8ff', margin: 0 }}>Air Quality Index Trend</h3>
              <p style={{ fontSize: 12, color: 'oklch(0.50 0.02 240)', margin: '4px 0 0' }}>6-month historical data with target threshold</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 3, background: '#ffd166', borderRadius: 2 }} />
                <span style={{ fontSize: 11, color: 'oklch(0.60 0.02 240)' }}>Actual</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 3, background: '#06d6a0', borderRadius: 2, opacity: 0.5 }} />
                <span style={{ fontSize: 11, color: 'oklch(0.60 0.02 240)' }}>Target</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyAQI}>
              <defs>
                <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffd166" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ffd166" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12, fontWeight: 600 }} />
              <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} />
              <Tooltip {...TT} />
              <Area type="monotone" dataKey="aqi" name="AQI" stroke="#ffd166" strokeWidth={3} fill="url(#aqiGrad)" dot={{ fill: '#ffd166', r: 5, strokeWidth: 2, stroke: '#fff' }} />
              <Line type="monotone" dataKey="target" name="Target" stroke="#06d6a0" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Incident Category Pie Chart */}
        <div className="glass-card" style={{ padding: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#f0f8ff', margin: '0 0 20px' }}>Incident Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip {...TT} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
            {categoryData.map(cat => (
              <div key={cat.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: cat.color }} />
                  <span style={{ fontSize: 12, color: 'oklch(0.70 0.01 240)' }}>{cat.name}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: cat.color }}>{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Traffic Analysis */}
      <div className="glass-card" style={{ padding: 28, background: 'linear-gradient(135deg, rgba(0,180,216,0.05), rgba(0,180,216,0.02))' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#f0f8ff', margin: 0 }}>Traffic Congestion & Incidents</h3>
            <p style={{ fontSize: 12, color: 'oklch(0.50 0.02 240)', margin: '4px 0 0' }}>Correlation analysis over 6 months</p>
          </div>
          <button className="btn-ghost" style={{ padding: '6px 12px' }}>
            <RefreshCw size={13} />Refresh
          </button>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={monthlyTraffic}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12, fontWeight: 600 }} />
            <YAxis yAxisId="left" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} />
            <Tooltip {...TT} />
            <Line yAxisId="left" type="monotone" dataKey="index" name="Congestion Index" stroke="#00b4d8" strokeWidth={3} dot={{ fill: '#00b4d8', r: 6, strokeWidth: 2, stroke: '#fff' }} />
            <Line yAxisId="right" type="monotone" dataKey="incidents" name="Incidents" stroke="#ef476f" strokeWidth={3} dot={{ fill: '#ef476f', r: 6, strokeWidth: 2, stroke: '#fff' }} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* City Health Gauge */}
        <div className="glass-card" style={{ padding: 28, background: 'linear-gradient(135deg, rgba(0,180,216,0.08), rgba(0,180,216,0.02))' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#f0f8ff', margin: 0 }}>City Health Score</h3>
              <p style={{ fontSize: 11, color: 'oklch(0.50 0.02 240)', margin: '4px 0 0' }}>Composite metric from all systems</p>
            </div>
            <BarChart3 size={18} color="#00b4d8" strokeWidth={2.5} />
          </div>
          <ReactECharts option={getGaugeOption(78, 'Overall Health')} style={{ height: 220 }} />
        </div>

        {/* Radar Chart */}
        <div className="glass-card" style={{ padding: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#f0f8ff', margin: '0 0 12px' }}>Multi-Dimensional Performance</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: 'oklch(0.60 0.02 240)', fontSize: 11, fontWeight: 600 }} />
              <Radar name="Score" dataKey="score" stroke="#00b4d8" fill="#00b4d8" fillOpacity={0.25} strokeWidth={3} dot={{ fill: '#00b4d8', r: 4 }} />
              <Tooltip {...TT} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Heatmap */}
      <div className="glass-card" style={{ padding: 28, background: 'linear-gradient(135deg, rgba(124,58,237,0.05), rgba(124,58,237,0.02))' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#f0f8ff', margin: 0 }}>Weekly Traffic Intensity Heatmap</h3>
            <p style={{ fontSize: 12, color: 'oklch(0.50 0.02 240)', margin: '4px 0 0' }}>Hourly patterns across the week</p>
          </div>
          <span className="badge" style={{ background: 'rgba(124,58,237,0.2)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)', fontSize: 11, fontWeight: 700 }}>
            Apache ECharts
          </span>
        </div>
        <ReactECharts option={getHeatmapOption()} style={{ height: 320 }} />
      </div>
    </div>
  );
}
