'use client';

import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { supabaseClient } from '@/lib/supabaseClient';
import '@/app/globals.css';

const AccountMenu = () => {
  const { user, profile } = useUser();

  const logo = profile?.logo
    ? profile.logo
    : profile?.name
    ? profile.name[0].toUpperCase()
    : null;

  return (
    <label className="popup">
      <input type="checkbox" />
      <div tabIndex={0} className="burger">
        <div className="user-avatar">
          {logo ? (
            typeof logo === 'string' && logo.startsWith('http') ? (
              <img src={logo} alt="Profile avatar" />
            ) : (
              <div className="user-avatar-initial">{logo}</div>
            )
          ) : (
            <svg viewBox="0 0 24 24" fill="white" width={20} height={20}>
              <path d="M12 2c2.757 0 5 2.243 5 5.001 0 2.756-2.243 5-5 5s-5-2.244-5-5c0-2.758 2.243-5.001 5-5.001zm0-2c-3.866 0-7 3.134-7 7.001 0 3.865 3.134 7 7 7s7-3.135 7-7c0-3.867-3.134-7.001-7-7.001zm6.369 13.353c-.497.498-1.057.931-1.658 1.302 2.872 1.874 4.378 5.083 4.972 7.346h-19.387c.572-2.29 2.058-5.503 4.973-7.358-.603-.374-1.162-.811-1.658-1.312-4.258 3.072-5.611 8.506-5.611 10.669h24c0-2.142-1.44-7.557-5.631-10.647z" />
            </svg>
          )}
        </div>
      </div>

      <nav className="popup-window">
        <legend>Account</legend>
        {profile ? (
          <div className="account-info">
            <p>{profile.name ? `${profile.name} ${profile.surname || ''}` : user?.email}</p>
            <p>Member since: {new Date(profile.created_at).toLocaleDateString()}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}

        <ul>
          {!user && (
            <>
              <li>
                <Link href="/login">
                  <button>Log In</button>
                </Link>
              </li>
              <li>
                <Link href="/signup">
                  <button>Sign Up</button>
                </Link>
              </li>
            </>
          )}
          {user && (
            <>
              <li>
                <Link href="/account">
                  <button>Account Settings</button>
                </Link>
              </li>
              <li>
                <button
                  onClick={async () => {
                    await supabaseClient.auth.signOut();
                    window.location.reload(); // reset state
                  }}
                >
                  Sign Out
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </label>
  );
};

export default AccountMenu;
