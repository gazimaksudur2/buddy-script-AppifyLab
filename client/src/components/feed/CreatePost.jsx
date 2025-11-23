import { useState, useRef } from 'react';
import { uploadImage } from '../../services/cloudinary';
import { postAPI } from '../../services/api';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-toastify';

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [visibility, setVisibility] = useState('public');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && !image) {
      return toast.warning("Please add some content or an image!");
    }

    setLoading(true);
    try {
      let imageUrl = '';
      if (image) {
        imageUrl = await uploadImage(image);
      }

      await postAPI.createPost({ content, imageUrl, visibility });
      toast.success("Post created successfully!");
      setContent('');
      setImage(null);
      setPreview(null);
      if (onPostCreated) onPostCreated();
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-sm mb-6">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <img src={user?.profilePicture || "/assets/images/profile.png"} alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 relative">
            <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`What's on your mind, ${user?.fullName?.split(' ')[0] || 'User'}?`}
                className="w-full min-h-[50px] pl-4 pr-10 bg-transparent text-[#666666] text-lg focus:outline-none resize-none pt-2"
            />
            {preview && (
              <div className="mt-4 relative">
                <img src={preview} alt="Preview" className="max-h-[300px] rounded-md object-cover" />
                <button 
                  onClick={() => { setImage(null); setPreview(null); }}
                  className="absolute top-2 right-2 bg-gray-800/50 text-white p-1 rounded-full hover:bg-gray-800/70"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            )}
        </div>
      </div>
      
      <hr className="border-[#E8E8E8] mb-6" />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <button 
              onClick={() => fileInputRef.current.click()}
              className="flex items-center gap-2 text-[#666666] hover:text-[#1890FF] transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-image"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                <span className="text-sm font-medium">Photo</span>
            </button>
            <button className="flex items-center gap-2 text-[#666666] hover:text-[#1890FF] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-video"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                <span className="text-sm font-medium">Video</span>
            </button>
            <button className="flex items-center gap-2 text-[#666666] hover:text-[#1890FF] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <span className="text-sm font-medium">Event</span>
            </button>
            <button className="flex items-center gap-2 text-[#666666] hover:text-[#1890FF] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                <span className="text-sm font-medium">Article</span>
            </button>
            
            <select 
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="bg-gray-100 border-none text-sm rounded-md px-3 py-2 text-gray-600 focus:ring-2 focus:ring-[#1890FF] outline-none cursor-pointer"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
        </div>
        
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="bg-[#1890FF] text-white px-8 py-2.5 rounded hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-send"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            )}
            Post
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
