'use client';

import React, { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import styled from 'styled-components';
import { AdminAccount, UserAccount } from "../types";

export default function AdminAccountsPage() {
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH ADMINS ---------------- */
  const fetchAdmins = async () => {
    const { data, error } = await supabaseClient
      .from('admins')
      .select('*');

    if (error) {
      console.error(error);
      return;
    }

    setAdmins(data || []);
  };

  /* ---------------- FETCH USERS ---------------- */
  const fetchUsers = async () => {
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('id, name, surname, email, logo, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setUsers(data || []);
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchAdmins(), fetchUsers()]).finally(() =>
      setLoading(false)
    );
  }, []);

  const handleAdminDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this admin?')) return;

    const { error } = await supabaseClient
      .from('admins')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(error);
      return;
    }

    setAdmins(admins.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-10">
      {/* ---------------- ADMINS ---------------- */}
      <section>
        <h1 className="text-2xl font-bold mb-4">Admin Accounts</h1>

        {loading ? (
          <p>Loading admins...</p>
        ) : (
          <AccountList>
            {admins.map((admin) => (
              <AdminCard key={admin.id}>
                <span>{admin.email}</span>
                <button onClick={() => handleAdminDelete(admin.id)}>
                  Delete
                </button>
              </AdminCard>
            ))}
          </AccountList>
        )}
      </section>

      {/* ---------------- USERS ---------------- */}
      <section>
        <h1 className="text-2xl font-bold mb-4">User Accounts</h1>

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <UserList>
            {users.map((user) => (
              <UserCard key={user.id}>
                <div className="left">
                  <div className="avatar">
                    {user.logo ? (
                      <img src={user.logo} alt="avatar" />
                    ) : (
                      <span>
                        {user.name?.[0]?.toUpperCase() ?? '?'}
                      </span>
                    )}
                  </div>

                  <div className="info">
                    <strong>
                      {user.name} {user.surname}
                    </strong>
                    <small>{user.email}</small>
                    <small>
                      Joined{" "}
                      {new Date(user.created_at).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              </UserCard>
            ))}
          </UserList>
        )}
      </section>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const AccountList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const AdminCard = styled.div`
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    background: #ff4d4d;
    color: #fff;
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-weight: 500;
  }
`;

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const UserCard = styled.div`
  background: #ffffff;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);

  .left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
    background: #facc15;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar span {
    font-weight: 700;
    color: white;
    font-size: 18px;
  }

  .info {
    display: flex;
    flex-direction: column;
  }

  .info strong {
    font-size: 15px;
  }

  .info small {
    font-size: 13px;
    color: #666;
  }
`;
