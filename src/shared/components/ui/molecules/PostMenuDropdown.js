import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMoreVertical, FiEdit, FiTrash2 } from 'react-icons/fi';
import ApiController from '../../../services/ApiController';
import useAuth from '../../../hooks/useAuth';

/**
 * Post Menu Dropdown Component
 * Three dots menu with Edit and Delete options for post owners
 */
export default function PostMenuDropdown({ 
  post, 
  onDeleteSuccess,
  className = ""
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const dropdownRef = useRef(null);

  const isOwner = user?.id === post?.user?.id || user?.id === post?.user_id;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleEdit = () => {
    setIsOpen(false);
    navigate(`/editContent/${post.post_id}`);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบโพสต์นี้?");
    if (!confirmDelete) {
      setIsOpen(false);
      return;
    }

    setIsDeleting(true);
    setIsOpen(false);

    try {
      const result = await ApiController.deletePost(post.post_id);
      if (result.success) {
        if (onDeleteSuccess) {
          onDeleteSuccess();
        } else {
          navigate('/feed');
        }
      } else {
        alert('ไม่สามารถลบโพสต์ได้: ' + (result.error?.detail || result.error || 'เกิดข้อผิดพลาด'));
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('เกิดข้อผิดพลาดขณะลบโพสต์: ' + (error.message || 'Unknown error'));
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOwner) {
    return null;
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isDeleting}
        className={`
          p-2 rounded-full transition-all duration-200
          ${isOpen 
            ? 'bg-bg-tertiary text-text-primary' 
            : 'text-text-muted hover:bg-bg-tertiary hover:text-text-primary'
          }
          ${isDeleting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        aria-label="Post options"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <FiMoreVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-bg-secondary border border-border-color rounded-lg shadow-lg z-20 py-1">
            <button
              onClick={handleEdit}
              className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-bg-tertiary transition-colors flex items-center gap-3"
            >
              <FiEdit className="w-4 h-4" />
              <span>แก้ไข</span>
            </button>
            
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={`
                w-full px-4 py-2 text-left text-sm transition-colors flex items-center gap-3
                ${isDeleting
                  ? 'text-text-muted cursor-not-allowed'
                  : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                }
              `}
            >
              <FiTrash2 className="w-4 h-4" />
              <span>{isDeleting ? 'กำลังลบ...' : 'ลบ'}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
