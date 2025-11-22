import React, { useState } from 'react';
import { postAPI, likeAPI } from '../services/api';
import { toast } from 'react-toastify';
import Comments from './Comments';
import LikesList from './LikesList';

const Post = ({ post, currentUser, onUpdate, onDelete }) => {
  const [showComments, setShowComments] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [likedBy, setLikedBy] = useState(post.likedBy || []);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount);

  const isAuthor = currentUser?._id === post.author._id;
  
  const formatDate = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInMs = now - postDate;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    if (diffInHours < 24) return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffInDays < 7) return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    
    return postDate.toLocaleDateString();
  };

  const handleLike = async () => {
    try {
      const response = await likeAPI.toggleLike({
        targetType: 'Post',
        targetId: post._id
      });

      setIsLiked(response.data.isLiked);
      setLikesCount(response.data.likesCount);
      setLikedBy(response.data.likedBy);
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await postAPI.deletePost(post._id);
      onDelete(post._id);
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const handleCommentAdded = () => {
    setCommentsCount(prev => prev + 1);
  };

  return (
    <div className="_post_card _mar_b24">
      <div className="_post_header">
        <div className="_post_user">
          <img 
            src={post.author.profilePicture || '/assets/images/Avatar.png'} 
            alt={post.author.fullName} 
            className="_post_user_img"
          />
          <div className="_post_user_info">
            <h5 className="_post_user_name">{post.author.fullName}</h5>
            <p className="_post_time">
              {formatDate(post.createdAt)}
              {post.visibility === 'private' && (
                <span className="_private_badge"> • Private</span>
              )}
            </p>
          </div>
        </div>
        
        {isAuthor && (
          <div className="_post_actions">
            <button className="_post_action_btn" onClick={handleDelete}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="_post_body">
        <p className="_post_content">{post.content}</p>
        {post.imageUrl && (
          <div className="_post_image_wrap">
            <img 
              src={`http://localhost:5000${post.imageUrl}`} 
              alt="Post" 
              className="_post_image"
            />
          </div>
        )}
      </div>

      <div className="_post_stats">
        <button 
          className="_post_stat_btn"
          onClick={() => setShowLikes(!showLikes)}
        >
          <span className="_stat_count">{likesCount}</span>
          <span className="_stat_label">Likes</span>
        </button>
        <button 
          className="_post_stat_btn"
          onClick={() => setShowComments(!showComments)}
        >
          <span className="_stat_count">{commentsCount}</span>
          <span className="_stat_label">Comments</span>
        </button>
      </div>

      {showLikes && (
        <LikesList 
          likes={likedBy}
          onClose={() => setShowLikes(false)}
        />
      )}

      <div className="_post_footer">
        <button 
          className={`_post_footer_btn ${isLiked ? '_liked' : ''}`}
          onClick={handleLike}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
          </svg>
          Like
        </button>
        <button 
          className="_post_footer_btn"
          onClick={() => setShowComments(!showComments)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
          </svg>
          Comment
        </button>
      </div>

      {showComments && (
        <Comments 
          postId={post._id}
          currentUser={currentUser}
          onCommentAdded={handleCommentAdded}
        />
      )}
    </div>
  );
};

export default Post;

