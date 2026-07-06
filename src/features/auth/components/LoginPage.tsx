// src/pages/auth/LoginPage.tsx
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import Logo from "../../../assets/Logo.png";
import { Google } from 'iconsax-react';


export const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { mutate, isPending } = useLogin();

  const onSubmit = (data: any) => {
    mutate(data);
  };

  const handleGoogleLogin = () => {
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo Section */}
        <div className="flex flex-col items-center text-center">
          <img src={Logo} alt="" className='w-24'/>
          <h1 className="text-3xl font-bold text-slate-900">Log in to your account</h1>
          <p className="text-slate-500 mt-2">Welcome back! Please enter your login details.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input 
            label="Email" 
            type="email"
            placeholder="Enter your email"
            error={errors.email?.message as string}
            {...register("email", { required: "Email is required" })}
          />

          <Input 
            label="Password" 
            type="password"
            placeholder="••••••••"
            error={errors.password?.message as string}
            {...register("password", { required: "Password is required" })}
          />

          <div className="flex items-center justify-between py-1">
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              Remember for 30 days
            </label>
            <Link to="/forgot-password" className="text-sm font-bold text-blue-600 hover:text-blue-700">
              Forgot password
            </Link>
          </div>

          <Button type="submit" isLoading={isPending}>
            Login
          </Button>
          <Button 
              type="button" 
              variant="outline" 
              disabled={isPending} 
              onClick={handleGoogleLogin}
              className="w-full"
            >
              <Google size="20" color="#4285F4" variant="Bold" />
              Log in with Google
            </Button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 font-bold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};