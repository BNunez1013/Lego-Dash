import { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { ToastContainer, toast } from "react-toastify";


const LookUp = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");

    const handleSearch = async () => {
        try {
            const response = await axios.post("http://localhost:4000/lookup", { search: searchTerm });
            setResults(response.data);
            setError("");
        } catch (err) {
            setError("Failed to fetch Lego sets. Please try again!");
        }
    };

    const openModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImage("");
    };

    const handleAdd = async (setDetails) => {
        try {
            const {data} = await axios.post("http://localhost:4000/add", setDetails, { withCredentials: true});
            console.log(data);
            const {success, message} = data;
            if (success) {
                toast.success(message, {
                    position: "top-right"
                });
            } else {
                toast.error(message, {
                    position: "top-right"
                });
            }
        } catch (err) {
            console.log(err);
            console.log("Failed to add set to collection.");
        }
    }

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
            {/* Fixed Header */}
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
                    Lego Set Lookup
                </h1>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "1em"
                }}>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search for a Lego set"
                        style={{
                            padding: "12px 20px",
                            borderRadius: "50px",
                            border: "1px solid #ccc",
                            width: "300px",
                            fontSize: "16px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            textAlign: "center"
                        }}
                    />
                    <button
                        onClick={handleSearch}
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
                        onMouseOver={(e) => e.target.style.backgroundColor = "#0056b3"}
                        onMouseOut={(e) => e.target.style.backgroundColor = "#007bff"}
                    >
                        Search
                    </button>
                </div>
            </header>

            {/* Scrollable Content */}
            <div style={{
                flex: 1,
                width: "100%",
                overflowY: "auto",
                marginTop: "210px", // Adjust this based on the height of your header
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
                            <th style={{ padding: "10px" }}>Add to Collection</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map(set => (
                            <tr key={set.set_num} style={{ borderBottom: "1px solid #ddd" }}>
                                <td style={{ padding: "10px" }}>
                                    <img src={set.image_url} alt={set.name} style={{ width: "50px", borderRadius: "5px" }} onClick={() => openModal(set.image_url)}/>
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
                                <td style={{ padding: "10px" }}>
                                    <button
                                        onClick={() => handleAdd(set)}
                                        style={{
                                            padding: "10px 20px",
                                            borderRadius: "50px",
                                            backgroundColor: "green",
                                            color: "white",
                                            border: "none",
                                            fontSize: "16px",
                                            cursor: "pointer",
                                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                            transition: "background-color 0.3s ease"
                                        }}
                                        onMouseOver={(e) => e.target.style.backgroundColor = "green"}
                                        onMouseOut={(e) => e.target.style.backgroundColor = "green"}
                                    >
                                    Add
                                    </button>
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

export default LookUp;
