import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FaStar } from 'react-icons/fa';

const DocsPage = () => {
  const [doc, setDoc] = useState('');
  const [docs, setDocs] = useState<string[]>([]);
  const [stars, setStars] = useState(0);
  const { slug } = useParams();

  useEffect(() => {
    // In a real app, you'd fetch this list from an API
    const availableDocs = ['API_SETUP.md'];
    setDocs(availableDocs);

    const fetchDoc = async () => {
      const docName = slug || availableDocs[0];
      if (docName) {
        try {
          const response = await fetch(`/docs/${docName}`);
          const text = await response.text();
          setDoc(text);
        } catch (error) {
          console.error("Error fetching doc:", error);
          setDoc('Failed to load document.');
        }
      }
    };

    fetchDoc();
  }, [slug]);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/neuracert/neuracert.github.io');
        const data = await response.json();
        setStars(data.stargazers_count);
      } catch (error) {
        console.error("Error fetching GitHub stars:", error);
      }
    };
    fetchStars();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 p-4">
        <h2 className="text-xl font-bold mb-4">Documentation</h2>
        <nav>
          <ul>
            {docs.map((docName) => (
              <li key={docName}>
                <Link to={`/docs/${docName}`} className="block py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                  {docName.replace('.md', '')}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto pt-4 border-t dark:border-gray-700">
            <a href="https://github.com/neuracert/neuracert.github.io" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800">
                <FaStar className="mr-2" />
                Star on GitHub
                <span className="ml-2 bg-gray-700 text-white text-xs font-bold px-2 py-1 rounded-full">{stars}</span>
            </a>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <article className="prose dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{doc}</ReactMarkdown>
        </article>
      </main>
    </div>
  );
};

export default DocsPage;
