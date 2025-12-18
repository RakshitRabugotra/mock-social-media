const rawPosts = [
  {
    _id: "post-1",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    username: "John Doe",
    timestamp: "2 hours ago",
    createdAt: "2024-06-10T12:00:00Z",
    updatedAt: "2024-06-10T12:00:00Z",
    feelingEmoji: "😊",
    postContent:
      "Had a fantastic lunch with friends today at our favorite Italian restaurant downtown. We tried the new pasta special and it was absolutely delicious! The conversation flowed naturally, and we spent over two hours catching up on life, work, and all the little things that matter. It's moments like these that remind me how important it is to slow down and enjoy the company of people you care about. Feeling refreshed and grateful for such wonderful friendships!",
  },
  {
    _id: "post-2",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    username: "Sarah Lee",
    timestamp: "1 hour ago",
    createdAt: "2024-06-10T13:30:00Z",
    updatedAt: "2024-06-10T14:00:00Z",
    feelingEmoji: "🌞",
    postContent:
      "Working on my tan at the beach today and it's absolutely perfect weather! The sun is warm but not too hot, there's a gentle breeze coming off the ocean, and the sound of waves is so relaxing. I've been reading a great book, taking occasional dips in the water, and just soaking in all this natural beauty. Sunny days like this really are the best - they remind me why I love living near the coast. Life feels simple and beautiful right now.",
  },
  {
    _id: "post-3",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    username: "Carlos Rivera",
    timestamp: "just now",
    createdAt: "2024-06-10T15:55:00Z",
    updatedAt: "2024-06-10T15:55:00Z",
    feelingEmoji: "💼",
    postContent:
      "Wrapped up a big project at work today that I've been working on for the past three months! It was challenging, required a lot of collaboration with different teams, and pushed me to learn new skills along the way. The presentation went smoothly, and the client was really happy with the results. There's something incredibly satisfying about seeing a project through from initial concept to final delivery. Feeling accomplished and ready to take on the next challenge!",
  },
  {
    _id: "post-4",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    username: "Alex Turner",
    timestamp: "5 minutes ago",
    createdAt: "2024-06-10T15:50:00Z",
    updatedAt: "2024-06-10T15:50:00Z",
    feelingEmoji: "🎸",
    postContent:
      "Jammed with the band last night and it was one of those magical sessions where everything just clicks! We've been working on this new song for a few weeks, and last night all the pieces finally fell into place. The melody, the rhythm, the harmonies - they all came together in a way that gave me goosebumps. There's nothing quite like the feeling of creating something beautiful with people who share your passion. The new song is coming together beautifully, and I can't wait to share it with everyone!",
  },
  {
    _id: "post-5",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
    username: "Priya Singh",
    timestamp: "10 minutes ago",
    createdAt: "2024-06-10T15:45:00Z",
    updatedAt: "2024-06-10T15:45:00Z",
    feelingEmoji: "📚",
    postContent:
      "Studying for finals has been intense, but I'm making good progress! I've been hitting the library every day, going through my notes, and working through practice problems. It's a lot of material to cover, but breaking it down into manageable chunks has been helping. I'm staying focused and motivated, knowing that summer break is just around the corner. I've already made plans for a road trip with friends, and I'm counting down the days. Can't wait for summer break and all the adventures ahead!",
  },
  {
    _id: "post-6",
    avatar: "https://randomuser.me/api/portraits/men/6.jpg",
    username: "Tommy Wu",
    timestamp: "30 minutes ago",
    createdAt: "2024-06-10T15:25:00Z",
    updatedAt: "2024-06-10T15:50:00Z",
    feelingEmoji: "💡",
    postContent:
      "Just came up with a new app idea that I'm really excited about! It came to me while I was thinking about a problem I face regularly, and I realized there might be a solution that could help others too. I've been sketching out the concept, thinking about the user experience, and planning out the core features. The more I think about it, the more potential I see. Time to start coding and bring this vision to life! I love that moment when an idea transitions from a thought to something tangible.",
  },
  {
    _id: "post-7",
    avatar: "https://randomuser.me/api/portraits/women/7.jpg",
    username: "Lina Müller",
    timestamp: "15 minutes ago",
    createdAt: "2024-06-10T15:40:00Z",
    updatedAt: "2024-06-10T15:40:00Z",
    feelingEmoji: "☕",
    postContent:
      "Enjoying my afternoon coffee while reading a book at my favorite café. There's something so peaceful about this routine - the rich aroma of freshly brewed coffee, the comfortable chair by the window, and getting lost in a good story. I'm reading a novel that a friend recommended, and it's been captivating from the first page. These quiet moments of solitude are so precious, especially in our busy lives. It's the perfect way to recharge and find a bit of calm in the middle of the day.",
  },
  {
    _id: "post-8",
    avatar: "https://randomuser.me/api/portraits/men/8.jpg",
    username: "Omar Farouk",
    timestamp: "3 hours ago",
    createdAt: "2024-06-10T12:50:00Z",
    updatedAt: "2024-06-10T12:50:00Z",
    feelingEmoji: "🏃‍♂️",
    postContent:
      "Early morning run in the park was exactly what I needed today! The air was crisp and fresh, the sun was just starting to rise, and the park was peaceful with only a few other early risers around. I pushed myself a bit harder than usual and felt that satisfying burn in my legs. There's something meditative about running - it clears my mind, energizes my body, and sets a positive tone for the rest of the day. Great way to start the day and I'm already looking forward to tomorrow's run!",
  },
  {
    _id: "post-9",
    avatar: "https://randomuser.me/api/portraits/men/9.jpg",
    username: "Markus Svensson",
    timestamp: "20 minutes ago",
    createdAt: "2024-06-10T15:35:00Z",
    updatedAt: "2024-06-10T15:50:00Z",
    feelingEmoji: "🤔",
    postContent:
      "Pondering life decisions today and taking some time to really think things through. I'm at a crossroads with a few important choices - career direction, personal goals, and where I want to be in the next few years. It's not always easy to know which path is right, but I'm trying to listen to my intuition and consider what truly matters to me. Sometimes you just need to pause and reflect, to step back from the daily hustle and ask yourself the bigger questions. It's a process, but I'm learning to be patient with myself.",
  },
  {
    _id: "post-10",
    avatar: "https://randomuser.me/api/portraits/women/10.jpg",
    username: "Emily Clark",
    timestamp: "25 minutes ago",
    createdAt: "2024-06-10T15:30:00Z",
    updatedAt: "2024-06-10T15:30:00Z",
    feelingEmoji: "🏖️",
    postContent:
      "Booked tickets for my summer vacation and I'm absolutely thrilled! I've been planning this trip for months, researching destinations, reading travel blogs, and saving up. Finally pulled the trigger and got the flights booked to a place I've always wanted to visit. The anticipation is already building - thinking about all the new experiences, foods to try, places to explore, and memories to make. So excited and counting down the days until I can pack my bags and embark on this adventure!",
  },
];

// The type of the mock post
type MockPost = (typeof rawPosts)[number];

export const mockPosts: Promise<MockPost[]> = new Promise((resolve) => {
  setTimeout(() => {
    resolve(rawPosts);
  }, 3000);
});
