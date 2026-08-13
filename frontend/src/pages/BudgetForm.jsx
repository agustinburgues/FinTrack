import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";

function BudgetForm({ onLogout }) {
    const navigate = useNavigate();
    const { id } = useParams();

    const editing = Boolean(id);

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(editing);

    const [form, setForm] = useState({
        category: "",
        amount: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    });

    useEffect(() => {

        api.get("categories/")
            .then((response) => {
                setCategories(
                    response.data.filter(
                        category => category.category_type === "expense"
                    )
                );
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (!editing) {
            return;
        }
        api.get(`budgets/${id}/`)
            .then((response) => {
                setForm({
                    category: response.data.category,
                    amount: response.data.amount,
                    month: response.data.month,
                    year: response.data.year,
                });

            })
            .catch((error) => {
                console.error(error);
                alert("No se pudo cargar el presupuesto.");
                navigate("/budgets");
            })
            .finally(() => {
                setLoading(false);
            });

    }, [editing, id, navigate]);

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
                headers: {
                    "X-CSRFToken": csrf.data.csrfToken,
                },
            };

            if (editing) {
                await api.put(
                    `budgets/${id}/`,
                    form,
                    config
                );

            } else {
                await api.post(
                    "budgets/",
                    form,
                    config
                );
            }

            navigate("/budgets");

        } catch (error) {

            console.error(error.response?.data);
            console.error(error);

            if (error.response?.data) {

                const errors = error.response.data;

                if (typeof errors === "object") {
                    const messages = Object.values(errors)
                        .flat()
                        .join("\n");
                    alert(messages || "Error al guardar el presupuesto.");
                } else {
                    alert("Error al guardar el presupuesto.");
                }

            } else {
                alert("Error al guardar el presupuesto.");
            }
        }
    };

    if (loading) {

        return (
            <>
                <Navbar onLogout={onLogout} />

                <div className="container mt-4">
                    <h3>Cargando presupuesto...</h3>
                </div>
            </>
        );

    }

    return (
        <>
            <Navbar onLogout={onLogout} />
            <div className="container mt-4">

                <h2 className="mb-4">
                    {editing
                        ? "Editar presupuesto"
                        : "Nuevo presupuesto"}
                </h2>

                <div className="card shadow-sm border-0">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">
                                    Categoría
                                </label>

                                <select
                                    className="form-select"
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">Seleccione una categoría</option>

                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    Presupuesto
                                </label>

                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    className="form-control"
                                    name="amount"
                                    value={form.amount}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Mes</label>

                                    <select
                                        className="form-select"
                                        name="month"
                                        value={form.month}
                                        onChange={handleChange}
                                        required
                                    >

                                        <option value="1">Enero</option>
                                        <option value="2">Febrero</option>
                                        <option value="3">Marzo</option>
                                        <option value="4">Abril</option>
                                        <option value="5">Mayo</option>
                                        <option value="6">Junio</option>
                                        <option value="7">Julio</option>
                                        <option value="8">Agosto</option>
                                        <option value="9">Septiembre</option>
                                        <option value="10">Octubre</option>
                                        <option value="11">Noviembre</option>
                                        <option value="12">Diciembre</option>

                                    </select>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        Año
                                    </label>

                                    <input
                                        type="number"
                                        className="form-control"
                                        name="year"
                                        value={form.year}
                                        onChange={handleChange}
                                        min="2000"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-primary">
                                    <i className="fas fa-save me-2"></i>

                                    {editing
                                        ? "Actualizar presupuesto"
                                        : "Guardar presupuesto"}
                                </button>

                                <button type="button" className="btn btn-secondary" onClick={() => navigate("/budgets")}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default BudgetForm;