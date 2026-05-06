"use client";

import { useEffect, useState } from 'react';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalSessions: number;
  totalDocumentViews: number;
  totalDownloads: number;
  recentActivity: ActivityEvent[];
}

interface ActivityEvent {
  event: string;
  email?: string;
  timestamp: string;
  properties?: {
    documentTitle?: string;
    documentId?: string;
    inviteEmail?: string;
    [key: string]: any;
  };
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // In a real implementation, you'd fetch from PostHog API
      // For now, I'll create a mock response to show the UI
      // TODO: Replace with actual PostHog API calls

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data - replace with actual PostHog API calls
      const mockData: AnalyticsData = {
        totalUsers: 4,
        activeUsers: 2,
        totalSessions: 15,
        totalDocumentViews: 42,
        totalDownloads: 18,
        recentActivity: [
          {
            event: 'portal_user_login',
            email: 'nate@xecuit.com',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            event: 'portal_document_view',
            email: 'nate@xecuit.com',
            timestamp: new Date(Date.now() - 3400000).toISOString(),
            properties: {
              documentTitle: 'Xecuit Buyer Profile',
              documentId: 'buyer-profile',
            },
          },
          {
            event: 'portal_document_download',
            email: 'nate@xecuit.com',
            timestamp: new Date(Date.now() - 3200000).toISOString(),
            properties: {
              documentTitle: 'Transaction Process & Execution',
              documentId: 'transaction-process',
            },
          },
          {
            event: 'portal_invite_sent',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            properties: {
              inviteEmail: 'test@example.com',
            },
          },
          {
            event: 'portal_user_login',
            email: 'nkt.brown@gmail.com',
            timestamp: new Date(Date.now() - 900000).toISOString(),
          },
        ],
      };

      setData(mockData);
    } catch (err: any) {
      console.error('Failed to fetch analytics:', err);
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getEventLabel = (event: string) => {
    const labels: Record<string, string> = {
      'portal_user_login': 'User Login',
      'portal_user_logout': 'User Logout',
      'portal_document_view': 'Document Viewed',
      'portal_document_download': 'Document Downloaded',
      'portal_invite_sent': 'Invite Sent',
      'portal_user_revoked': 'User Revoked',
      'portal_admin_login': 'Admin Login',
    };
    return labels[event] || event;
  };

  const getEventIcon = (event: string) => {
    const icons: Record<string, string> = {
      'portal_user_login': '🔑',
      'portal_user_logout': '🚪',
      'portal_document_view': '👁️',
      'portal_document_download': '📥',
      'portal_invite_sent': '✉️',
      'portal_user_revoked': '🚫',
      'portal_admin_login': '👤',
    };
    return icons[event] || '📊';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E2DBCF]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#264C3F]"></div>
          <p className="mt-4 text-[#264C3F]/70">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E2DBCF]">
        <div className="text-center max-w-md p-6">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-[#264C3F] mb-2">Error Loading Analytics</h2>
          <p className="text-[#264C3F]/70 mb-4">{error}</p>
          <button
            onClick={fetchAnalyticsData}
            className="px-4 py-2 bg-[#264C3F] text-white rounded-sm hover:bg-[#1a3d33] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E2DBCF]">
      {/* Header */}
      <header className="bg-[#264C3F] text-[#E2DBCF] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="text-[#E2DBCF]/70 hover:text-[#E2DBCF] transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-lg font-medium tracking-tight">PORTAL ANALYTICS</h1>
          </div>

          <button
            onClick={fetchAnalyticsData}
            className="text-sm text-[#E2DBCF]/80 hover:text-[#E2DBCF] transition-colors"
          >
            Refresh
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <StatCard
            title="Total Users"
            value={data?.totalUsers || 0}
            icon="👥"
            color="bg-[#264C3F]"
          />
          <StatCard
            title="Active Users"
            value={data?.activeUsers || 0}
            icon="✅"
            color="bg-[#4CAF50]"
          />
          <StatCard
            title="Total Sessions"
            value={data?.totalSessions || 0}
            icon="🔄"
            color="bg-[#9E8461]"
          />
          <StatCard
            title="Document Views"
            value={data?.totalDocumentViews || 0}
            icon="👁️"
            color="bg-[#264C3F]"
          />
          <StatCard
            title="Downloads"
            value={data?.totalDownloads || 0}
            icon="📥"
            color="bg-[#264C3F]"
          />
        </div>

        {/* Recent Activity */}
        <section>
          <h2 className="text-2xl font-bold text-[#264C3F] mb-6">RECENT ACTIVITY</h2>
          <div className="bg-white border border-[#D4D4D4] rounded-sm overflow-hidden">
            {data?.recentActivity && data.recentActivity.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No activity yet</div>
            ) : (
              <div className="divide-y divide-[#E2DBCF]">
                {data?.recentActivity?.map((activity, index) => (
                  <ActivityRow
                    key={index}
                    activity={activity}
                    getEventLabel={getEventLabel}
                    getEventIcon={getEventIcon}
                    formatDate={formatDate}
                  />
                )) || null}
              </div>
            )}
          </div>
        </section>

        {/* View Full Analytics Link */}
        <section className="mt-12 p-6 bg-white border border-[#D4D4D4] rounded-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="font-bold text-[#264C3F] mb-1">Need More Detailed Analytics?</h3>
              <p className="text-sm text-[#264C3F]/70">
                View detailed user journeys, funnels, and insights in PostHog
              </p>
            </div>
            <a
              href="https://app.posthog.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#264C3F] text-white font-medium rounded-sm hover:bg-[#1a3d33] transition-colors text-center"
            >
              Open PostHog Dashboard →
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, color }: {
  title: string;
  value: number;
  icon: string;
  color: string;
}) {
  return (
    <div className="bg-white border border-[#D4D4D4] p-6 rounded-sm">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 ${color} rounded-sm flex items-center justify-center text-xl`}>
          {icon}
        </div>
        <div className="text-3xl font-bold text-[#264C3F]">{value}</div>
      </div>
      <div className="text-sm text-[#264C3F]/60 uppercase tracking-wider">
        {title}
      </div>
    </div>
  );
}

function ActivityRow({
  activity,
  getEventLabel,
  getEventIcon,
  formatDate,
}: {
  activity: ActivityEvent;
  getEventLabel: (event: string) => string;
  getEventIcon: (event: string) => string;
  formatDate: (date: string) => string;
}) {
  return (
    <div className="px-6 py-4 hover:bg-[#F9F9F9] transition-colors">
      <div className="flex items-start gap-4">
        <div className="text-2xl mt-1">{getEventIcon(activity.event)}</div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-[#264C3F] mb-1">
            {getEventLabel(activity.event)}
          </div>
          {activity.email && (
            <div className="text-sm text-[#264C3F]/70 mb-1">
              {activity.email}
            </div>
          )}
          {activity.properties?.documentTitle && (
            <div className="text-sm text-[#264C3F]/50 mb-1">
              {activity.properties.documentTitle}
            </div>
          )}
        </div>
        <div className="text-xs text-[#264C3F]/50 whitespace-nowrap">
          {formatDate(activity.timestamp)}
        </div>
      </div>
    </div>
  );
}
