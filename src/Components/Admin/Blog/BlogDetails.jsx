import { useEffect, useState } from 'react';
import { MdOutlineDateRange } from 'react-icons/md';
import { useLocation, useParams } from 'react-router-dom';
import parse from 'html-react-parser';

const BlogDetails = () => {

    const [article, setArticle] = useState(null);
    const articleID = useParams().articleID;
    const baseURL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fecthArticle = async () => {
            try {
                const response = await fetch(`${baseURL}/articles/${articleID}`);
                const json = await response.json();
                setArticle(json.data);
            }
            catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fecthArticle()
    }, []);

    return (
        <div className="max-w-[70%] mx-auto min-h-screen mx-auto bg-main">
            {/* title */}
            <div className="text-6xl text-white font-bold">{article?.title}</div>
            <div className="flex items-center text text-[#858585] font-normal gap-2 mt-6">
                <MdOutlineDateRange />
                <span>{article?.date}</span>
                <span> - </span>
                <span>{article?.author}</span>
            </div>
            <div className="max-w-7xl mt-8">
                <div className="w-full h-[400px] max-h-[400px] mb-8">
                    <img
                        src={article?.image}
                        alt={article?.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>
                {/* <div className="mt-12" dangerouslySetInnerHTML={{ __html: article?.content }}></div> */}

                <div className="text-white news-content">{article?.content ? parse(article?.content) : 'Nội dung không có sẵn'}</div>
            </div>
        </div>

    );
}

export default BlogDetails;
