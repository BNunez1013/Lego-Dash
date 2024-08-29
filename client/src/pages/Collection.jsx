import React, { useEffect, useState, TopToolbar, SortButton } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { ToastContainer, toast } from "react-toastify";

const Collection = () => {
    const [collection, setCollection] = useState([]);
    const [sortedCollection, setSortedCollection] = useState([]);
    const [error, setError] = useState("");
    const [sortCriteria, setSortCriteria] = useState("name");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");

    const openModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImage("");
    };

    useEffect(() => {
        const fetchCollection = async () => {
            try {
                const response = await axios.get("http://localhost:4000/collection", { withCredentials: true });
                setCollection(response.data);
                setSortedCollection(response.data);
                setError("");
            } catch (err) {
                setError("Failed to fetch collection. Please try again!");
            }
        };

        fetchCollection();
    }, []);

    // Handle sorting when the sort criteria changes
    useEffect(() => {
        const sorted = [...collection].sort((a, b) => {
            if (sortCriteria === "name") {
                return a.name.localeCompare(b.name);
            } else if (sortCriteria === "num_parts") {
                return a.num_parts - b.num_parts;
            } else if (sortCriteria === "set_num") {
                return a.set_num.localeCompare(b.set_num);
            } else if (sortCriteria === "year") {
                return a.year - b.year;
            }
            return 0;
        });
        setSortedCollection(sorted);
    }, [sortCriteria, collection]);

    return (
        <>
            <div style={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                height: "100vh", 
                overflow: "hidden"
            }}>
                <Navbar/>
                <header style={{
                    width: "100%",
                    padding: "20px 0",
                    position: "fixed",
                    top: 60,
                    zIndex: 1000,
                    textAlign: "center"
                }}>
                    <h1 style={{ 
                        fontSize: '40px',
                        marginBottom: '10px',
                        textAlign: "center" 
                    }}>
                        My Lego Collection
                    </h1>
                    <div style={{ marginBottom: "20px" }}>
                        <label htmlFor="sortCriteria">Sort by: </label>
                        <select
                            id="sortCriteria"
                            value={sortCriteria}
                            onChange={(e) => setSortCriteria(e.target.value)}
                            style={{
                                padding: "10px 20px",
                                borderRadius: "50px",
                                backgroundColor: "#007bff",
                                color: "white",
                                border: "none",
                                fontSize: "16px",
                                cursor: "pointer",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                transition: "background-color 0.3s ease"
                            }}
                        >                            
                            <option value="name">Name</option>
                            <option value="num_parts">Piece Count</option>
                            <option value="set_num">Set Number</option>
                            <option value="year">Year Released</option>
                        </select>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div style={{
                    flex: 1,
                    width: "100%",
                    overflowY: "auto",
                    marginTop: "200px", // Adjust this based on the height of your header
                    padding: "0 20px",
                    boxSizing: "border-box"
                }}>
                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                    <table style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        marginTop: "20px"
                    }}>
                        <thead>
                            <tr style={{ backgroundColor: "#f1f1f1", textAlign: "left" }}>
                                <th style={{ padding: "10px" }}>Image</th>
                                <th style={{ padding: "10px" }}>Name</th>
                                <th style={{ padding: "10px" }}>Set Number</th>
                                <th style={{ padding: "10px" }}>Year</th>
                                <th style={{ padding: "10px" }}>Pieces</th>
                                <th style={{ padding: "10px" }}>Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedCollection.map(set => (
                                <tr key={set.set_num} style={{ borderBottom: "1px solid #ddd" }}>
                                    <td style={{ padding: "10px" }}>
                                        <img src={set.image_url} alt={set.name} style={{ width: "50px", borderRadius: "5px" }}  onClick={() => openModal(set.image_url)}/>
                                    </td>
                                    <td style={{ padding: "10px", fontWeight: "bold" }}>{set.name}</td>
                                    <td style={{ padding: "10px" }}>{set.set_num}</td>
                                    <td style={{ padding: "10px" }}>{set.year}</td>
                                    <td style={{ padding: "10px" }}>{set.num_parts}</td>
                                    <td style={{ padding: "10px" }}>
                                        <a href={set.set_url} target="_blank" rel="noopener noreferrer" style={{ color: "#007bff", textDecoration: "none", fontWeight: "bold" }}>
                                            View on Rebrickable
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Modal for Enlarged Image */}
                {isModalOpen && (
                    <div style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 2000
                    }} onClick={closeModal}>
                        <img src={selectedImage} alt="Enlarged Lego Set" style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: "10px" }} />
                    </div>
                )}
                <ToastContainer />
            </div>
        </>
    );
};

export default Collection;