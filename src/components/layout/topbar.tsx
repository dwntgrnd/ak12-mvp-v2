export function Topbar() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-14 bg-sidebar border-b border-white/10 flex items-center justify-between px-6"
    >
      <span className="font-heading text-xl font-semibold text-sidebar-foreground">
        AlchemyK12
      </span>

      <nav className="flex items-center gap-6">
        <a
          href="#"
          className="text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
        >
          About AlchemyK12
        </a>
        <a
          href="#"
          className="text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
        >
          Help / Feedback
        </a>
        <a
          href="#"
          className="text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
        >
          Logout
        </a>
        <div className="w-8 h-8 rounded-full bg-[hsl(var(--warning))] flex items-center justify-center">
          <span className="text-xs font-semibold text-white">DU</span>
        </div>
      </nav>
    </header>
  );
}
