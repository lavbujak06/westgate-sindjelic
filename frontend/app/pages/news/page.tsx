'use client';

import React, { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import NewsCard, { News } from '@/components/NewsCard'; // <-- updated import
import styled from 'styled-components';

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);

  const fetchNews = async () => {
    const { data, error } = await supabaseClient
      .from('news')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch news:', error);
      return;
    }

    setNews(data as News[] || []);
  };


  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <PageWrapper>
      <h1 className="page-title">Latest News</h1>
      {news.length === 0 && <p className="no-news">No news available at the moment.</p>}

      <NewsGrid>
        {news.map((item) => (
          <NewsCard key={item.id} news={item} />
        ))}
      </NewsGrid>
    </PageWrapper>
  );
}

// Styled components
const PageWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;

  .page-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 2rem;
    text-align: center;
  }

  .no-news {
    text-align: center;
    color: #777;
    font-size: 1rem;
  }
`;

const NewsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;
