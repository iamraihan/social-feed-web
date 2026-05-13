import Link from 'next/link';
import { AppImage } from '@/components/ui/app-image';

// Faithful port of registration.html's `_social_registration_content` block.

export function RegisterForm() {
  return (
    <div className="_social_registration_content">
      <div className="_social_registration_right_logo _mar_b28">
        <AppImage
          src="/assets/images/logo.svg"
          alt=""
          width={148}
          height={40}
          className="_right_logo"
          unoptimized
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
          unoptimized
        />
        <span>Register with google</span>
      </button>
      <div className="_social_registration_content_bottom_txt _mar_b40">
        <span>Or</span>
      </div>

      <form className="_social_registration_form">
        <div className="row">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div className="_social_registration_form_input _mar_b14">
              <label className="_social_registration_label _mar_b8">Email</label>
              <input type="email" className="form-control _social_registration_input" />
            </div>
          </div>
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div className="_social_registration_form_input _mar_b14">
              <label className="_social_registration_label _mar_b8">Password</label>
              <input type="password" className="form-control _social_registration_input" />
            </div>
          </div>
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div className="_social_registration_form_input _mar_b14">
              <label className="_social_registration_label _mar_b8">
                Repeat Password
              </label>
              <input type="password" className="form-control _social_registration_input" />
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
              <button type="button" className="_social_registration_form_btn_link _btn1">
                Login now
              </button>
            </div>
          </div>
        </div>
      </form>

      <div className="row">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="_social_registration_bottom_txt">
            <p className="_social_registration_bottom_txt_para">
              Don&apos;t have an account?{' '}
              <Link href="/login">Create New Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
