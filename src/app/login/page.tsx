'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        setError('Invalid password');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-page px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-foreground-secondary" />
            <h1 className="text-2xl font-bold tracking-[-0.01em] text-foreground">
              AlchemyK12
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            {error && (
              <p className="text-xs font-medium tracking-[0.025em] text-destructive">
                {error}
              </p>
            )}
            <Button type="submit" disabled={loading || !password}>
              {loading ? 'Verifying...' : 'Enter'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
