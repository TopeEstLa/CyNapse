import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import {newsApi} from '../../utils/api';

const NewsDetail = () => {
    const {slug} = useParams();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNewsDetail = async () => {
            try {
                const data = await newsApi.get(slug);
                setNews(data);
            } catch (err) {
                setError(err.message || 'Failed to load news');
            } finally {
                setLoading(false);
            }
        };
        fetchNewsDetail();
    }, [slug]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) return <div className="p-8 text-center">Loading news article...</div>;
    if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
    if (!news) return <div className="p-8 text-center">News not found</div>;

    return (
        <div className="max-w-4xl mx-auto py-6 md:py-12 px-4 animate-fade-in">
            <Link
                to="/news"
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 mb-8 group transition-colors"
            >
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                Back to Newsroom
            </Link>

            <article
                className="bg-white p-6 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-blue-600/5">
                <header className="mb-10 border-b border-gray-50 pb-8">
                    <div className="flex items-center gap-3 mb-4">
            <span
                className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-lg">
              Article
            </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {formatDate(news.publicationDate)}
            </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tighter uppercase">
                        {news.title}
                    </h1>
                    <div className="flex items-center gap-3">
                        <div
                            className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-[10px] border border-blue-200 uppercase">
                            {news.author[0]}
                        </div>
                        <span className="text-sm font-bold text-gray-700">By {news.author}</span>
                    </div>
                </header>

                <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed font-medium">
                    <ReactMarkdown>{news.content}</ReactMarkdown>
                </div>
            </article>
        </div>
    );
};

export default NewsDetail;
