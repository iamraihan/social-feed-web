import { AppImage } from '@/components/ui/app-image';
import { RegisterForm } from '@/features/auth';

// Outer markup mirrors registration.html — three decorative shape blocks
// stacked (light + dark SVG), col-8 left image (with registration.png +
// registration1.png variant), col-4 form area.

export default function RegisterPage() {
  return (
    <section className="_social_registration_wrapper _layout_main_wrapper">
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

      <div className="_social_registration_wrap">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
              <div className="_social_registration_right">
                <div className="_social_registration_right_image">
                  <AppImage
                    src="/assets/images/registration.png"
                    alt=""
                    width={700}
                    height={500}
                    unoptimized
                  />
                </div>
                <div className="_social_registration_right_image_dark">
                  <AppImage
                    src="/assets/images/registration1.png"
                    alt=""
                    width={700}
                    height={500}
                    unoptimized
                  />
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <RegisterForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
