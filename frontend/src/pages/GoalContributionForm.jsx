import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";

function GoalContributionForm({ onLogout }) {
    const navigate = useNavigate();
    const { id } = useParams();
    const [form, setForm] = useState({amount: "", note: "",});

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!form.amount || Number(form.amount) <= 0) {
            setError("La cantidad debe ser mayor que cero.");
            return;
        }
        setSaving(true);
        try {
            const csrf = await api.get("csrf/");
            await api.post(`goals/${id}/contributions/`, form, {headers: {"X-CSRFToken": csrf.data.csrfToken}});
            navigate("/goals");
        } catch (error) {
            console.error(error);
            if (error.response?.data) {
                console.error("Respuesta API:", error.response.data);
            }
            setError(
                "No se pudo agregar el dinero a la meta."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <Navbar onLogout={onLogout} />
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-8">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h2 className="fw-bold mb-0">Agregar dinero</h2>
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/goals")}>
                                        Volver
                                    </button>
                                </div>

                                {error && (
                                    <div className="alert alert-danger">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Cantidad</label>
                                        <div className="input-group">
                                            <input
                                                type="number"
                                                name="amount"
                                                className="form-control"
                                                placeholder="0.00"
                                                min="0.01"
                                                step="0.01"
                                                value={form.amount}
                                                onChange={handleChange}
                                                required
                                            />

                                            <span className="input-group-text"> € </span>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">Nota</label>

                                        <textarea
                                            name="note"
                                            className="form-control"
                                            rows="3"
                                            placeholder="Ej. Ahorro del mes..."
                                            value={form.note}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="d-flex justify-content-end gap-2">
                                        <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/goals")}>
                                            Cancelar
                                        </button>

                                        <button type="submit" className="btn btn-success" disabled={saving}>
                                            {saving
                                                ? "Guardando..."
                                                : "Agregar dinero"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default GoalContributionForm;