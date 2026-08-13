import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";

function TransactionForm({ onLogout }) {
const navigate = useNavigate();
const { id } = useParams();
const editing = Boolean(id);

const [categories, setCategories] = useState([]);

const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const [form, setForm] = useState({
    date: getToday(),
    description: "",
    amount: "",
    type: "expense",
    category: "",
});

useEffect(() => {
    api.get("categories/")
        .then((response) => {
            setCategories(response.data);
        })
        .catch((error) => {
            console.error(error);
        });
}, []);

useEffect(() => {
    if (!editing) {
        return;
    }

    api.get(`transactions/${id}/`)
        .then((response) => {
            setForm({
                date: response.data.date,
                description: response.data.description || "",
                amount: response.data.amount,
                type: response.data.type,
                category: response.data.category,
            });
        })
        .catch((error) => {
            console.error(error);
        });
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
        const csrfResponse = await api.get("csrf/");

        const csrfToken = csrfResponse.data.csrfToken;

        const config = {
            headers: {
                "X-CSRFToken": csrfToken,
            },
        };

        if (editing) {
            await api.put(
                `transactions/${id}/`,
                form,
                config
            );
        } else {
            await api.post(
                "transactions/",
                form,
                config
            );
        }

        navigate("/transactions");

    } catch (error) {
        console.error(error.response?.data);
        console.error(error);
        alert("Error al guardar la transacción.");
    }
};

return (
    <>
        <Navbar onLogout={onLogout} />

        <div className="container mt-4">
            <h2 className="mb-4">
                {editing
                    ? "Editar transacción"
                    : "Nueva transacción"}
            </h2>

            <div className="card shadow-sm border-0">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>

                        {editing && (
                            <div className="mb-3">
                                <label className="form-label">
                                    Fecha
                                </label>

                                <input
                                    type="date"
                                    className="form-control"
                                    name="date"
                                    value={form.date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}

                        {!editing && (
                            <div className="alert alert-light border mb-3">
                                <i className="fa-solid fa-calendar-day me-2"></i>
                                Fecha de la transacción:

                                <strong className="ms-1">
                                    {new Date(
                                        form.date + "T00:00:00"
                                    ).toLocaleDateString(
                                        "es-ES",
                                        {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        }
                                    )}
                                </strong>
                            </div>
                        )}

                        <div className="mb-3">
                            <label className="form-label">
                                Descripción
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Importe
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                className="form-control"
                                name="amount"
                                value={form.amount}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Tipo
                            </label>

                            <select
                                className="form-select"
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                            >
                                <option value="income">
                                    Ingreso
                                </option>

                                <option value="expense">
                                    Gasto
                                </option>
                            </select>
                        </div>

                        <div className="mb-4">
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
                                <option value="">
                                    Seleccione una categoría
                                </option>

                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="d-flex gap-2">

                            <button
                                className="btn btn-primary"
                                type="submit"
                            >
                                <i className="fa-solid fa-save me-2"></i>

                                {editing
                                    ? "Actualizar transacción"
                                    : "Guardar transacción"}
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() =>
                                    navigate("/transactions")
                                }
                            >
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

export default TransactionForm;
