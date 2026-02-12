export default async function PlaybookDetailPage({
  params,
}: {
  params: Promise<{ playbookId: string }>;
}) {
  const { playbookId } = await params;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold font-heading">Playbook Detail</h1>
      <p className="text-muted-foreground mt-2">
        View and edit your district playbook.
      </p>
      <p className="text-sm text-muted-foreground mt-4">
        Playbook ID: {playbookId}
      </p>
    </div>
  );
}
