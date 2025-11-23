import React, { useState, useEffect } from 'react';
import { commentAPI, likeAPI } from '../services/api';
import { toast } from 'react-toastify';
import LikesList from './LikesList';

const Comments = ({ postId, currentUser, onCommentAdded }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState({});
  const [replies, setReplies] = useState({});
  const [showLikes, setShowLikes] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await commentAPI.getComments(postId);
        setComments(response.data.comments);
      } catch (error) {
        console.error('Error fetching comments:', error);
        toast.error('Failed to load comments');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const fetchReplies = async (commentId) => {
    try {
      const response = await commentAPI.getReplies(commentId);
      setReplies(prev => ({
        ...prev,
        [commentId]: response.data.replies
      }));
    } catch (error) {
      console.error('Error fetching replies:', error);
      toast.error('Failed to load replies');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;

    try {
      const response = await commentAPI.createComment({
        postId,
        content: newComment
      });

      setComments(prev => [response.data.comment, ...prev]);
      setNewComment('');
      if (onCommentAdded) onCommentAdded();
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleAddReply = async (commentId) => {
    if (!replyText.trim()) return;

    try {
      const response = await commentAPI.createComment({
        postId,
        content: replyText,
        parentCommentId: commentId
      });

      // Add reply to the replies state
      setReplies(prev => ({
        ...prev,
        [commentId]: [response.data.comment, ...(prev[commentId] || [])]
      }));

      // Update replies count
      setComments(prev => prev.map(comment => 
        comment._id === commentId 
          ? { ...comment, repliesCount: comment.repliesCount + 1 }
          : comment
      ));

      setReplyText('');
      setReplyingTo(null);
      toast.success('Reply added successfully');
    } catch (error) {
      console.error('Error adding reply:', error);
      toast.error('Failed to add reply');
    }
  };

  const handleLikeComment = async (commentId, isReply = false) => {
    try {
      const response = await likeAPI.toggleLike({
        targetType: 'Comment',
        targetId: commentId
      });

      const updateLikes = (items) => items.map(item => 
        item._id === commentId 
          ? { 
              ...item, 
              isLiked: response.data.isLiked, 
              likesCount: response.data.likesCount,
              likedBy: response.data.likedBy
            }
          : item
      );

      if (isReply) {
        setReplies(prev => {
          const newReplies = { ...prev };
          Object.keys(newReplies).forEach(key => {
            newReplies[key] = updateLikes(newReplies[key]);
          });
          return newReplies;
        });
      } else {
        setComments(prev => updateLikes(prev));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };

  const handleDeleteComment = async (commentId, isReply = false, parentId = null) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await commentAPI.deleteComment(commentId);
      
      if (isReply) {
        setReplies(prev => ({
          ...prev,
          [parentId]: prev[parentId].filter(reply => reply._id !== commentId)
        }));
        setComments(prev => prev.map(comment => 
          comment._id === parentId 
            ? { ...comment, repliesCount: comment.repliesCount - 1 }
            : comment
        ));
      } else {
        setComments(prev => prev.filter(comment => comment._id !== commentId));
      }
      
      toast.success('Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const toggleReplies = (commentId) => {
    const isShowing = showReplies[commentId];
    
    if (!isShowing && !replies[commentId]) {
      fetchReplies(commentId);
    }
    
    setShowReplies(prev => ({
      ...prev,
      [commentId]: !isShowing
    }));
  };

  const formatDate = (date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInMs = now - commentDate;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const CommentItem = ({ comment, isReply = false, parentId = null }) => {
    const isAuthor = currentUser?._id === comment.author._id;

    return (
      <div className={`_comment_item ${isReply ? '_reply_item' : ''}`}>
        <div className="_comment_avatar">
          <img 
            src={comment.author.profilePicture || '/assets/images/Avatar.png'} 
            alt={comment.author.fullName}
            className="_comment_user_img"
          />
        </div>
        <div className="_comment_content_wrap">
          <div className="_comment_bubble">
            <div className="_comment_header">
              <h6 className="_comment_author">{comment.author.fullName}</h6>
              <span className="_comment_time">{formatDate(comment.createdAt)}</span>
            </div>
            <p className="_comment_text">{comment.content}</p>
          </div>
          
          <div className="_comment_actions">
            <button 
              className={`_comment_action_btn ${comment.isLiked ? '_liked' : ''}`}
              onClick={() => handleLikeComment(comment._id, isReply)}
            >
              Like {comment.likesCount > 0 && `(${comment.likesCount})`}
            </button>
            
            {!isReply && (
              <button 
                className="_comment_action_btn"
                onClick={() => setReplyingTo(comment._id)}
              >
                Reply
              </button>
            )}
            
            {comment.likesCount > 0 && (
              <button 
                className="_comment_action_btn"
                onClick={() => setShowLikes(comment._id)}
              >
                View Likes
              </button>
            )}
            
            {isAuthor && (
              <button 
                className="_comment_action_btn _delete"
                onClick={() => handleDeleteComment(comment._id, isReply, parentId)}
              >
                Delete
              </button>
            )}
          </div>

          {showLikes === comment._id && (
            <LikesList 
              likes={comment.likedBy || []}
              onClose={() => setShowLikes(null)}
            />
          )}

          {!isReply && comment.repliesCount > 0 && (
            <button 
              className="_view_replies_btn"
              onClick={() => toggleReplies(comment._id)}
            >
              {showReplies[comment._id] ? 'Hide' : 'View'} {comment.repliesCount} {comment.repliesCount === 1 ? 'reply' : 'replies'}
            </button>
          )}

          {replyingTo === comment._id && (
            <div className="_reply_form">
              <textarea 
                className="form-control"
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows="2"
              />
              <div className="_reply_form_actions">
                <button 
                  className="btn btn-sm btn-primary"
                  onClick={() => handleAddReply(comment._id)}
                >
                  Reply
                </button>
                <button 
                  className="btn btn-sm btn-secondary"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyText('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {showReplies[comment._id] && replies[comment._id] && (
            <div className="_replies_list">
              {replies[comment._id].map(reply => (
                <CommentItem 
                  key={reply._id} 
                  comment={reply} 
                  isReply={true}
                  parentId={comment._id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="_comments_section">
      <div className="_add_comment_form">
        <form onSubmit={handleAddComment}>
          <div className="_add_comment_input_wrap">
            <img 
              src={currentUser?.profilePicture || '/assets/images/Avatar.png'} 
              alt="Your avatar"
              className="_comment_user_img"
            />
            <input 
              type="text"
              className="form-control _add_comment_input"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button 
              type="submit" 
              className="btn btn-primary btn-sm"
              disabled={!newComment.trim()}
            >
              Post
            </button>
          </div>
        </form>
      </div>

      <div className="_comments_list">
        {loading ? (
          <div className="text-center py-3">
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : comments.length === 0 ? (
          <p className="text-muted text-center py-3">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => (
            <CommentItem key={comment._id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;

