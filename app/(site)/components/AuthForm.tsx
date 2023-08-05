'use client';
import axios from 'axios';
import { useCallback, useState } from 'react';

import { 
  FieldValues,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { BsGithub, BsGoogle } from 'react-icons/bs';

import Input from "@/app/components/inputs/Input";
import Button from "@/app/components/Button";
import AuthSocialButton from "./AuthSocialButton";
import { toast } from 'react-hot-toast';
import { signIn } from 'next-auth/react';

type Variant = 'login' | 'register';

const AuthForm = () => {
  const [variant, setVariant] = useState<Variant>("login");
  const [isLoading, setIsLoading] = useState(false);


  const toggleVariant = useCallback(() => {
    if (variant === "login") {
      setVariant("register");
    } else {
      setVariant("login");
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    if (variant === "login") {
      signIn('credentials', {...data, redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error(callback.error);
        }
        if (callback?.ok && !callback?.error) {
          toast.success('Login successful');
        }
      })
      .finally(() => setIsLoading(false));
    }

    if (variant === "register") {
      axios.post('/api/register', data)
          .catch(() => toast.error('Failed to register'))
          .finally(() => setIsLoading(false));
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);
  }

  return (
    <div
      className="
        mt-8
        sm:mx-auto
        sm:w-full
        sm:max-w-md
      "
    >
      <div
        className="
          px-4
          py-8
          bg-white
          shadow
          sm:rounded-lg
          sm:px-10
        "
      >
        <form
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          {variant === "register" && (
            <Input 
              id="name"
              label='Name'
              register={register}
              errors={errors}
              disabled={isLoading}
              />
          )}
            <Input 
              id="email"
              label='Email address'
              type='email'
              register={register}
              errors={errors}
              disabled={isLoading}
              />
            <Input 
              id="password"
              label='password'
              type='password'
              register={register}
              errors={errors}
              disabled={isLoading}
              />
            <div>
              <Button
                disabled={isLoading}
                fullWidth
                type="submit"
              >
                {variant === "login" ? "Sign in" : "Register"}
              </Button>
            </div>
        </form>
        <div className='mt-6'>
          <div className='relative'>
            <div
              className='
                absolute
                inset-0
                flex
                items-center
              '
            >
              <div className='
                w-full
                border-t
                border-gray-300
              '/>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='bg-white px-2 text-gray-500'>
                Or continue with
              </span>
            </div>
          </div>
          
          <div className='mt-6 flex gap-2'>
            <AuthSocialButton 
              icon={BsGithub}
              onClick={() => socialAction('github')}
            />
            <AuthSocialButton 
              icon={BsGoogle}
              onClick={() => socialAction('google')}
            />
          </div>

          <div className='
            flex
            gap-2
            justify-center
            text-sm
            mt-6
            px-2
            text-gray-500
          '>
            <div>
              {variant === "login" ? "New to messenger" : "Already have an account" }
            </div>
            <div
              onClick={toggleVariant}
              className='
                cursor-pointer
                underline
              '
            >
              {variant === "login" ? "Create an account" : "Sign in" }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



export default AuthForm;