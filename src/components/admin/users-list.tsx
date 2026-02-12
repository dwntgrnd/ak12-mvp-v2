'use client';

import { useState, useEffect } from 'react';
import type { TenantUser } from '@/services/types/user';

interface UsersListProps {
  onRefresh?: () => void;
}

export function UsersList({ onRefresh }: UsersListProps) {
  const [users, setUsers] = useState<TenantUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/users');

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeactivate = async (user: TenantUser) => {
    const confirmed = window.confirm(
      `Deactivate ${user.displayName}? They will lose access to the platform.`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/users/${user.userId}/deactivate`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to deactivate user');
      }

      const updatedUser = await response.json();
      setUsers((prev) =>
        prev.map((u) => (u.userId === updatedUser.userId ? updatedUser : u))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to deactivate user');
    }
  };

  const handleReactivate = async (user: TenantUser) => {
    try {
      const response = await fetch(`/api/users/${user.userId}/reactivate`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reactivate user');
      }

      const updatedUser = await response.json();
      setUsers((prev) =>
        prev.map((u) => (u.userId === updatedUser.userId ? updatedUser : u))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to reactivate user');
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'publisher-admin':
        return 'Admin';
      case 'publisher-rep':
        return 'Rep';
      default:
        return role;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Active
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case 'deactivated':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Deactivated
          </span>
        );
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <p className="text-muted-foreground">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <p className="text-muted-foreground">No users found</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Role
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userId} className="border-b last:border-0">
                <td className="px-4 py-3 text-sm">{user.displayName}</td>
                <td className="px-4 py-3 text-sm">{user.email}</td>
                <td className="px-4 py-3 text-sm">{getRoleName(user.userRole)}</td>
                <td className="px-4 py-3 text-sm">{getStatusBadge(user.status)}</td>
                <td className="px-4 py-3 text-sm">
                  {user.status === 'active' && (
                    <button
                      onClick={() => handleDeactivate(user)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Deactivate
                    </button>
                  )}
                  {user.status === 'deactivated' && (
                    <button
                      onClick={() => handleReactivate(user)}
                      className="text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      Reactivate
                    </button>
                  )}
                  {user.status === 'pending' && (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
