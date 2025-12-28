'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabaseClient } from "@/lib/supabaseClient";
import CreateButton from "@/components/CreateButton";
import styled from 'styled-components';
import { AdminAccount } from "../types";

export default function AdminAccountsPage() {
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAccounts = async () => {
    setLoading(true);
    const { data, error } = await supabaseClient.from('admins').select('*');

    if (error) {
      console.error('Supabase error:', error);
      setAccounts([]);
      setLoading(false);
      return;
    }

    setAccounts(data as AdminAccount[] || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this account?')) return;
    const { error } = await supabaseClient.from('admins').delete().eq('id', id);
    if (error) return console.error(error);
    setAccounts(accounts.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Accounts</h1>

      {loading ? (
        <p>Loading accounts...</p>
      ) : (
        <AccountList>
          {accounts.map((account) => (
            <AccountCard key={account.id}>
              <h3>{account.email}</h3>
              <button className="delete" onClick={() => handleDelete(account.id)}>
                Delete
              </button>
            </AccountCard>
          ))}
        </AccountList>
      )}

      <h1>User Accounts</h1>
      
    </div>
    );
}

const AccountList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const AccountCard = styled.div`
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    font-weight: 600;
  }

  .delete {
    background: #ff4d4d;
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-weight: 500;
  }
`;