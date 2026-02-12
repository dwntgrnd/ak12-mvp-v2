export default async function DistrictProfilePage({
  params,
}: {
  params: Promise<{ districtId: string }>;
}) {
  const { districtId } = await params;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold font-heading">District Profile</h1>
      <p className="text-muted-foreground mt-2">
        Detailed district information with demographics, proficiency, and
        funding data.
      </p>
      <p className="text-sm text-muted-foreground mt-4">
        District ID: {districtId}
      </p>
    </div>
  );
}
