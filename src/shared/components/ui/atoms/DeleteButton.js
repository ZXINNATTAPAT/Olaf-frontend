import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import useAuth from '../../../hooks/useAuth';
import { useNavigate } from "react-router-dom";
import ApiController from '../../../services/ApiController';

export default function DeleteButton({ post_id, postUserId, onDeleteSuccess }) {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    setIsDeleting(true);

    try {
      const result = await ApiController.deletePost(post_id);
      if (result.success) {
        alert('Post deleted successfully.');
        navigate('/feed');
        onDeleteSuccess();
      } else {
        alert('Failed to delete the post.');
      }
    } catch (error) {
      console.error('Error deleting the post:', error);
      alert('An error occurred while deleting the post.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!postUserId || user?.id !== postUserId) {
    return null;
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`
        flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-black text-white
        transition-all duration-200
        ${isDeleting 
          ? 'bg-black opacity-50 cursor-not-allowed' 
          : 'bg-red-600 hover:opacity-80 cursor-pointer border-red-600'
        }
      `}
    >
      <FaTrash />
      <span>{isDeleting ? "Deleting..." : "Delete"}</span>
    </button>
  );
}

