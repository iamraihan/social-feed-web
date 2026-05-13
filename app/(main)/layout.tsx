import { Header } from '@/components/layout/header';

// Outer wrappers mirror feed.html's _layout > _main_layout > nav + container
// structure so the CSS in main.css (which assumes those ancestors) applies.

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="_layout _layout_main_wrapper">
      <div className="_main_layout">
        <Header />
        {children}
      </div>
    </div>
  );
}
