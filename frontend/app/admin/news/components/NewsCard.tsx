'use client';

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Switch from '@/app/admin/news/components/Switch';
import { News } from '../types';

interface NewsCardProps {
  news: News;
  onDelete?: () => void;
  onTogglePublish?: () => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, onDelete, onTogglePublish }) => {
  return (
    <CardWrapper>
      <h3>{news.title}</h3>
      <p>{news.content}</p>
      <div className="actions">
        <Link href={`/admin/news/edit/${news.id}`}>
          <button className="edit">Edit</button>
        </Link>
        <button className="delete" onClick={onDelete}>
          Delete
        </button>
        <div className="publish">
          <Switch checked={news.published} onToggle={onTogglePublish} />
        </div>
      </div>
    </CardWrapper>
  );
};

const CardWrapper = styled.div`
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  h3 {
    font-weight: 600;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    button {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-weight: 500;
    }

    .edit {
      background: #007dab;
      color: #fff;
    }

    .delete {
      background: #ff4d4d;
      color: #fff;
    }

    .publish {
      margin-left: auto;
    }
  }
`;

export default NewsCard;