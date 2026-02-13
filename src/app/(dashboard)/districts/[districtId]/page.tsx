export default function DistrictProfilePage({ params }: { params: { districtId: string } }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">District Profile</h1>
      <p className="text-muted-foreground mt-2">Viewing district {params.districtId}.</p>
    </div>
  );
}
