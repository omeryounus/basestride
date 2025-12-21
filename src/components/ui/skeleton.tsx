export function LeaderboardSkeleton() {
    return (
        <div className="space-y-3 animate-pulse">
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-xl bg-card/50"
                >
                    {/* Rank */}
                    <div className="w-8 h-8 bg-muted rounded-full" />

                    {/* Avatar */}
                    <div className="w-10 h-10 bg-muted rounded-full" />

                    {/* Name and steps */}
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-24" />
                        <div className="h-3 bg-muted rounded w-16" />
                    </div>

                    {/* Steps count */}
                    <div className="h-6 bg-muted rounded w-20" />
                </div>
            ))}
        </div>
    );
}
