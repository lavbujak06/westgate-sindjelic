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
          {profile?.logo ? (
            <img src={profile.logo} alt="User avatar" />
          ) : profile?.name ? (
            <div className="user-avatar-initial">
              {profile.name[0].toUpperCase()}
            </div>
          ) : (
            <svg viewBox="0 0 24 24" fill="white" width={18} height={18}>
              <path d="M12 2c2.757 0 5 2.243 5 5.001..." />
            </svg>
          )}
        </div>
      </div>

      <nav className="popup-window">
        <legend>Account:</legend>
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
