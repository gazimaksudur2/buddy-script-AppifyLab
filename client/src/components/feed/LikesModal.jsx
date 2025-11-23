const LikesModal = ({ isOpen, onClose, likes, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Likes</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <div className="overflow-y-auto p-4 max-h-[60vh]">
          {loading ? (
            <div className="flex justify-center p-4">
              <span className="loading loading-spinner loading-md"></span>
            </div>
          ) : likes.length > 0 ? (
            <div className="space-y-4">
              {likes.map((like) => (
                <div key={like._id} className="flex items-center gap-3">
                  <img 
                    src={like.user?.profilePicture || '/assets/images/profile.png'} 
                    alt={like.user?.firstName} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {like.user?.firstName} {like.user?.lastName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">No likes yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LikesModal;
