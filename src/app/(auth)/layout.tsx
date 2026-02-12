export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-semibold text-foreground">
          AlchemyK12
        </h1>
      </div>
      {children}
    </div>
  );
}
