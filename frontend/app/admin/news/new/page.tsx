'use client';

import { useState } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import CreateButton from '@/components/CreateButton';
import styled from 'styled-components';
import Link from 'next/link';

export default function NewNewsPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabaseClient
      .from('news')
      .insert([{ title, content, published }])
      .select();

    setLoading(false);

    if (error) {
      console.error('Supabase insert error:', error);
      alert('Failed to create news: ' + error.message);
      return;
    }

    console.log('Inserted news:', data);
    alert('News created successfully!');
    window.location.href = '/admin/news';
  };

  return (
    <FormWrapper>
      <div className="container">
        <div className="modal">
          <div className="modal__header">
            <span className="modal__title">New News</span>
          </div>
          <form className="modal__body" onSubmit={handleSubmit}>
            <div className="input">
              <label className="input__label">Title</label>
              <input
                className="input__field"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="input">
              <label className="input__label">Content</label>
              <textarea
                className="input__field input__field--textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <div className="input">
              <label>
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                />{' '}
                Published
              </label>
            </div>

            <div className="modal__footer">
              <CreateButton type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create'}
              </CreateButton>
              <Link href="/admin/news">
                <CreateButton style={{ backgroundColor: '#ccc', color: '#000', marginLeft: '1rem' }}>
                  Cancel
                </CreateButton>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </FormWrapper>
  );
}

const FormWrapper = styled.div`
  .container {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
  }

  .modal {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 500px;
    background-color: #fff;
    box-shadow: 0 15px 30px rgba(0, 125, 171, 0.15);
    border-radius: 10px;
  }

  .modal__header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .modal__title {
    font-weight: 700;
    font-size: 1.25rem;
  }

  .modal__body {
    padding: 1rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .modal__footer {
    padding: 0 1.5rem 1.5rem;
    display: flex;
    justify-content: flex-end;
  }

  .input__label {
    font-weight: 700;
    font-size: 0.875rem;
  }

  .input__field {
    margin-top: 0.5rem;
    border: 1px solid #DDD;
    border-radius: 0.25rem;
    padding: 0.75rem;
  }

  .input__field:focus {
    outline: none;
    border-color: #007dab;
    box-shadow: 0 0 0 1px #007dab, 0 0 0 4px rgba(0, 125, 171, 0.25);
  }

  .input__field--textarea {
    min-height: 100px;
    max-width: 100%;
  }
`;
