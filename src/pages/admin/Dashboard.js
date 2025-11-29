import React, { useEffect, useState } from 'react';
import AdminLayout from '../../shared/components/admin/AdminLayout';
import { 
  FiFileText, 
  FiUsers, 
  FiMessageSquare, 
  FiEye,
  FiTrendingUp,
  FiActivity
} from 'react-icons/fi';
import ApiController from '../../shared/services/ApiController';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalUsers: 0,
    totalComments: 0,
    totalViews: 0,
    recentPosts: [],
    recentUsers: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual admin API endpoints
      const postsResult = await ApiController.getPosts();
      const posts = postsResult.success ? postsResult.data : [];
      
      // Calculate statistics
      const totalViews = posts.reduce((sum, post) => sum + (post.view_count || 0), 0);
      const totalComments = posts.reduce((sum, post) => sum + (post.comment_count || 0), 0);
      
      setStats({
        totalPosts: posts.length,
        totalUsers: 0, // TODO: Fetch from admin API
        totalComments: totalComments,
        totalViews: totalViews,
        recentPosts: posts.slice(-5).reverse(),
        recentUsers: [], // TODO: Fetch from admin API
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Posts',
      value: stats.totalPosts,
      icon: FiFileText,
      color: '#3b82f6',
      bgColor: '#eff6ff',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: FiUsers,
      color: '#10b981',
      bgColor: '#ecfdf5',
    },
    {
      title: 'Total Comments',
      value: stats.totalComments,
      icon: FiMessageSquare,
      color: '#f59e0b',
      bgColor: '#fffbeb',
    },
    {
      title: 'Total Views',
      value: stats.totalViews,
      icon: FiEye,
      color: '#8b5cf6',
      bgColor: '#f5f3ff',
    },
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Dashboard
          </h1>
          <p className="text-text-muted text-[0.9375rem]">
            Overview of your blog statistics and recent activity
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-bg-secondary border border-border-color rounded-xl p-6 flex items-center gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                style={{
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-[10px] flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: stat.bgColor,
                  }}
                >
                  <Icon className="text-2xl" style={{ color: stat.color }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-text-muted m-0 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-[1.75rem] font-bold text-text-primary m-0">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Posts */}
          <div className="bg-bg-secondary border border-border-color rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text-primary m-0">
                Recent Posts
              </h3>
              <FiTrendingUp className="text-xl text-text-muted" />
            </div>
            {stats.recentPosts.length > 0 ? (
              <div className="flex flex-col gap-4">
                {stats.recentPosts.map((post) => (
                  <div
                    key={post.post_id}
                    className="p-4 bg-bg-tertiary rounded-lg border border-border-color"
                  >
                    <p className="text-[0.9375rem] font-medium text-text-primary m-0 mb-2">
                      {post.header}
                    </p>
                    <div className="flex items-center gap-4 text-[0.8125rem] text-text-muted">
                      <span>{new Date(post.post_datetime).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{post.like_count || 0} likes</span>
                      <span>•</span>
                      <span>{post.comment_count || 0} comments</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-muted text-[0.9375rem]">
                No recent posts
              </p>
            )}
          </div>

          {/* Recent Users */}
          <div className="bg-bg-secondary border border-border-color rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text-primary m-0">
                Recent Users
              </h3>
              <FiActivity className="text-xl text-text-muted" />
            </div>
            {stats.recentUsers.length > 0 ? (
              <div className="flex flex-col gap-4">
                {stats.recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 bg-bg-tertiary rounded-lg border border-border-color"
                  >
                    <p className="text-[0.9375rem] font-medium text-text-primary m-0">
                      {user.username || user.email}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-muted text-[0.9375rem]">
                No recent users
              </p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
