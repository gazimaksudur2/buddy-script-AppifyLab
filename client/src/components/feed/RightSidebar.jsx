import { Link } from 'react-router-dom';

const RightSidebar = ({ suggestions }) => {
  // Using suggestions for "You Might Like" as well for now, or we can split if data differs
  // The HTML shows "You Might Like" has "Ignore/Follow" buttons
  // "Your Friends" has a list with online status or time

  const youMightLike = suggestions ? suggestions.slice(0, 1) : []; // Just showing one for demo as per HTML structure usually has one featured
  const friends = suggestions || []; // Using suggestions as friends list for now

  return (
    <div className="w-full">
      {/* You Might Like */}
      <div className="bg-white p-6 rounded-md shadow-sm mb-4">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-xl font-medium text-[#212121]">You Might Like</h4>
          <Link to="#" className="text-[#1890FF] text-sm hover:underline">See All</Link>
        </div>
        <hr className="border-[#E8E8E8] mb-6" />
        
        {youMightLike.map((person) => (
          <div key={person.id}>
            <div className="flex items-center gap-3 mb-6">
              <img src={person.avatar} alt={person.name} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <Link to="#" className="block text-[#212121] font-medium hover:text-[#1890FF]">{person.name}</Link>
                <p className="text-[#666666] text-sm">{person.title}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 border border-[#E8E8E8] text-[#666666] py-2 rounded hover:bg-gray-50 transition-colors">Ignore</button>
              <button className="flex-1 bg-[#1890FF] text-white py-2 rounded hover:bg-blue-600 transition-colors shadow-md shadow-blue-200">Follow</button>
            </div>
          </div>
        ))}
      </div>

      {/* Your Friends */}
      <div className="bg-white p-6 rounded-md shadow-sm relative">
        <div className="sticky top-0 bg-white z-10 pb-4">
            <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl font-medium text-[#212121]">Your Friends</h4>
            <Link to="#" className="text-[#1890FF] text-sm hover:underline">See All</Link>
            </div>
            <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17" className="absolute left-4 top-3.5">
                    <circle cx="7" cy="7" r="6" stroke="#666"></circle>
                    <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3"></path>
                </svg>
                <input type="text" placeholder="input search text" className="w-full bg-[#F5F5F5] border border-[#F5F5F5] rounded-[32px] h-10 pl-12 pr-4 focus:outline-none focus:border-[#1890FF]" />
            </div>
        </div>

        <div className="space-y-6 mt-2">
          {friends.map((friend, index) => (
            <div key={friend.id} className={`flex items-center justify-between ${index === 0 || index === 3 ? 'opacity-50' : ''}`}> {/* Simulating inactive/active based on index for demo */}
              <div className="flex items-center gap-3">
                <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <Link to="#" className="block text-[#212121] font-medium hover:text-[#1890FF]">{friend.name}</Link>
                  <p className="text-[#666666] text-sm">{friend.title}</p>
                </div>
              </div>
              <div className="text-xs text-[#666666]">
                  {index % 2 === 0 ? '5 minute ago' : (
                      <span className="block w-3 h-3 bg-[#0ACF83] rounded-full border-2 border-white"></span>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
