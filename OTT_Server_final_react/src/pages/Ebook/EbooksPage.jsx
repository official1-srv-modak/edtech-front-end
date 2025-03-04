import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './EbooksPage.css';
import logo from '../../assets/logo.png';


const EbooksPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const allEbookUrl = import.meta.env.VITE_SPRING_MANAGEMENT_GET_ALL_EBOOKS;
    const ebookById = import.meta.env.VITE_SPRING_MANAGEMENT_GET_EBOOK_BY_ID;

    useEffect(() => {
        fetch(allEbookUrl, {
            method: 'GET',
            headers: {
                Authorization: 'Basic YWRtaW46cGFzc3dvcmQxMjM='
            }
        })
            .then((response) => response.json())
            .then((data) => {
                setData(data.folderMap);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);

    const openFile = (url) => {
        console.log(`Opening file from URL: ${url}`);
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const renderFiles = (files) => {
        return files.map((file, fileIndex) => (
            <div
                key={fileIndex}
                className="ebook-file-card"
                onClick={() => openFile(`${ebookById}${file.id}`)}
            >
                <p>{file.name}</p>
            </div>
        ));
    };

    const renderFolders = (folder) => {
        return (
            <div className="ebook-subfolder-card">
                <h3>{folder.folderName}</h3>
                {renderFiles(folder.files)}
                {folder.subfolders && folder.subfolders.length > 0 && (
                    <div className="ebook-subfolders-grid">
                        {folder.subfolders.map((subfolder, index) => (
                            <div key={index}>
                                {renderFolders(subfolder)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="ebooks-page">
            <Navbar />
            <div className="ebook-page-content">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="ebook-categories-grid">
                        <img src={logo} alt="Logo" className="navbar-logo-mobile" />
                        {data?.subfolders?.map((folder, index) => (
                            <div key={index}>
                                {renderFolders(folder)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default EbooksPage;