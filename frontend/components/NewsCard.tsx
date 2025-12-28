import React from 'react';
import styled from 'styled-components';

export interface News {
  id: string;
  title: string;
  content: string;
  published: boolean;
  created_at: string;
  updated_at?: string;
}

interface Props {
  news: News;
}

const NewsCard: React.FC<Props> = ({ news }) => {
  return (
    <Card>
      <h2 className="news-title">{news.title}</h2>
      <p className="news-content">{news.content}</p>
      <span className="news-date">
        {new Date(news.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </span>
    </Card>
  );
};

export default NewsCard;

const Card = styled.div`
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .news-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #111;
  }

  .news-content {
    font-size: 1rem;
    color: #333;
    line-height: 1.6;
  }

  .news-date {
    font-size: 0.85rem;
    color: #999;
    align-self: flex-end;
  }

  &:hover {
    transform: translateY(-2px);
    transition: transform 0.2s ease;
  }
`;
