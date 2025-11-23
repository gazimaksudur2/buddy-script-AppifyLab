import { useState } from 'react';
import { Link } from 'react-router-dom';
import { likeAPI, commentAPI } from '../../services/api';
import useAuth from '../../hooks/useAuth';
import LikesModal from './LikesModal';
import { toast } from 'react-toastify';

const CommentItem = ({ comment, postId }) => {
  const [replies, setReplies] = useState([]);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [likesCount, setLikesCount] = useState(comment.likesCount || 0);
  const [liked, setLiked] = useState(false); // Should come from backend
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [modalLikes, setModalLikes] = useState([]);
  const [loadingLikes, setLoadingLikes] = useState(false);

  const handleReplySubmit = async (e) => {
    if (e.key === 'Enter' && replyText.trim()) {
      try {
        const res = await commentAPI.createComment({
          content: replyText,
          postId,
          parentCommentId: comment._id
        });
        setReplies(prev => [...prev, res.data.comment]);
        setReplyText('');
        setIsReplying(false);
        if (!showReplies) setShowReplies(true);
      } catch (error) {
        console.error("Error replying:", error);
        toast.error("Failed to reply");
      }
    }
  };

  const toggleReplies = async () => {
    if (!showReplies) {
      try {
        const res = await commentAPI.getReplies(comment._id);
        setReplies(res.data.comments);
      } catch (error) {
        console.error("Error fetching replies:", error);
      }
    }
    setShowReplies(!showReplies);
  };

  const handleLike = async () => {
    try {
      const res = await likeAPI.toggleLike({ targetType: 'Comment', targetId: comment._id });
      setLiked(res.data.liked);
      setLikesCount(prev => res.data.liked ? prev + 1 : prev - 1);
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const fetchLikes = async () => {
    setShowLikesModal(true);
    setLoadingLikes(true);
    try {
      const res = await likeAPI.getLikes('Comment', comment._id);
      setModalLikes(res.data);
    } catch (error) {
      console.error("Error fetching comment likes:", error);
    } finally {
      setLoadingLikes(false);
    }
  };

  return (
    <div className="flex gap-3">
      <img src={comment.author?.profilePicture || '/assets/images/profile.png'} alt={comment.author?.firstName} className="w-8 h-8 rounded-full object-cover" />
      <div className="flex-1">
        <div className="bg-[#F5F5F5] p-3 rounded-2xl inline-block">
          <p className="font-bold text-sm text-[#212121]">{comment.author?.firstName} {comment.author?.lastName}</p>
          <p className="text-[#212121] text-sm">{comment.content}</p>
        </div>
        <div className="flex items-center gap-4 mt-1 ml-2 text-xs text-[#666666]">
          <button onClick={handleLike} className={`font-semibold hover:underline ${liked ? 'text-[#1890FF]' : ''}`}>Like</button>
          <button onClick={() => setIsReplying(!isReplying)} className="font-semibold hover:underline">Reply</button>
          <span className="cursor-pointer hover:underline" onClick={fetchLikes}>{likesCount > 0 ? `${likesCount} Likes` : ''}</span>
          <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Reply Input */}
        {isReplying && (
          <div className="mt-2">
            <input 
              type="text" 
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={handleReplySubmit}
              placeholder="Write a reply..." 
              className="w-full bg-[#F5F5F5] border border-[#F5F5F5] rounded-[32px] h-8 pl-4 pr-10 focus:outline-none focus:border-[#1890FF] text-xs text-[#212121]"
              autoFocus
            />
          </div>
        )}

        {/* View Replies Button */}
        {(comment.repliesCount > 0 || replies.length > 0) && (
          <button onClick={toggleReplies} className="text-xs font-semibold text-[#666666] mt-2 hover:underline">
            {showReplies ? 'Hide Replies' : `View ${comment.repliesCount || replies.length} Replies`}
          </button>
        )}

        {/* Nested Replies */}
        {showReplies && (
          <div className="mt-2 space-y-3 pl-4 border-l-2 border-gray-100">
            {replies.map(reply => (
              <CommentItem key={reply._id} comment={reply} postId={postId} />
            ))}
          </div>
        )}

        <LikesModal 
          isOpen={showLikesModal} 
          onClose={() => setShowLikesModal(false)} 
          likes={modalLikes} 
          loading={loadingLikes} 
        />
      </div>
    </div>
  );
};

const PostCard = ({ post }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [modalLikes, setModalLikes] = useState([]);
  const [loadingLikes, setLoadingLikes] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);

  const toggleComments = async () => {
    if (!showComments) {
      try {
        const res = await commentAPI.getComments(post._id || post.id);
        setComments(res.data.comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }
    setShowComments(!showComments);
  };

  const handleLike = async () => {
    try {
      const res = await likeAPI.toggleLike({ targetType: 'Post', targetId: post._id || post.id });
      setLiked(res.data.liked);
      setLikesCount(prev => res.data.liked ? prev + 1 : prev - 1);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const fetchLikes = async () => {
    setShowLikesModal(true);
    setLoadingLikes(true);
    try {
      const res = await likeAPI.getLikes('Post', post._id || post.id);
      setModalLikes(res.data);
    } catch (error) {
      console.error("Error fetching likes:", error);
    } finally {
      setLoadingLikes(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    if (e.key === 'Enter' && commentText.trim()) {
      try {
        const res = await commentAPI.createComment({
          content: commentText,
          postId: post._id || post.id
        });
        setComments(prev => [...prev, res.data.comment]);
        setCommentsCount(prev => prev + 1);
        setCommentText('');
        if (!showComments) setShowComments(true);
      } catch (error) {
        console.error("Error creating comment:", error);
        toast.error("Failed to post comment");
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-sm mb-6">
      {/* Post Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img src={post.author?.profilePicture || '/assets/images/profile.png'} alt={post.author?.firstName} className="w-full h-full object-cover" />
          </div>
          <div>
            <Link to="#" className="block text-[#212121] font-bold text-lg hover:text-[#1890FF]">
              {post.author?.firstName} {post.author?.lastName}
            </Link>
            <p className="text-[#666666] text-sm flex items-center gap-1">
                {new Date(post.createdAt).toLocaleDateString()} . {post.visibility}
            </p>
          </div>
        </div>
        <button className="text-[#666666] hover:text-[#1890FF]">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
        </button>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-[#212121] text-base mb-3 font-medium">{post.content}</p>
        {post.imageUrl && (
          <div className="rounded-md overflow-hidden">
            <img src={post.imageUrl} alt="Post Content" className="w-full h-auto object-cover" />
          </div>
        )}
      </div>

      {/* Reactions Count */}
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#E8E8E8]">
        <div className="flex items-center gap-[-8px] cursor-pointer" onClick={() => likesCount > 0 && fetchLikes()}>
            <div className="flex -space-x-2">
                {likesCount > 0 && post.recentLikes && post.recentLikes.length > 0 && (
                  post.recentLikes.map((liker, index) => (
                    <img 
                      key={index}
                      src={liker.profilePicture || '/assets/images/profile.png'} 
                      alt={liker.firstName} 
                      className="w-6 h-6 rounded-full border-2 border-white object-cover" 
                    />
                  ))
                )}
            </div>
            <span className="text-[#666666] text-sm ml-2 hover:underline">{likesCount} Likes</span>
        </div>
        <div className="flex gap-4 text-[#666666] text-sm">
            <span className="cursor-pointer hover:underline" onClick={toggleComments}>{commentsCount} Comment</span>
            <span>{post.shares || 0} Share</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={handleLike}
          className={`flex items-center gap-2 transition-colors font-medium ${liked ? 'text-[#1890FF]' : 'text-[#666666] hover:text-[#1890FF]'}`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-thumbs-up"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
            Like
        </button>
        <button 
          onClick={toggleComments}
          className="flex items-center gap-2 text-[#666666] hover:text-[#1890FF] transition-colors font-medium"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            Comment
        </button>
        <button className="flex items-center gap-2 text-[#666666] hover:text-[#1890FF] transition-colors font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-share-2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
            Share
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mb-4 space-y-4 border-t border-[#E8E8E8] pt-4">
          {comments.map(comment => (
            <CommentItem key={comment._id} comment={comment} postId={post._id || post.id} />
          ))}
        </div>
      )}

      {/* Comment Input */}
      <div className="flex gap-3">
        <img src={user?.profilePicture || "/assets/images/profile.png"} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
        <div className="flex-1 relative">
            <input 
                type="text" 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={handleCommentSubmit}
                placeholder="Write a comment" 
                className="w-full bg-[#F5F5F5] border border-[#F5F5F5] rounded-[32px] h-10 pl-4 pr-10 focus:outline-none focus:border-[#1890FF] text-sm text-[#212121]"
            />
             <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-2">
                <button className="text-[#666666] hover:text-[#1890FF]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-image"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                </button>
                <button className="text-[#666666] hover:text-[#1890FF]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-smile"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
                </button>
             </div>
        </div>
      </div>

      <LikesModal 
        isOpen={showLikesModal} 
        onClose={() => setShowLikesModal(false)} 
        likes={modalLikes} 
        loading={loadingLikes} 
      />
    </div>
  );
};

export default PostCard;
