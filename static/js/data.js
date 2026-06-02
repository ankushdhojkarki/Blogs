/* ============================================
   MOCK BLOG DATA
   ============================================ */

const blogPosts = [
  {
    id: 1,
    title: "Code that Frustrated Me Until It Didn't",
    slug: "code-frustration",
    excerpt: "Debugging isn't about finding bugs. It's about understanding why your assumptions were wrong.",
    content: `<h2>The Problem</h2>
<p>Last week, I spent six hours debugging a race condition that only appeared in production. The logs were cryptic, the behavior was inconsistent, and my confidence was shattered.</p>

<p>I'd built a caching layer that was supposed to speed up database queries. It worked flawlessly in development and testing, but in production, with thousands of concurrent requests, it fell apart.</p>

<h2>The Journey</h2>
<p>Instead of panic, I took a breath and approached it systematically:</p>
<ul>
<li>Reproduced the issue locally with higher concurrency</li>
<li>Added detailed logging at every step</li>
<li>Questioned every assumption I'd made</li>
<li>Read the documentation for the caching library again</li>
</ul>

<h2>The Realization</h2>
<p>The cache invalidation was happening asynchronously, but my code was checking it synchronously. A classic race condition. One line of code - a simple wait - fixed it.</p>

<p>The frustration wasn't wasted. It taught me to think about concurrency from the start, not as an afterthought. The next time, I'll debug faster.</p>

<p>Code frustration isn't a sign you're not cut out for this. It's proof that you care about doing it right.</p>`,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop",
    category: "Code",
    author: "You",
    date: "2024-01-15",
    readTime: "7 min",
    tags: ["debugging", "concurrency", "learning"],
    featured: true
  },
  {
    id: 2,
    title: "Books That Changed How I Think",
    slug: "books-changed-thinking",
    excerpt: "Some books don't just entertain. They rewire your brain and make you question everything.",
    content: `<h2>The Ones That Stick</h2>
<p>I read about 40 books a year. Most are good. Some are great. A few fundamentally change how I see the world.</p>

<h2>Thinking, Fast and Slow</h2>
<p>Daniel Kahneman's work on cognitive biases showed me that my intuitions are often wrong. That my confident decisions are sometimes the ones most likely to fail. It's humbling and liberating at the same time.</p>

<h2>Finite and Infinite Games</h2>
<p>James Carse reframed how I think about competition and collaboration. An infinite game isn't won—it's continued. This changed how I approach my career and relationships.</p>

<h2>Braiding Sweetgrass</h2>
<p>Robin Wall Kimmerer writes about reciprocity with nature in a way that feels revolutionary. It's not just ecological; it's deeply philosophical and personally transformative.</p>

<p>Books that change your thinking do one thing: they make you question your assumptions. Seek those out.</p>`,
    image: "https://images.unsplash.com/photo-1507842072343-583684d2e44c?w=800&h=400&fit=crop",
    category: "Books",
    author: "You",
    date: "2024-01-10",
    readTime: "6 min",
    tags: ["reading", "philosophy", "growth"],
    featured: true
  },
  {
    id: 3,
    title: "Games I Love: More Than Entertainment",
    slug: "games-beyond-entertainment",
    excerpt: "Games teach design, narrative, and the art of meaningful challenge.",
    content: `<h2>Games as Art</h2>
<p>I love games not because they're escapism—though they can be—but because they're carefully designed systems that teach.</p>

<h2>Outer Wilds</h2>
<p>This game respects your intelligence. It throws you into a solar system with a mystery and trusts you to explore, question, and discover. No quest markers. No hand-holding. Pure curiosity-driven exploration.</p>

<h2>Hades</h2>
<p>The design philosophy: every failure teaches you something. The difficulty curve is perfect. The narrative unfolds through gameplay, not cutscenes. That's mastery.</p>

<h2>Disco Elysium</h2>
<p>A game about a detective recovering his memory in a dystopian city. The combat system is conversation. Your stats are personality traits that argue with each other. It's philosophical, funny, and completely unique.</p>

<p>Great games don't just entertain—they make you think about how systems work, how stories are told, and what it means to be engaged.</p>`,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop",
    category: "Games",
    author: "You",
    date: "2024-01-05",
    readTime: "5 min",
    tags: ["gaming", "design", "art"],
    featured: true
  },
  {
    id: 4,
    title: "Ordinary Days That Became Extraordinary",
    slug: "ordinary-extraordinary",
    excerpt: "Most growth happens quietly, in moments you don't recognize as important.",
    content: `<h2>The Day I Almost Quit</h2>
<p>I was considering leaving tech entirely. I'd been coding for 10 years, and it felt hollow. I'd built impressive things, but I wasn't satisfied.</p>

<p>I sat in a coffee shop for three hours, journaling. Not productively. Just honestly.</p>

<p>By the end, I realized it wasn't code that was the problem—it was my relationship with it. I'd been chasing external validation. Impressive projects. Impressive salaries. Impressive titles.</p>

<h2>The Shift</h2>
<p>I decided to build things for myself again. Small projects. Weird projects. Projects that served no career purpose but made me curious.</p>

<p>A month later, I'd rediscovered joy in coding. Not because the code changed. Because my intention changed.</p>

<h2>The Lesson</h2>
<p>Most of our biggest breakthroughs happen in ordinary moments—sitting alone, thinking hard, being honest with ourselves. There's no fanfare. No one claps. But three months later, everything is different.</p>

<p>Pay attention to those quiet days. They're often the important ones.</p>`,
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=400&fit=crop",
    category: "Life",
    author: "You",
    date: "2023-12-28",
    readTime: "6 min",
    tags: ["reflection", "growth", "life"],
    featured: true
  },
  {
    id: 5,
    title: "The Art of Asking for Help",
    slug: "asking-for-help",
    excerpt: "Vulnerability isn't weakness. It's clarity about what you don't know.",
    content: `<h2>Why We Don't Ask</h2>
<p>We're taught that asking for help is weakness. That competent people figure things out alone. It's a lie that costs us years of unnecessary struggling.</p>

<h2>The Permission to Be Uncertain</h2>
<p>I spent two years trying to understand architecture patterns alone. I read books. I built projects. But I was building on shaky foundations.</p>

<p>When I finally asked a mentor, she spent 30 minutes explaining the principles. Two hours of direct teaching saved me months of confused self-study.</p>

<h2>The Real Cost</h2>
<p>The cost of not asking isn't just time. It's opportunity. It's the projects you don't build. The risks you don't take. The growth that doesn't happen because you're too busy being stuck.</p>

<h2>How to Ask Well</h2>
<p>Be specific about what you've tried and where you're stuck. Show you've made effort. Most people are generous with their time if you respect it.</p>

<p>The best people you know aren't the ones who figured it all out alone. They're the ones who asked the right questions at the right time.</p>`,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop",
    category: "Code",
    author: "You",
    date: "2023-12-20",
    readTime: "5 min",
    tags: ["mentorship", "growth", "vulnerability"],
    featured: false
  },
  {
    id: 6,
    title: "Starting a Project is the Easy Part",
    slug: "finishing-projects",
    excerpt: "Most projects fail not at the start, but somewhere in the middle.",
    content: `<h2>The Middle is Where Dreams Go to Die</h2>
<p>You start with energy. The vision is clear. You make progress fast. Then, around 40% done, reality sets in.</p>

<p>The code gets complex. The scope expands. Progress slows. That initial excitement feels naive now.</p>

<h2>What I've Learned</h2>
<ul>
<li>Ship something small first. Completion builds momentum.</li>
<li>Set concrete milestones. Progress you can see motivates you to continue.</li>
<li>Expect the middle. Know it's coming. Prepare for it mentally.</li>
<li>Find accountability. Tell someone else. Make yourself prove it matters.</li>
</ul>

<h2>The Reality</h2>
<p>Finishing isn't about willpower. It's about systems. It's about removing the friction between you and completion. It's about connecting the project to something you actually care about—not just the idea of the finished project, but the journey of building it.</p>

<p>You don't finish projects because you're disciplined. You finish them because you care about the process, not just the outcome.</p>`,
    image: "https://images.unsplash.com/photo-1516321318423-f06f70504ec0?w=800&h=400&fit=crop",
    category: "Life",
    author: "You",
    date: "2023-12-15",
    readTime: "5 min",
    tags: ["projects", "execution", "discipline"],
    featured: false
  }
];

const categories = [
  {
    name: "Code",
    slug: "code",
    description: "Programming, debugging, and building",
    icon: "💻"
  },
  {
    name: "Books",
    slug: "books",
    description: "Reading and ideas",
    icon: "📚"
  },
  {
    name: "Games",
    slug: "games",
    description: "Gaming and design",
    icon: "🎮"
  },
  {
    name: "Life",
    slug: "life",
    description: "Reflections and growth",
    icon: "🌿"
  }
];

/* Helper functions */
function getPostById(id) {
  return blogPosts.find(post => post.id === id);
}

function getPostBySlug(slug) {
  return blogPosts.find(post => post.slug === slug);
}

function getPostsByCategory(category) {
  return blogPosts.filter(post => post.category.toLowerCase() === category.toLowerCase());
}

function getFeaturedPosts() {
  return blogPosts.filter(post => post.featured).slice(0, 3);
}

function searchPosts(query) {
  const q = query.toLowerCase();
  return blogPosts.filter(post =>
    post.title.toLowerCase().includes(q) ||
    post.excerpt.toLowerCase().includes(q) ||
    post.tags.some(tag => tag.toLowerCase().includes(q))
  );
}

function getRelatedPosts(postId, limit = 3) {
  const post = getPostById(postId);
  if (!post) return [];

  return blogPosts
    .filter(p => p.id !== postId && p.category === post.category)
    .slice(0, limit);
}

function getCategoryStats() {
  const stats = {};
  categories.forEach(cat => {
    stats[cat.name] = getPostsByCategory(cat.name).length;
  });
  return stats;
}

// ============================================
// GLOBAL EXPORT
// ============================================

window.blogData = {
  posts: blogPosts,
  categories: categories,
  getPostsByCategory: getPostsByCategory,
  getCategoryStats: getCategoryStats
};
