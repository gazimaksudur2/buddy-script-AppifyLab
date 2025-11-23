const users = [
  {
    id: 1,
    name: "Dylan Field",
    avatar: "assets/images/profile.png",
    title: "CEO of Figma"
  },
  {
    id: 2,
    name: "Steve Jobs",
    avatar: "assets/images/people1.png",
    title: "CEO of Apple"
  },
  {
    id: 3,
    name: "Ryan Roslansky",
    avatar: "assets/images/people2.png",
    title: "CEO of Linkedin"
  },
  {
    id: 4,
    name: "Karim Saif",
    avatar: "assets/images/post_img.png", // Using post img as avatar for now as per html
    title: "Developer"
  },
  {
    id: 5,
    name: "Josephine Langford",
    avatar: "assets/images/people3.png",
    title: "Actress"
  }
];

const posts = [
  {
    id: 1,
    userId: 4, // Karim Saif
    content: "-Healthy Tracking App",
    image: "assets/images/timeline_img.png",
    time: "5 minute ago",
    privacy: "Public",
    likes: 198,
    comments: 12,
    shares: 122,
    user: users[3]
  },
  {
    id: 2,
    userId: 1, // Dylan Field
    content: "Excited to announce new features coming to Figma! #design #figma",
    image: null,
    time: "2 hours ago",
    privacy: "Public",
    likes: 1540,
    comments: 342,
    shares: 500,
    user: users[0]
  },
  {
    id: 3,
    userId: 2, // Steve Jobs
    content: "Innovation distinguishes between a leader and a follower.",
    image: "assets/images/feed_event1.png",
    time: "4 hours ago",
    privacy: "Friends",
    likes: 9999,
    comments: 1000,
    shares: 2000,
    user: users[1]
  }
];

const stories = [
  {
    id: 1,
    userId: 1,
    image: "assets/images/card_ppl1.png",
    isUser: true,
    name: "Your Story"
  },
  {
    id: 2,
    userId: 3,
    image: "assets/images/card_ppl2.png",
    name: "Ryan Roslansky"
  },
  {
    id: 3,
    userId: 2,
    image: "assets/images/card_ppl3.png",
    name: "Steve Jobs"
  },
  {
    id: 4,
    userId: 5,
    image: "assets/images/card_ppl4.png",
    name: "Josephine"
  },
  {
    id: 5,
    userId: 4,
    image: "assets/images/card_ppl1.png",
    name: "Karim Saif"
  }
];

const suggestions = [
  {
    id: 2,
    name: "Steve Jobs",
    title: "CEO of Apple",
    avatar: "assets/images/people1.png"
  },
  {
    id: 3,
    name: "Ryan Roslansky",
    title: "CEO of Linkedin",
    avatar: "assets/images/people2.png"
  },
  {
    id: 1,
    name: "Dylan Field",
    title: "CEO of Figma",
    avatar: "assets/images/people3.png"
  }
];

const events = [
  {
    id: 1,
    title: "No more terrorism no more cry",
    date: { day: "10", month: "Jul" },
    image: "assets/images/feed_event1.png",
    going: 17
  }
];

module.exports = { users, posts, stories, suggestions, events };
