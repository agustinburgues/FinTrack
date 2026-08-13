import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";

function CategoryForm({ onLogout }) {
    const navigate = useNavigate();
    const { id } = useParams();

    const editing = Boolean(id);

    const [form, setForm] = useState({
        name: "",
        category_type: "expense",
        color: "#0d6efd",
    });

    useEffect(() => {

        if (!editing) return;
        api.get(`categories/${id}/`)
            .then((response) => {
                setForm(response.data);
            })
            .catch(console.error);

    }, [editing, id]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const csrf = await api.get("csrf/");
            const config = {
                headers: {"X-CSRFToken": csrf.data.csrfToken},
            };

            if (editing) {
                await api.put(`categories/${id}/`, form, config);
            } else {
                await api.post("categories/", form, config);
            }
            navigate("/categories");
        } catch (error) {
            console.error(error);
            alert("Error al guardar la categoría.");
        }
    };
    return (
        <>
            <Navbar onLogout={onLogout} />
            <div className="container mt-4">
                <h2 className="mb-4">{editing ? "Editar categoría" : "Nueva categoría"}</h2>
                <div className="card shadow-sm border-0">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Nombre</label>
                                <input
                                    className="form-control"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Tipo</label>
                                <select
                                    className="form-select"
                                    name="category_type"
                                    value={form.category_type}
                                    onChange={handleChange}
                                >
                                    <option value="income">Ingreso</option>
                                    <option value="expense">Gasto</option>
                                </select>
                                <div className="mb-3">
                                    <label className="form-label">Icono</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="icon"
                                        value={form.icon}
                                        onChange={handleChange}
                                        placeholder="Ej: fa-car"
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label">Color</label>
                                <input
                                    type="color"
                                    className="form-control form-control-color"
                                    name="color"
                                    value={form.color}
                                    onChange={handleChange}
                                />
                            </div>

                            <button className="btn btn-primary">
                                {editing ? "Actualizar categoría" : "Guardar categoría"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CategoryForm;