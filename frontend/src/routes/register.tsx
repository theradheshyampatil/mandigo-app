import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const Route = createFileRoute('/register')({
  component: RegisterPage,
});

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState<'BUYER' | 'SELLER'>('BUYER');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apiBase = import.meta.env.VITE_API_URL?.replace(/\/api\/v\d+$/, "") ?? "";
      const res = await fetch(`${apiBase}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role, companyName }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to register');
      }

      login(data.token, data.user);
      navigate({ to: '/' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm">
          <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">Create an account</h1>
          <p className="text-sm text-muted-foreground mt-1 mb-6">Join MandiGo to buy or sell fresh fruit</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="flex gap-4 mb-4">
              <div 
                className={`flex-1 border rounded-lg p-3 text-center cursor-pointer transition-colors ${role === 'BUYER' ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-accent'}`}
                onClick={() => setRole('BUYER')}
              >
                <div className="font-semibold text-sm">Buyer</div>
                <div className="text-xs opacity-70 mt-1">I want to buy fruit</div>
              </div>
              <div 
                className={`flex-1 border rounded-lg p-3 text-center cursor-pointer transition-colors ${role === 'SELLER' ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-accent'}`}
                onClick={() => setRole('SELLER')}
              >
                <div className="font-semibold text-sm">Seller</div>
                <div className="text-xs opacity-70 mt-1">I want to sell fruit</div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
              />
            </div>
            
            {role === 'SELLER' && (
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name / Farm Name (Optional)</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Doe Farms"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Min 8 characters"
              />
            </div>

            {error && (
              <div className="text-sm text-destructive font-medium bg-destructive/10 p-2 rounded">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
