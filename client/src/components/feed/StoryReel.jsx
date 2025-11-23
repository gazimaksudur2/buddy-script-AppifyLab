import { useRef } from 'react';
import { uploadImage } from '../../services/cloudinary';
import { storyAPI } from '../../services/api';
import useAuth from '../../hooks/useAuth';

const StoryReel = ({ stories, onStoryCreated }) => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const imageUrl = await uploadImage(file);
      await storyAPI.createStory({ imageUrl });
      if (onStoryCreated) onStoryCreated();
    } catch (error) {
      console.error('Error creating story:', error);
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
      {/* Your Story Card */}
      <div 
        className="flex-shrink-0 w-[140px] h-[200px] relative rounded-[10px] overflow-hidden group cursor-pointer"
        onClick={() => fileInputRef.current.click()}
      >
        <img src={user?.profilePicture || "/assets/images/profile.png"} alt="Your Story" className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
        <div className="absolute bottom-0 left-0 right-0 p-3 text-center bg-white/10 backdrop-blur-sm pt-8">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-[#1890FF] rounded-full flex items-center justify-center border-4 border-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14">
                    <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 1v12M1 7h12"/>
                </svg>
            </div>
          <span className="text-white text-sm font-medium">Create Story</span>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      {/* Friends Stories */}
      {stories && stories.map((story) => (
        <div key={story._id} className="flex-shrink-0 w-[140px] h-[200px] relative rounded-[10px] overflow-hidden group cursor-pointer">
          <img src={story.imageUrl} alt={story.author?.fullName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>
          
          {/* User Avatar Top Right */}
          <div className="absolute top-3 right-3 w-10 h-10 rounded-full border-2 border-[#1890FF] p-0.5 bg-white">
              <img src={story.author?.profilePicture || "/assets/images/profile.png"} alt={story.author?.fullName} className="w-full h-full rounded-full object-cover" />
          </div>

          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-white text-sm font-medium truncate">{story.author?.firstName} {story.author?.lastName}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoryReel;
