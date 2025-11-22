import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { postAPI } from '../services/api';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';
import Header from '../components/Header';
import { toast } from 'react-toastify';

const Feed = () => {
  const { dbUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await postAPI.getPosts(pageNum, 10);
      
      if (pageNum === 1) {
        setPosts(response.data.posts);
      } else {
        setPosts(prev => [...prev, ...response.data.posts]);
      }
      
      setHasMore(response.data.pagination.page < response.data.pagination.pages);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(prev => prev.map(post => 
      post._id === updatedPost._id ? updatedPost : post
    ));
  };

  const handlePostDeleted = (postId) => {
    setPosts(prev => prev.filter(post => post._id !== postId));
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  return (
    <div className="_layout _layout_main_wrapper">
      <Header />
      
      <div className="_main_layout">
        <div className="container _custom_container _padd_t110">
          <div className="row">
            {/* Main Feed Column */}
            <div className="col-xl-8 col-lg-8 col-md-12">
              {/* Create Post */}
              <CreatePost onPostCreated={handlePostCreated} />

              {/* Posts Feed */}
              <div className="_feed_posts">
                {loading && page === 1 ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="text-muted">No posts yet. Be the first to post!</p>
                  </div>
                ) : (
                  <>
                    {posts.map(post => (
                      <Post 
                        key={post._id} 
                        post={post}
                        currentUser={dbUser}
                        onUpdate={handlePostUpdated}
                        onDelete={handlePostDeleted}
                      />
                    ))}
                    
                    {hasMore && (
                      <div className="text-center py-4">
                        <button 
                          className="btn btn-outline-primary"
                          onClick={loadMore}
                          disabled={loading}
                        >
                          {loading ? 'Loading...' : 'Load More'}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-xl-4 col-lg-4 col-md-12">
              <div className="_feed_sidebar">
                {/* User Profile Card */}
                <div className="_feed_sidebar_card _mar_b24">
                  <div className="_feed_profile_card">
                    <div className="_feed_profile_img">
                      <img 
                        src={dbUser?.profilePicture || '/assets/images/Avatar.png'} 
                        alt="Profile" 
                        className="_profile_img"
                      />
                    </div>
                    <h4 className="_feed_profile_name">{dbUser?.fullName || 'User'}</h4>
                    <p className="_feed_profile_email">{dbUser?.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;

