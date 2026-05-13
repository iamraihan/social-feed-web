'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Avatar } from '@/components/ui/avatar';
import { logoutAction } from '@/features/auth';
import type { SessionUser } from '@/features/auth';

// Profile area of the header. The dropdown (View Profile / Settings /
// Logout) needs onClick state, so this slice is the only Client Component
// in the otherwise Server-rendered header. Logout submits the server action
// directly via <form action={…}> — no client-side fetch required.

interface HeaderProfileProps {
  user: SessionUser;
}

export function HeaderProfile({ user }: HeaderProfileProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="_header_nav_profile">
      <div className="_header_nav_profile_image">
        <Avatar
          src={user.avatarKey}
          alt=""
          size={40}
          className="_nav_profile_img"
        />
      </div>
      <div className="_header_nav_dropdown">
        <p className="_header_nav_para">
          {user.firstName} {user.lastName}
        </p>
        <button
          type="button"
          className="_header_nav_dropdown_btn _dropdown_toggle"
          aria-label="Profile menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="6"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              fill="#112032"
              d="M5 5l.354.354L5 5.707l-.354-.353L5 5zm4.354-3.646l-4 4-.708-.708 4-4 .708.708zm-4.708 4l-4-4 .708-.708 4 4-.708.708z"
            />
          </svg>
        </button>
      </div>

      {open && (
        <div
          className="_nav_profile_dropdown _profile_dropdown"
          style={{ display: 'block' }}
        >
          <div className="_nav_profile_dropdown_info">
            <div className="_nav_profile_dropdown_image">
              <Avatar
                src={user.avatarKey}
                alt=""
                size={48}
                className="_nav_drop_img"
              />
            </div>
            <div className="_nav_profile_dropdown_info_txt">
              <h4 className="_nav_dropdown_title">
                {user.firstName} {user.lastName}
              </h4>
              <Link href="#0" className="_nav_drop_profile">
                View Profile
              </Link>
            </div>
          </div>
          <hr />
          <ul className="_nav_dropdown_list">
            <li className="_nav_dropdown_list_item">
              <Link href="#0" className="_nav_dropdown_link">
                <div className="_nav_drop_info">Settings</div>
              </Link>
            </li>
            <li className="_nav_dropdown_list_item">
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="_nav_dropdown_link"
                  style={{
                    background: 'none',
                    border: 'none',
                    width: '100%',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <div className="_nav_drop_info">Log Out</div>
                </button>
              </form>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
