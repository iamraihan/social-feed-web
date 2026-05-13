'use client';

import Link from 'next/link';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppImage } from '@/components/ui/app-image';
import { registerAction } from '../actions/register-action';
import { registerSchema, type RegisterInput } from '../schemas/auth-schemas';

// firstName / lastName are added on top of the static design — the backend
// requires them. The rest of the form (Google button, Or divider, terms
// checkbox, "Login now" button label which is a typo in the source HTML)
// matches the design verbatim.

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<RegisterInput> = async (data) => {
    const result = await registerAction(data);
    if (result.ok) return;
    if (result.fieldErrors) {
      for (const [name, messages] of Object.entries(result.fieldErrors)) {
        if (messages?.[0]) {
          setError(name as keyof RegisterInput, { message: messages[0] });
        }
      }
    }
    if (result.formError) {
      setError('root.serverError', { type: 'server', message: result.formError });
    }
  };

  const serverError = errors.root?.serverError?.message;

  return (
    <div className="_social_registration_content">
      <div className="_social_registration_right_logo _mar_b28">
        <AppImage
          src="/assets/images/logo.svg"
          alt=""
          width={148}
          height={40}
          className="_right_logo"
        />
      </div>
      <p className="_social_registration_content_para _mar_b8">Get Started Now</p>
      <h4 className="_social_registration_content_title _titl4 _mar_b50">
        Registration
      </h4>
      <button type="button" className="_social_registration_content_btn _mar_b40">
        <AppImage
          src="/assets/images/google.svg"
          alt=""
          width={20}
          height={20}
          className="_google_img"
        />
        <span>Register with google</span>
      </button>
      <div className="_social_registration_content_bottom_txt _mar_b40">
        <span>Or</span>
      </div>

      <form
        className="_social_registration_form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {serverError && (
          <div role="alert" style={{ color: '#d32f2f', marginBottom: 12, fontSize: 14 }}>
            {serverError}
          </div>
        )}

        <div className="row">
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <div className="_social_registration_form_input _mar_b14">
              <label className="_social_registration_label _mar_b8" htmlFor="firstName">
                First name
              </label>
              <input
                id="firstName"
                type="text"
                autoComplete="given-name"
                className="form-control _social_registration_input"
                aria-invalid={!!errors.firstName}
                {...register('firstName')}
              />
              {errors.firstName && (
                <p style={{ color: '#d32f2f', fontSize: 13, marginTop: 4 }}>
                  {errors.firstName.message}
                </p>
              )}
            </div>
          </div>
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <div className="_social_registration_form_input _mar_b14">
              <label className="_social_registration_label _mar_b8" htmlFor="lastName">
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                autoComplete="family-name"
                className="form-control _social_registration_input"
                aria-invalid={!!errors.lastName}
                {...register('lastName')}
              />
              {errors.lastName && (
                <p style={{ color: '#d32f2f', fontSize: 13, marginTop: 4 }}>
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div className="_social_registration_form_input _mar_b14">
              <label className="_social_registration_label _mar_b8" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="form-control _social_registration_input"
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
            <div className="_social_registration_form_input _mar_b14">
              <label className="_social_registration_label _mar_b8" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                className="form-control _social_registration_input"
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
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div className="_social_registration_form_input _mar_b14">
              <label
                className="_social_registration_label _mar_b8"
                htmlFor="confirmPassword"
              >
                Repeat Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                className="form-control _social_registration_input"
                aria-invalid={!!errors.confirmPassword}
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p style={{ color: '#d32f2f', fontSize: 13, marginTop: 4 }}>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
            <div className="form-check _social_registration_form_check">
              <input
                className="form-check-input _social_registration_form_check_input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault2"
                defaultChecked
              />
              <label
                className="form-check-label _social_registration_form_check_label"
                htmlFor="flexRadioDefault2"
              >
                I agree to terms &amp; conditions
              </label>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
            <div className="_social_registration_form_btn _mar_t40 _mar_b60">
              <button
                type="submit"
                className="_social_registration_form_btn_link _btn1"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating account…' : 'Login now'}
              </button>
            </div>
          </div>
        </div>
      </form>

      <div className="row">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="_social_registration_bottom_txt">
            <p className="_social_registration_bottom_txt_para">
              Already have an account? <Link href="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
