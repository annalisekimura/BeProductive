import React, { useState } from 'react'
import { useEffect } from 'react';
import '../App.css';
import Sidebar from '../Components/sidebar';

/* Home page with most popular news articles from New York Times */

function Home() {
    const [articles, setArticles] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const res = await fetch(
                    `https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=WGTZFCqHZ0GTrCdpDFTQLj4fcT8b1gAe`
                );
                if(!res.ok) {
                    throw new Error(`HTTP error!`);
                }
                const data = await res.json();
                setArticles(data.results);
                setIsLoading(false);
                console.log(data.results);
            }
            catch(error) {
                console.log(error);
                setIsLoading(false);
            }
        }
        fetchArticles()
    }, []);


    return (
        <div className="container">
            <Sidebar />
            <div className="Home">
                <h1 className="Title">WELCOME TO YOUR PLANNER,</h1>

                {localStorage.getItem('user') ? (
                    <h2 className="T2">{localStorage.getItem('user')}</h2>
                ) : (
                    <h2 className="T2">Guest</h2> // Replace with appropriate default
                )}

                <h2>Popular In The News:</h2>

                <section className="article-container">
                    {articles.map((article) => {
                        const {
                            title,
                            abstract,
                            url,
                            media
                        } = article

                        const imageUrl = media && media.length > 0 ? media[0]['media-metadata'][2].url : '';

                        return (
                            <div className="article-box">
                                <article key={abstract}>
                                    {imageUrl && <img src={imageUrl} alt={title} className="article-image" />}
                                    <h1>{title}</h1>
                                    <h4>{abstract}</h4>
                                    <a href={url} target="_blank">
                                        Read Article
                                    </a>
                                </article>
                            </div>
                        )
                    })}
                </section>
            </div>
        </div>
    );
}

export default Home;