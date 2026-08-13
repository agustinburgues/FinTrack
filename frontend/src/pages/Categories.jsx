import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import Navbar from "../components/Navbar";
import CategoryTable from "../components/CategoryTable";

function Categories({ onLogout }) {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const loadCategories = (searchValue) => {
        setLoading(true);

        api.get("categories/", {
            params: {
                search: searchValue,
            },
        })
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const deleteCategory = async (id) => {
        if (!window.confirm("¿Eliminar esta categoría?")) {
            return;
        }

        try {
            const csrfResponse = await api.get("csrf/");

            await api.delete(`categories/${id}/`, {
                headers: {
                    "X-CSRFToken": csrfResponse.data.csrfToken,
                },
            });

            loadCategories(search);
        } catch (error) {
            console.error(error);
            alert("No se pudo eliminar la categoría.");
        }
    };

    useEffect(() => {
        let cancelled = false;

        api.get("categories/", {
            params: {
                search,
            },
        })
            .then((response) => {
                if (!cancelled) {
                    setCategories(response.data);
                }
            })
            .catch((error) => {
                if (!cancelled) {
                    console.error(error);
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [search]);

    if (loading) {
        return (
            <>
                <Navbar onLogout={onLogout} />

                <div className="container mt-4">
                    <p>Cargando categorías...</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar onLogout={onLogout} />

            <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0">
                        <i className="fas fa-tags me-2"></i>
                        Categorías
                    </h2>

                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/categories/new")}
                    >
                        <i className="fas fa-plus me-2"></i>
                        Nueva categoría
                    </button>
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar categoría..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <p className="text-muted">
                    Total de categorías: <strong>{categories.length}</strong>
                </p>

                <CategoryTable
                    categories={categories}
                    onDelete={deleteCategory}
                />
            </div>
        </>
    );
}

export default Categories;

