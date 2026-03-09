'use client';

import { useState } from 'react';
import { createSessionAction, createUserProfileAction } from '@/app/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { UserPlus, Loader2, KeyRound } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [formState, setFormState] = useState({ name: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const supabase = createClient();

  async function handleRegisterSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;
    setFormState({ name, email, password });

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (error) {
        throw error;
      }

      // If email confirmations are disabled in Supabase, we immediately get a session back!
      if (data.session && data.user) {
        await createUserProfileAction(data.user.id, name, email);
        await createSessionAction();
        window.location.href = '/dashboard';
        return;
      }

      setStep('verify');
      setLoading(false);
    } catch (err: any) {
      console.error('Error during registration:', JSON.stringify(err, null, 2));
      if (err.code === 'over_email_send_rate_limit') {
        setError('Too many requests. Please wait a while before trying again.');
      } else {
        setError(
          err.message || 'An unexpected error occurred. Please try again.'
        );
      }
      setLoading(false);
    }
  }

  async function handleVerifySubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: formState.email,
        token: otp,
        type: 'signup',
      });

      if (error) {
        throw error;
      }

      if (data.session && data.user) {
        await createUserProfileAction(
          data.user.id,
          formState.name,
          formState.email
        );
        await createSessionAction();
        window.location.href = '/dashboard';
      } else {
        setError('Verification failed. Please try again.');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Error during verification:', JSON.stringify(err, null, 2));
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  }

  if (step === 'verify') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2 text-center">
            <Link
              href="/"
              className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black text-2xl mx-auto mb-4 shadow-lg shadow-primary/20"
            >
              P
            </Link>
            <CardTitle className="text-3xl font-black">Check your email</CardTitle>
            <CardDescription>
              We&apos;ve sent an 8-digit code to {formState.email}.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleVerifySubmit}>
            <CardContent className="space-y-4 pt-4">
              {error && (
                <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg font-medium border border-destructive/20 text-center">
                  {error}
                </div>
              )}
              <div className="space-y-2 flex flex-col items-center">
                <Label htmlFor="token">Verification Code</Label>
                <InputOTP maxLength={8} value={otp} onChange={(value) => setOtp(value)}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                    <InputOTPSlot index={6} />
                    <InputOTPSlot index={7} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-4 pb-8">
              <Button
                type="submit"
                className="w-full h-12 text-lg font-bold gap-2 shadow-lg shadow-primary/20"
                disabled={loading || otp.length < 8}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <KeyRound className="h-5 w-5" />
                )}
                Verify
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Didn&apos;t get a code?{' '}
                <button
                  type="button"
                  onClick={() => setStep('register')}
                  className="text-primary font-bold hover:underline transition-colors"
                >
                  Go back and try again
                </button>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <Link
            href="/"
            className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black text-2xl mx-auto mb-4 shadow-lg shadow-primary/20"
          >
            P
          </Link>
          <CardTitle className="text-3xl font-black">Join the Stream</CardTitle>
          <CardDescription>
            Create your account and start sharing today
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleRegisterSubmit}>
          <CardContent className="space-y-4 pt-4">
            {error && (
              <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg font-medium border border-destructive/20 text-center">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
                disabled={loading}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                disabled={loading}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                disabled={loading}
                className="h-12"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-4 pb-8">
            <Button
              type="submit"
              className="w-full h-12 text-lg font-bold gap-2 shadow-lg shadow-primary/20"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <UserPlus className="h-5 w-5" />
              )}
              Create Account
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-primary font-bold hover:underline transition-colors"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
