'use client';

import Link from 'next/link';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppImage } from '@/components/ui/app-image';
import { loginAction } from '../actions/login-action';
import { loginSchema, type LoginInput } from '../schemas/auth-schemas';

// RHF-native flow:
//   1. zodResolver runs the same Zod schema client-side (UX) — invalid input
//      never reaches the server.
//   2. handleSubmit gives us typed data; we await the server action with it.
//   3. On non-ok: write field errors and the form-level error straight into
//      RHF via setError, synchronously. No useEffect / state sync needed.
//   4. RHF tracks isSubmitting natively — no useActionState pending state.
//   5. On success the action calls `redirect('/')` — control never returns to
//      the client, so we don't need a success branch here.

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    const result = await loginAction(data);
    if (result.ok) return; // unreachable — action redirected
    if (result.fieldErrors) {
      for (const [name, messages] of Object.entries(result.fieldErrors)) {
        if (messages?.[0]) {
          setError(name as keyof LoginInput, { message: messages[0] });
        }
      }
    }
    if (result.formError) {
      setError('root.serverError', { type: 'server', message: result.formError });
    }
  };

  const serverError = errors.root?.serverError?.message;

  return (
    <div className="_social_login_content">
      <div className="_social_login_left_logo _mar_b28">
        <AppImage
          src="/assets/images/logo.svg"
          alt=""
          width={148}
          height={40}
          className="_left_logo"
        />
      </div>
      <p className="_social_login_content_para _mar_b8">Welcome back</p>
      <h4 className="_social_login_content_title _titl4 _mar_b50">
        Login to your account
      </h4>
      <button type="button" className="_social_login_content_btn _mar_b40">
        <AppImage
          src="/assets/images/google.svg"
          alt=""
          width={20}
          height={20}
          className="_google_img"
        />
        <span>Or sign-in with google</span>
      </button>
      <div className="_social_login_content_bottom_txt _mar_b40">
        <span>Or</span>
      </div>

      <form className="_social_login_form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {serverError && (
          <div role="alert" style={{ color: '#d32f2f', marginBottom: 12, fontSize: 14 }}>
            {serverError}
          </div>
        )}

        <div className="row">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div className="_social_login_form_input _mar_b14">
              <label className="_social_login_label _mar_b8" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="form-control _social_login_input"
                aria-invalid={!!errors.email}
                {...register('email')}
              />
              {errors.email && (
                <p style={{ color: '#d32f2f', fontSize: 13, marginTop: 4 }}>
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div className="_social_login_form_input _mar_b14">
              <label className="_social_login_label _mar_b8" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="form-control _social_login_input"
                aria-invalid={!!errors.password}
                {...register('password')}
              />
              {errors.password && (
                <p style={{ color: '#d32f2f', fontSize: 13, marginTop: 4 }}>
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
            <div className="form-check _social_login_form_check">
              <input
                className="form-check-input _social_login_form_check_input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault2"
                defaultChecked
              />
              <label
                className="form-check-label _social_login_form_check_label"
                htmlFor="flexRadioDefault2"
              >
                Remember me
              </label>
            </div>
          </div>
          <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
            <div className="_social_login_form_left">
              <p className="_social_login_form_left_para">Forgot password?</p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
            <div className="_social_login_form_btn _mar_t40 _mar_b60">
              <button
                type="submit"
                className="_social_login_form_btn_link _btn1"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in…' : 'Login now'}
              </button>
            </div>
          </div>
        </div>
      </form>

      <div className="row">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="_social_login_bottom_txt">
            <p className="_social_login_bottom_txt_para">
              Don&apos;t have an account?{' '}
              <Link href="/register">Create New Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
