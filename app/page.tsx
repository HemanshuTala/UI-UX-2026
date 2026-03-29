'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import OverviewModule from '@/components/dashboard/OverviewModule';
import TrafficModule from '@/components/dashboard/TrafficModule';
import EnvironmentModule from '@/components/dashboard/EnvironmentModule';
import UtilitiesModule from '@/components/dashboard/UtilitiesModule';
import EmergencyModule from '@/components/dashboard/EmergencyModule';
import FeedbackModule from '@/components/dashboard/FeedbackModule';
import AnalyticsModule from '@/components/dashboard/AnalyticsModule';
import UsersModule from '@/components/dashboard/UsersModule';
import SettingsModule from '@/components/dashboard/SettingsModule';

import AISmartPanel from '@/components/dashboard/AISmartPanel';

export default function Home() {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    function tick() {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) +
        ' · ' +
        now.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
      );
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const modules: Record<string, React.ReactNode> = {
    overview: <OverviewModule />,
    traffic: <TrafficModule />,
    environment: <EnvironmentModule />,
    utilities: <UtilitiesModule />,
    emergency: <EmergencyModule />,
    feedback: <FeedbackModule />,
    analytics: <AnalyticsModule />,
    users: <UsersModule />,
    settings: <SettingsModule />,
  };

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', background: 'oklch(0.06 0.01 250)' }}>
      <Sidebar active={activeTab} onSelect={setActiveTab} />
      <AISmartPanel />

      {/* Main content area */}
      <div style={{ marginLeft: 240, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header currentTime={currentTime} />

        {/* Page content */}
        <main style={{ flex: 1, padding: '96px 32px 32px', maxWidth: 1440, width: '100%' }}>
          {modules[activeTab]}
        </main>
      </div>
    </div>
  );
}
