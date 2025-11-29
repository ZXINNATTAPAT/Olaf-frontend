import React, { useEffect, useState } from 'react';
import AdminLayout from '../../shared/components/admin/AdminLayout';
import { FiEdit, FiTrash2, FiEye, FiSearch } from 'react-icons/fi';
import ApiController from '../../shared/services/ApiController';
import { getImageUrl } from '../../shared/services/CloudinaryService';

export default function PostsManagement() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const filtered = posts.filter((post) =>
      post.header?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      post.short?.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [searchKeyword, posts]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const result = await ApiController.getPosts();
      if (result.success) {
        setPosts(result.data);
        setFilteredPosts(result.data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const result = await ApiController.deletePost(postId);
        if (result.success) {
          alert('Post deleted successfully');
          // After successful delete, refresh the list
          fetchPosts();
        } else {
          alert('Failed to delete post: ' + (result.error?.detail || result.error || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post: ' + (error.message || 'Unknown error'));
      }
    }
  };

  const handleEdit = (postId) => {
    window.location.href = `/editContent/${postId}`;
  };

  const handleView = (postId) => {
    window.location.href = `/vFeed/${postId}`;
  };

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
            Posts Management
          </h1>
          <p className="text-text-muted text-[0.9375rem]">
            Manage all blog posts
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-xl" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full py-3 px-4 pl-12 border border-border-color rounded-lg bg-bg-secondary text-text-primary text-[0.9375rem] focus:outline-none focus:ring-2 focus:ring-border-color"
            />
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-bg-secondary border border-border-color rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-bg-tertiary border-b border-border-color">
                  <th className="p-4 text-left text-sm font-semibold text-text-primary">
                    Post
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-text-primary">
                    Author
                  </th>
                  <th className="p-4 text-center text-sm font-semibold text-text-primary">
                    Views
                  </th>
                  <th className="p-4 text-center text-sm font-semibold text-text-primary">
                    Likes
                  </th>
                  <th className="p-4 text-center text-sm font-semibold text-text-primary">
                    Comments
                  </th>
                  <th className="p-4 text-center text-sm font-semibold text-text-primary">
                    Date
                  </th>
                  <th className="p-4 text-center text-sm font-semibold text-text-primary">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => {
                    const imageUrl = post.primary_image_url
                      ? getImageUrl(post.primary_image_url, 'FEED_SMALL')
                      : null;
                    const authorName = post.user
                      ? `${post.user.first_name || ''} ${post.user.last_name || ''}`.trim() || post.user.username
                      : 'Unknown';

                    return (
                      <tr
                        key={post.post_id}
                        className="border-b border-border-color transition-colors duration-200 hover:bg-bg-tertiary"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-4">
                            {imageUrl && (
                              <img
                                src={imageUrl}
                                alt={post.header}
                                className="w-15 h-15 object-cover rounded-lg"
                              />
                            )}
                            <div>
                              <p className="text-[0.9375rem] font-medium text-text-primary m-0 mb-1">
                                {post.header}
                              </p>
                              <p className="text-[0.8125rem] text-text-muted m-0 line-clamp-1">
                                {post.short}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-[0.9375rem] text-text-primary">
                            {authorName}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-[0.9375rem] text-text-primary">
                            {post.view_count || 0}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-[0.9375rem] text-text-primary">
                            {post.like_count || 0}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-[0.9375rem] text-text-primary">
                            {post.comment_count || 0}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-[0.8125rem] text-text-muted">
                            {new Date(post.post_datetime).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleView(post.post_id)}
                              className="p-2 border-0 bg-transparent text-text-muted cursor-pointer rounded-md transition-all duration-200 hover:bg-bg-tertiary hover:text-text-primary"
                              title="View"
                            >
                              <FiEye className="text-lg" />
                            </button>
                            <button
                              onClick={() => handleEdit(post.post_id)}
                              className="p-2 border-0 bg-transparent text-text-muted cursor-pointer rounded-md transition-all duration-200 hover:bg-bg-tertiary hover:text-text-primary"
                              title="Edit"
                            >
                              <FiEdit className="text-lg" />
                            </button>
                            <button
                              onClick={() => handleDelete(post.post_id)}
                              className="p-2 border-0 bg-transparent text-text-muted cursor-pointer rounded-md transition-all duration-200 hover:bg-red-100 hover:text-red-600"
                              title="Delete"
                            >
                              <FiTrash2 className="text-lg" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="p-12 text-center text-text-muted"
                    >
                      No posts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
