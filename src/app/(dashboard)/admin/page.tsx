'use client';

import { useState } from 'react';
import { UsersList } from '@/components/admin/users-list';
import { InviteUserForm } from '@/components/admin/invite-user-form';

export default function AdminPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleInviteSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold font-heading">User Management</h1>
      <p className="text-muted-foreground mt-2">
        Invite new users and manage existing team members.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <InviteUserForm onSuccess={handleInviteSuccess} />
        </div>

        <div className="lg:col-span-2">
          <UsersList key={refreshKey} />
        </div>
      </div>
    </div>
  );
}
