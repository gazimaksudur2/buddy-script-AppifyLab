import React from 'react';

const LikesList = ({ likes, onClose }) => {
  return (
    <div className="_likes_modal">
      <div className="_likes_modal_content">
        <div className="_likes_modal_header">
          <h5>Liked by</h5>
          <button className="_likes_modal_close" onClick={onClose}>×</button>
        </div>
        <div className="_likes_modal_body">
          {likes.length === 0 ? (
            <p className="text-muted text-center py-3">No likes yet</p>
          ) : (
            <div className="_likes_list">
              {likes.map(user => (
                <div key={user._id} className="_likes_list_item">
                  <img 
                    src={user.profilePicture || '/assets/images/Avatar.png'} 
                    alt={user.fullName}
                    className="_likes_user_img"
                  />
                  <div className="_likes_user_info">
                    <h6 className="_likes_user_name">{user.fullName}</h6>
                    <p className="_likes_user_email">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LikesList;

