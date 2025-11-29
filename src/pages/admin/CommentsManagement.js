import React, { useEffect, useState } from 'react';
import AdminLayout from '../../shared/components/admin/AdminLayout';
import { FiTrash2, FiSearch, FiEye } from 'react-icons/fi';

export default function CommentsManagement() {
  const [comments, setComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    const filtered = comments.filter((comment) =>
      comment.content?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      comment.user?.username?.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    setFilteredComments(filtered);
  }, [searchKeyword, comments]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement admin API endpoint to fetch comments
      // const result = await ApiController.getComments();
      // if (result.success) {
      //   setComments(result.data);
      //   setFilteredComments(result.data);
      // }
      
      // Placeholder data
      setComments([]);
      setFilteredComments([]);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        // TODO: Implement delete API call
        console.log('Delete comment:', commentId);
        fetchComments();
      } catch (error) {
        console.error('Error deleting comment:', error);
        alert('Failed to delete comment');
      }
    }
  };

  const handleViewPost = (postId) => {
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
            Comments Management
          </h1>
          <p className="text-text-muted text-[0.9375rem]">
            Manage all comments on posts
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-xl" />
            <input
              type="text"
              placeholder="Search comments..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full py-3 px-4 pl-12 border border-border-color rounded-lg bg-bg-secondary text-text-primary text-[0.9375rem] focus:outline-none focus:ring-2 focus:ring-border-color"
            />
          </div>
        </div>

        {/* Comments Table */}
        <div className="bg-bg-secondary border border-border-color rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-bg-tertiary border-b border-border-color">
                  <th className="p-4 text-left text-sm font-semibold text-text-primary">
                    Comment
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-text-primary">
                    Author
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-text-primary">
                    Post
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
                {filteredComments.length > 0 ? (
                  filteredComments.map((comment) => (
                    <tr
                      key={comment.id}
                      className="border-b border-border-color transition-colors duration-200 hover:bg-bg-tertiary"
                    >
                      <td className="p-4 max-w-md">
                        <p className="text-[0.9375rem] text-text-primary m-0 line-clamp-2">
                          {comment.content}
                        </p>
                      </td>
                      <td className="p-4">
                        <span className="text-[0.9375rem] text-text-primary font-medium">
                          {comment.user?.username || 'Unknown'}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleViewPost(comment.post_id)}
                          className="px-3 py-1 border border-border-color rounded-md bg-transparent text-text-primary cursor-pointer text-[0.8125rem] transition-all duration-200 hover:bg-bg-tertiary"
                        >
                          View Post
                        </button>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-[0.8125rem] text-text-muted">
                          {comment.created_at ? new Date(comment.created_at).toLocaleDateString() : 'N/A'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewPost(comment.post_id)}
                            className="p-2 border-0 bg-transparent text-text-muted cursor-pointer rounded-md transition-all duration-200 hover:bg-bg-tertiary hover:text-text-primary"
                            title="View Post"
                          >
                            <FiEye className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleDelete(comment.id)}
                            className="p-2 border-0 bg-transparent text-text-muted cursor-pointer rounded-md transition-all duration-200 hover:bg-red-100 hover:text-red-600"
                            title="Delete"
                          >
                            <FiTrash2 className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-12 text-center text-text-muted"
                    >
                      No comments found. API endpoint needs to be implemented.
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
