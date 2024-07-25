"use client"

import { useState, useEffect } from "react";
import React from "react";
import Image from "next/image";

export default function News() {
    const [news, setNews] = useState([]);
    const [articleNum, setArticleNum] = useState(2);

    useEffect(() => {
        fetch('https://saurav.tech/NewsAPI/top-headlines/category/business/us.json')
            .then((res) => res.json())
            .then((data) => {
                setNews(data.articles);
            });
    }, []);

    return (
        <div className='p-2 text-gray-800 space-y-3 bg-gray-100 rounded-xl pt-2'>
            <h4 className="font-bold text-xl px-4">What is happening ?</h4>
            {news.slice(0, articleNum).map((article) => (
                <div key={article.url}>
                    <a href={article.url} target='_blank'>
                        <div className="flex items-center justify-between px-4 pt-2 space-x-1 hover:bg-slate-500 transition duration-200">
                            <div className="space-y-1">
                                <h6 className="text-sm font-extrabold">{article.title}</h6>
                                <p className="text-sm font-medium text-gray-500">{article.source.name}</p>
                            </div>
                            <img
                                src={article.urlToImage}

                                width={70}
                                className="rounded-xl"
                            />
                        </div>
                    </a>
                </div>
            ))}
            {articleNum < news.length && (
                <button
                    onClick={() => setArticleNum(articleNum + 3)}
                    className="bg-transparent hover:text-blue-400 text-sm transition px-10 duration-200"
                >
                    Load More
                </button>
            )}
        </div>
    );
}
