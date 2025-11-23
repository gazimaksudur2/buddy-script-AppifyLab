import { useState, useEffect } from 'react';
import axios from 'axios';
import { postAPI, storyAPI } from '../services/api';
import LeftSidebar from '../components/feed/LeftSidebar';
import RightSidebar from '../components/feed/RightSidebar';
import StoryReel from '../components/feed/StoryReel';
import CreatePost from '../components/feed/CreatePost';
import PostCard from '../components/feed/PostCard';

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const postsRes = await postAPI.getPosts();
      setPosts(postsRes.data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchStories = async () => {
    try {
      const res = await storyAPI.getStories();
      setStories(res.data);
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, storiesRes, suggestionsRes, eventsRes] = await Promise.all([
          postAPI.getPosts(),
          storyAPI.getStories(),
          axios.get('http://localhost:5000/api/suggestions'),
          axios.get('http://localhost:5000/api/events')
        ]);

        setPosts(postsRes.data.posts);
        setStories(storiesRes.data);
        setSuggestions(suggestionsRes.data);
        setEvents(eventsRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-[#F0F2F5] min-h-screen pt-[90px] pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - 25% width on large screens */}
          <div className="hidden lg:block lg:col-span-1">
            <LeftSidebar suggestions={suggestions} events={events} />
          </div>

          {/* Main Feed - 50% width on large screens (spanning 2 cols if 4 cols total) */}
          <div className="lg:col-span-2 space-y-6">
            <StoryReel stories={stories} onStoryCreated={fetchStories} />
            <CreatePost onPostCreated={fetchPosts} />
            
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Right Sidebar - 25% width on large screens */}
          <div className="hidden lg:block lg:col-span-1">
            <RightSidebar suggestions={suggestions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedPage;
