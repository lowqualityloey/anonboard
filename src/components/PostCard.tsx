interface PostCardProps {
  post: {
    id: string;
    body: string;
    anonName: string;
    createdAt: Date | string;
  };
  index: number;
}

export function PostCard({ post, index }: PostCardProps) {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(post.createdAt));

  return (
    <div
      id={`post-${post.id}`}
      className="rounded-lg border border-border bg-surface p-4 transition-colors duration-fast hover:border-border-hover"
    >
      <div className="mb-2 flex items-center justify-between text-xs text-text-muted">
        <div className="flex items-center space-x-2">
          <span className="font-mono text-text-muted/60">#{index + 1}</span>
          <span className="font-semibold text-accent">{post.anonName}</span>
        </div>
        <time dateTime={new Date(post.createdAt).toISOString()}>{formattedDate}</time>
      </div>

      <p className="whitespace-pre-wrap text-sm text-text leading-relaxed">
        {post.body}
      </p>
    </div>
  );
}
