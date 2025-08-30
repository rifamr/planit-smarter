import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <section className="min-h-screen pt-28 pb-16 bg-section">
      <div className="max-w-4xl mx-auto px-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm text-primary hover:underline"
          aria-label="Go back"
        >
          ← Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="feature-card-premium"
        >
          <h1 className="text-3xl font-bold mb-2">Travel Blog Post</h1>
          <p className="text-muted-foreground mb-6">Post ID: {id}</p>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              This is placeholder content. Your detailed travel article will appear here once CMS integration is connected.
            </p>
            <ul>
              <li>Hero image</li>
              <li>Sectioned content with tips</li>
              <li>Callouts and galleries</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogPost;
