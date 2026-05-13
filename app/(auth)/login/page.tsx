import { AppImage } from '@/components/ui/app-image';
import { LoginForm } from '@/features/auth';

// Outer markup mirrors login.html — the three decorative shape blocks (each
// stacks a light + dark SVG), the col-8 left image, and the col-4 form area.

export default function LoginPage() {
  return (
    <section className="_social_login_wrapper _layout_main_wrapper">
      <div className="_shape_one">
        <AppImage
          src="/assets/images/shape1.svg"
          alt=""
          width={120}
          height={120}
          className="_shape_img"
          unoptimized
        />
        <AppImage
          src="/assets/images/dark_shape.svg"
          alt=""
          width={120}
          height={120}
          className="_dark_shape"
          unoptimized
        />
      </div>
      <div className="_shape_two">
        <AppImage
          src="/assets/images/shape2.svg"
          alt=""
          width={120}
          height={120}
          className="_shape_img"
          unoptimized
        />
        <AppImage
          src="/assets/images/dark_shape1.svg"
          alt=""
          width={120}
          height={120}
          className="_dark_shape _dark_shape_opacity"
          unoptimized
        />
      </div>
      <div className="_shape_three">
        <AppImage
          src="/assets/images/shape3.svg"
          alt=""
          width={120}
          height={120}
          className="_shape_img"
          unoptimized
        />
        <AppImage
          src="/assets/images/dark_shape2.svg"
          alt=""
          width={120}
          height={120}
          className="_dark_shape _dark_shape_opacity"
          unoptimized
        />
      </div>

      <div className="_social_login_wrap">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
              <div className="_social_login_left">
                <div className="_social_login_left_image">
                  <AppImage
                    src="/assets/images/login.png"
                    alt=""
                    width={700}
                    height={500}
                    className="_left_img"
                    unoptimized
                  />
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
