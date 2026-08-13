import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api, { postWithCsrf } from "../services/api";
import Navbar from "../components/Navbar";

function GoalForm({ onLogout }) {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    const [form, setForm] = useState({
        name: "",
        description: "",
        target_amount: "",
        target_date: "",
    });

    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {

        if (!isEditing) {
            return;
        }

        api.get("goals/")
            .then((response) => {
                const goal = response.data.find(
                    (item) => item.id === Number(id)
                );

                if (!goal) {
                    setError("No se encontró la meta.");
                    return;
                }

                setForm({
                    name: goal.name || "",
                    description: goal.description || "",
                    target_amount: goal.target_amount || "",
                    target_date: goal.target_date || "",
                });
            })
            .catch((error) => {
                console.error(error);
                setError("No se pudo cargar la meta.");
            })
            .finally(() => {
                setLoading(false);
            });

    }, [id, isEditing]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!form.name.trim()) {
            setError("El nombre de la meta es obligatorio.");
            return;
        }

        if (!form.target_amount || Number(form.target_amount) <= 0) {
            setError("El objetivo debe ser mayor que cero.");
            return;
        }

        setSaving(true);

        try {
            if (isEditing) {
                await api.put(
                    `goals/${id}/`,
                    form
                );
            } else {
                await postWithCsrf(
                    "goals/",
                    form
                );
            }

            navigate("/goals");

        } catch (error) {
            console.error(error);

            if (error.response?.data) {
                console.error(
                    "Respuesta API:",
                    error.response.data
                );
            }

            setError(
                "No se pudo guardar la meta."
            );

        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar onLogout={onLogout} />

                <div className="container mt-5 text-center">
                    <h4>Cargando meta...</h4>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar onLogout={onLogout} />

            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-lg-7 col-md-9">

                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-4">

                                <div className="d-flex justify-content-between align-items-center mb-4">

                                    <h2 className="fw-bold mb-0">
                                        {isEditing
                                            ? "Editar meta"
                                            : "Nueva meta"}
                                    </h2>

                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => navigate("/goals")}
                                    >
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
                                        <label className="form-label fw-semibold">
                                            Nombre
                                        </label>

                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control"
                                            placeholder="Ej. Vacaciones en Japón"
                                            value={form.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">
                                            Descripción
                                        </label>

                                        <textarea
                                            name="description"
                                            className="form-control"
                                            rows="3"
                                            placeholder="Descripción de la meta (opcional)"
                                            value={form.description}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">
                                            Objetivo
                                        </label>

                                        <div className="input-group">

                                            <input
                                                type="number"
                                                name="target_amount"
                                                className="form-control"
                                                placeholder="0.00"
                                                min="0.01"
                                                step="0.01"
                                                value={form.target_amount}
                                                onChange={handleChange}
                                                required
                                            />

                                            <span className="input-group-text">
                                                €
                                            </span>

                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">
                                            Fecha objetivo
                                        </label>

                                        <input
                                            type="date"
                                            name="target_date"
                                            className="form-control"
                                            value={form.target_date}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="d-flex justify-content-end gap-2">

                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => navigate("/goals")}
                                        >
                                            Cancelar
                                        </button>

                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={saving}
                                        >
                                            {saving
                                                ? "Guardando..."
                                                : isEditing
                                                    ? "Guardar cambios"
                                                    : "Crear meta"}
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

export default GoalForm;
