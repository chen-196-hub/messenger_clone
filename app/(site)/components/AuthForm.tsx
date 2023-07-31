'use client';
import { useCallback, useState } from 'react';
import { 
  FieldValues,
  SubmitHandler,
  useForm,
} from 'react-hook-form';

type Variant = 'login' | 'register';

const AuthForm = () => {
  const [variant, setVariant] = useState<Variant>("login");
  const [isLogin, setIsLogin] = useState<boolean>(false);


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
    setIsLogin(true);

    if (variant === "login") {
      // ログイン処理
    }

    if (variant === "register") {
      // 登録処理
    }
  };

  const socialAction = (action: string) => {
    setIsLogin(true);
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
        ></form>
      </div>

    </div>
  );
}



export default AuthForm;