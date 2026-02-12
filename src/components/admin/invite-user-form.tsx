'use client';

import { useState } from 'react';

interface InviteUserFormProps {
  onSuccess: () => void;
}

export function InviteUserForm({ onSuccess }: InviteUserFormProps) {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'publisher-rep' | 'publisher-admin'>('publisher-rep');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/users/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, displayName, role }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        if (response.status === 409) {
          throw new Error('A user with this email already exists');
        }

        throw new Error(errorData.error || 'Failed to invite user');
      }

      // Success - clear form and notify parent
      setEmail('');
      setDisplayName('');
      setRole('publisher-rep');
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to invite user');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-lg font-semibold font-heading mb-4">Invite User</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="user@example.com"
          />
        </div>

        <div>
          <label htmlFor="displayName" className="block text-sm font-medium mb-1">
            Display Name
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="John Smith"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium mb-1">
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as 'publisher-rep' | 'publisher-admin')}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="publisher-rep">Sales Rep</option>
            <option value="publisher-admin">Admin</option>
          </select>
        </div>

        {error && (
          <div className="p-3 rounded-md bg-red-50 text-red-800 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Inviting...' : 'Send Invite'}
        </button>
      </form>
    </div>
  );
}
