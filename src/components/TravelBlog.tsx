import { useState } from "react";
import { Calendar, Clock, User, ArrowRight, Filter, Search, BookOpen, Compass, Heart, Utensils, Camera } from "lucide-react";

const TravelBlog = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { id: "All", label: "All Posts", icon: BookOpen },
    { id: "Tips", label: "Travel Tips", icon: Compass },
    { id: "Culture", label: "Culture & History", icon: Camera },
    { id: "Food", label: "Food & Dining", icon: Utensils },
    { id: "Sustainable", label: "Eco Travel", icon: Heart }
  ];

  const blogPosts = [
    {
      id: 1,
      title: "The Ultimate Guide to Sustainable Travel in 2024",
      excerpt: "Discover how to explore the world while minimizing your environmental impact. From carbon-neutral flights to eco-friendly accommodations.",
      category: "Sustainable",
      author: "Elena Rodriguez",
      readTime: "8 min read",
      publishDate: "2024-01-15",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop",
      featured: true,
      tags: ["Eco-travel", "Carbon offset", "Green hotels"]
    },
    {
      id: 2,
      title: "10 Essential Packing Tips for Digital Nomads",
      excerpt: "Master the art of minimalist packing with these proven strategies from experienced remote workers who live on the road.",
      category: "Tips",
      author: "Marcus Chen",
      readTime: "5 min read", 
      publishDate: "2024-01-12",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=400&fit=crop",
      featured: false,
      tags: ["Packing", "Digital nomad", "Travel gear"]
    },
    {
      id: 3,
      title: "Hidden Culinary Gems in Southeast Asia",
      excerpt: "Uncover the best street food markets and local eateries that most tourists never discover. A foodie's guide to authentic flavors.",
      category: "Food",
      author: "Sarah Kim",
      readTime: "12 min read",
      publishDate: "2024-01-10",
      image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=400&fit=crop",
      featured: true,
      tags: ["Street food", "Southeast Asia", "Local cuisine"]
    },
    {
      id: 4,
      title: "Cultural Etiquette: Dos and Don'ts in Japan",
      excerpt: "Navigate Japanese customs with confidence. Learn the essential cultural practices that will help you connect with locals respectfully.",
      category: "Culture",
      author: "Hiroshi Tanaka",
      readTime: "7 min read",
      publishDate: "2024-01-08",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=400&fit=crop",
      featured: false,
      tags: ["Japan", "Cultural etiquette", "Respect"]
    },
    {
      id: 5,
      title: "Budget Travel: How to See Europe for Under $50/Day",
      excerpt: "Explore Europe's most beautiful cities without breaking the bank. Insider tips for accommodation, food, and transportation savings.",
      category: "Tips", 
      author: "Anna Kowalski",
      readTime: "10 min read",
      publishDate: "2024-01-05",
      image: "https://images.unsplash.com/photo-1473163928189-364b2c4e1135?w=800&h=400&fit=crop",
      featured: false,
      tags: ["Budget travel", "Europe", "Money saving"]
    },
    {
      id: 6,
      title: "Photography Tips for Capturing Epic Travel Moments",
      excerpt: "Transform your travel photos from snapshots to stunning memories. Professional techniques for capturing landscapes, people, and culture.",
      category: "Tips",
      author: "David Park", 
      readTime: "6 min read",
      publishDate: "2024-01-03",
      image: "https://images.unsplash.com/photo-1502780402662-acc01917fb42?w=800&h=400&fit=crop",
      featured: false,
      tags: ["Photography", "Travel tips", "Instagram"]
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <section className="section-padding bg-section">
      <div className="max-w-7xl mx-auto container-padding">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-responsive-xl font-bold text-foreground mb-6">
            Travel <span className="text-gradient-primary">Insights</span> & Tips
          </h2>
          <p className="text-responsive-md text-muted-foreground max-w-3xl mx-auto">
            Expert advice, cultural insights, and practical tips from experienced travelers 
            and local experts around the world.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles, tips, destinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-card text-muted-foreground hover:bg-primary/10 hover:text-primary'
                }`}
              >
                <category.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{category.label}</span>
                <span className="sm:hidden">{category.id}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Posts */}
        {searchTerm === "" && activeCategory === "All" && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-primary" />
              Featured Articles
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.slice(0, 2).map((post, index) => (
                <article 
                  key={post.id}
                  className="feature-card-premium group cursor-pointer animate-slide-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="relative overflow-hidden rounded-xl mb-6">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-black/30 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {post.author}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {post.readTime}
                        </div>
                      </div>
                      
                      <button className="text-primary font-medium hover:text-accent transition-colors flex items-center gap-1">
                        Read more
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span 
                          key={tagIndex}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* All Posts Grid */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-foreground">
              {activeCategory === "All" ? "Latest Articles" : `${activeCategory} Articles`}
            </h3>
            <span className="text-muted-foreground">
              {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <article 
                key={post.id}
                className="feature-card group cursor-pointer animate-zoom-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden rounded-xl mb-4">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="bg-black/30 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.publishDate)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <span className="text-sm text-muted-foreground">
                      {post.author}
                    </span>
                    <button className="text-primary font-medium hover:text-accent transition-colors text-sm flex items-center gap-1">
                      Read
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          {filteredPosts.length > 6 && (
            <div className="text-center mt-12">
              <button className="btn-outline-hero">
                <Filter className="w-4 h-4 mr-2" />
                Load More Articles
              </button>
            </div>
          )}

          {/* No Results */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No articles found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search terms or browse a different category.
              </p>
              <button 
                onClick={() => {
                  setSearchTerm("");
                  setActiveCategory("All");
                }}
                className="btn-outline-hero"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-20 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-12 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Never Miss a Travel Tip
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get weekly insights, destination guides, and exclusive travel tips 
            delivered straight to your inbox from our community of experts.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            <button className="btn-primary whitespace-nowrap">
              Subscribe
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-4">
            Unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TravelBlog;
