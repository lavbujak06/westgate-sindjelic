'use client';

import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import '@/app/globals.css';
import { useRouter } from 'next/navigation';

const AccountMenu = () => {
  const router = useRouter();
  const { user, profile, setUser, setProfile } = useUser();

  const handleSignOut = async () => {
    try {
      await fetch('http://localhost:5001/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      // Clear frontend state
      setUser(null);
      setProfile(null);

      router.push('/login');
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

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
            <div className="user-avatar-initial">{profile.name[0].toUpperCase()}</div>
          ) : (
            <svg viewBox="0 0 24 24" fill="white" width={18} height={18}>
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
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
              {profile?.is_admin && (
                <li>
                  <Link href="/admin/dashboard">
                    <button>Admin Dashboard</button>
                  </Link>
                </li>
              )}

              {!profile?.is_admin && (
                <li>
                  <Link href="/account">
                    <button>Account Settings</button>
                  </Link>
                </li>
              )}

              <li>
                <button onClick={handleSignOut}>Sign Out</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </label>
  );
};

export default AccountMenu;
