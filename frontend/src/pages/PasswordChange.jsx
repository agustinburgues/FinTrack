import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";

function PasswordChange({ onLogout }) {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        old_password: "",
        new_password1: "",
        new_password2: "",
    });

    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (event) => {

        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });

    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        setMessage("");
        setError("");
        setSaving(true);

        try {

            const csrfResponse = await api.get("csrf/");

            const response = await api.post(
                "password-change/",
                form,
                {
                    headers: {
                        "X-CSRFToken":
                            csrfResponse.data.csrfToken,
                    },
                }
            );

            setMessage(
                response.data.message
            );

            setForm({
                old_password: "",
                new_password1: "",
                new_password2: "",
            });

        } catch (error) {

            console.error(error);

            const errors =
                error.response?.data?.errors;

            if (errors) {

                const messages = Object.values(errors)
                    .flat()
                    .join(" ");

                setError(messages);

            } else {

                setError(
                    "No se pudo cambiar la contraseña."
                );

            }

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

                        <div className="card shadow-sm border-0">

                            <div className="card-header bg-white py-3">

                                <h3 className="mb-0">
                                    <i className="fa-solid fa-lock me-2"></i>
                                    Cambiar contraseña
                                </h3>

                            </div>


                            <div className="card-body p-4">

                                {message && (
                                    <div className="alert alert-success">
                                        {message}
                                    </div>
                                )}

                                {error && (
                                    <div className="alert alert-danger">
                                        {error}
                                    </div>
                                )}


                                <form onSubmit={handleSubmit}>

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Contraseña actual
                                        </label>

                                        <input
                                            type="password"
                                            name="old_password"
                                            className="form-control"
                                            value={form.old_password}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>


                                    <div className="mb-3">

                                        <label className="form-label">
                                            Nueva contraseña
                                        </label>

                                        <input
                                            type="password"
                                            name="new_password1"
                                            className="form-control"
                                            value={form.new_password1}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>


                                    <div className="mb-4">

                                        <label className="form-label">
                                            Confirmar nueva contraseña
                                        </label>

                                        <input
                                            type="password"
                                            name="new_password2"
                                            className="form-control"
                                            value={form.new_password2}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>


                                    <div className="d-flex justify-content-between">

                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => navigate("/profile")}
                                        >
                                            Volver al perfil
                                        </button>


                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={saving}
                                        >
                                            {saving
                                                ? "Guardando..."
                                                : "Cambiar contraseña"}
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

export default PasswordChange;
