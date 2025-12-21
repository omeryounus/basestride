import { ShoppingBag } from "lucide-react";

export function MarketPlaceholder() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-secondary/20 to-green-400/20 flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 rounded-full blur-xl bg-green-500/10" />
                <ShoppingBag className="w-10 h-10 text-green-400" />
            </div>

            <h2 className="text-2xl font-black italic tracking-wide mb-2 text-center">MARKETPLACE</h2>
            <p className="text-muted-foreground text-center text-sm max-w-[200px]">
                Spend your hard-earned $STRIDE on upgrades and digital assets.
            </p>

            <div className="mt-8 px-4 py-2 bg-secondary/10 rounded-full border border-secondary/20">
                <span className="text-xs font-bold text-secondary tracking-widest uppercase">Coming Soon</span>
            </div>
        </div>
    );
}
