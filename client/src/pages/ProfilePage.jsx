import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { postAPI } from '../services/api';
import PostCard from '../components/feed/PostCard';
import MainLayout from '../layouts/MainLayout';

const ProfilePage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        // In a real app, we'd filter by user ID. 
        // For now, fetching all posts and filtering client-side or assuming backend supports it.
        // Ideally: await postAPI.getUserPosts(user._id);
        const res = await postAPI.getPosts(1, 100); 
        const userPosts = res.data.posts.filter(post => post.author._id === user._id || post.author.id === user._id);
        setPosts(userPosts);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  if (!user) return null;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600"></div>
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-16 mb-6">
              <div className="flex items-end gap-6">
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white">
                  <img 
                    src={user.profilePicture || "/assets/images/profile.png"} 
                    alt={user.firstName} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{user.firstName} {user.lastName}</h1>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-200 transition-colors">
                Edit Profile
              </button>
            </div>
            
            <div className="border-t pt-6 flex gap-8 text-gray-600">
              <div className="text-center">
                <span className="block font-bold text-gray-900 text-xl">{posts.length}</span>
                <span className="text-sm">Posts</span>
              </div>
              <div className="text-center">
                <span className="block font-bold text-gray-900 text-xl">0</span>
                <span className="text-sm">Followers</span>
              </div>
              <div className="text-center">
                <span className="block font-bold text-gray-900 text-xl">0</span>
                <span className="text-sm">Following</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Posts */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Posts</h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : posts.length > 0 ? (
            posts.map(post => (
              <PostCard key={post._id} post={post} />
            ))
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">
              No posts yet.
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
