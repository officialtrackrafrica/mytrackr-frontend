import { useForm, Controller } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Google } from 'iconsax-react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Dropdown } from '../../../components/ui/Dropdown';
import { AuthLayout } from '../../../components/layout/AuthLayout';
import Logo from "../../../assets/Logo.png";
import { useSignUp } from '../hooks/useSignUp';
import { useBusinessTypes } from '../../../hooks/useBusiness';

export const SignUpForm = () => {
  const { register, handleSubmit, control, formState: { errors } } = useForm();
  const { data: businessTypes, isLoading: loadingTypes } = useBusinessTypes();
  const { mutate: signUp, isPending: isSigningUp } = useSignUp();

  const onSubmit = (data: any) => {
    signUp(data); 
  };

  const handleGoogleSignup = () => {
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    
    // Redirects the browser to your backend, kicking off the OAuth flow
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  return (
    <AuthLayout currentStep={1}>
      <div className="flex flex-col items-center justify-center w-fit mx-auto">
        
        <div className="flex flex-col items-center text-center mb-8">
          <img src={Logo} alt="MyTrackr Logo" className="w-24 mb-4" />
          <h2 className="text-2xl font-bold text-slate-800">Sign up</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First name*" placeholder="John" error={errors.firstName?.message as string} {...register("firstName", { required: "Required" })} />
            <Input label="Last name*" placeholder="Doe" error={errors.lastName?.message as string} {...register("lastName", { required: "Required" })} />
          </div>

          <Input label="Business name*" placeholder="Enter your business name" error={errors.businessName?.message as string} {...register("businessName", { required: "Required" })} />

          {/* Dynamic Business Type Dropdown via Controller */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Business type*</label>
            <Controller
              name="businessType"
              control={control}
              rules={{ required: "Required" }}
              render={({ field: { onChange, value } }) => (
                <Dropdown 
                  options={businessTypes || []} 
                  value={value || ""} 
                  onChange={onChange} 
                  disabled={loadingTypes || isSigningUp} 
                  placeholder="Select a business type..." 
                />
              )}
            />
            {errors.businessType && <p className="text-red-500 text-xs mt-1">{errors.businessType.message as string}</p>}
          </div>

          <Input label="Email*" type="email" placeholder="Enter your email" error={errors.email?.message as string} {...register("email", { required: "Required" })} />
          <Input label="Password*" type="password" placeholder="Create a password" error={errors.password?.message as string} {...register("password", { required: "Required", minLength: { value: 8, message: "Must be at least 8 characters" } })} />

<div className="flex items-start gap-3 mt-4">
            <input 
              type="checkbox" 
              id="terms"
              className="mt-1 w-4 h-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue cursor-pointer"
              {...register("acceptTermsAndConditions", { required: true })}
            />
            <label htmlFor="terms" className="text-sm text-slate-700 leading-relaxed cursor-pointer">
              I have read and agreed to the{' '}
              <a href='https://mytrackrservices.com/privacy' target='blank' className="font-bold text-slate-900 hover:underline">privacy notice</a>, and{' '}
              <a href='https://mytrackrservices.com/privacy' target='blank' className="font-bold text-slate-900 hover:underline">cookie policy</a>.
            </label>
          </div>
          <div className="pt-2 space-y-3">
            <Button type="submit" isLoading={isSigningUp}>Get Started</Button>
            <Button type="button" variant="outline" disabled={isSigningUp} onClick={handleGoogleSignup}>
              <Google size="20" color="#4285F4" variant="Bold" />
              Sign up with Google
            </Button>
          </div>
        </form>

        <p className="mt-6 text-sm text-slate-500">
          Already have an account? <Link to="/login" className="text-brand-blue font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </AuthLayout>
  );
};