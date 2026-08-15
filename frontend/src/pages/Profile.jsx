import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";

function Profile({ onLogout }) {


const navigate = useNavigate();

const [form, setForm] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    currency: "EUR",
});

const [profilePicture, setProfilePicture] = useState(null);
const [preview, setPreview] = useState(null);

const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);

const [message, setMessage] = useState("");
const [error, setError] = useState("");

useEffect(() => {
    let cancelled = false;

    const load = async () => {
        try {
            const response = await api.get("profile/");

            if (cancelled) {
                return;
            }

            setForm({
                username: response.data.username || "",
                first_name: response.data.first_name || "",
                last_name: response.data.last_name || "",
                email: response.data.email || "",
                currency: response.data.currency || "EUR",
            });

            setPreview(
                response.data.profile_picture || null
            );

        } catch (error) {
            if (!cancelled) {
                console.error(error);
                setError("No se pudo cargar el perfil.");
            }
        } finally {
            if (!cancelled) {
                setLoading(false);
            }
        }
    };

    load();

    return () => {
        cancelled = true;
    };
}, []);

const handleChange = (event) => {

    const { name, value } = event.target;

    setForm((previous) => ({
        ...previous,
        [name]: value,
    }));

};


const handleImageChange = (event) => {

    const file = event.target.files[0];

    if (!file) {
        return;
    }

    setProfilePicture(file);

    setPreview(
        URL.createObjectURL(file)
    );

};


const handleSubmit = async (event) => {

    event.preventDefault();

    setMessage("");
    setError("");
    setSaving(true);

    try {

        const data = new FormData();

        data.append("username", form.username);
        data.append("first_name", form.first_name);
        data.append("last_name", form.last_name);
        data.append("email", form.email);
        data.append("currency", form.currency);

        if (profilePicture) {
            data.append(
                "profile_picture",
                profilePicture
            );
        }

        const csrfResponse = await api.get("csrf/");

        const response = await api.put(
            "profile/",
            data,
            {
                headers: {
                    "X-CSRFToken":
                        csrfResponse.data.csrfToken,
                },
            }
        );

        setMessage(
            response.data.message ||
            "Perfil actualizado correctamente."
        );

        setProfilePicture(null);

        if (response.data.profile?.profile_picture) {
            setPreview(
                response.data.profile.profile_picture
            );
        }

    } catch (error) {

        console.error(error);

        console.error(
            "Respuesta API:",
            error.response?.data
        );

        setError(
            "No se pudo actualizar el perfil."
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
                <h4>Cargando perfil...</h4>
            </div>
        </>
    );

}


return (
    <>
        <Navbar onLogout={onLogout} />

        <div className="container mt-4">

            <div className="row justify-content-center">

                <div className="col-lg-7">

                    <div className="card shadow-sm border-0">

                        <div className="card-header bg-white py-3">

                            <h3 className="mb-0">
                                <i className="fa-solid fa-user me-2"></i>
                                Mi perfil
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

                                <div className="text-center mb-4">

                                    {preview ? (

                                        <img
                                            src={preview}
                                            alt="Foto de perfil"
                                            className="rounded-circle border"
                                            style={{
                                                width: "120px",
                                                height: "120px",
                                                objectFit: "cover",
                                            }}
                                        />

                                    ) : (

                                        <div
                                            className="rounded-circle bg-light border d-flex align-items-center justify-content-center mx-auto"
                                            style={{
                                                width: "120px",
                                                height: "120px",
                                            }}
                                        >
                                            <i
                                                className="fa-solid fa-user text-secondary"
                                                style={{
                                                    fontSize: "50px",
                                                }}
                                            ></i>
                                        </div>

                                    )}

                                </div>


                                <div className="mb-3">

                                    <label className="form-label">
                                        Foto de perfil
                                    </label>

                                    <input
                                        type="file"
                                        className="form-control"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />

                                </div>


                                <div className="mb-3">

                                    <label className="form-label">
                                        Nombre de usuario
                                    </label>

                                    <input
                                        type="text"
                                        name="username"
                                        className="form-control"
                                        value={form.username}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                <div className="row">

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">
                                            Nombre
                                        </label>

                                        <input
                                            type="text"
                                            name="first_name"
                                            className="form-control"
                                            value={form.first_name}
                                            onChange={handleChange}
                                        />

                                    </div>


                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">
                                            Apellidos
                                        </label>

                                        <input
                                            type="text"
                                            name="last_name"
                                            className="form-control"
                                            value={form.last_name}
                                            onChange={handleChange}
                                        />

                                    </div>

                                </div>


                                <div className="mb-3">

                                    <label className="form-label">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        value={form.email}
                                        onChange={handleChange}
                                    />

                                </div>


                                <div className="mb-4">

                                    <label className="form-label">
                                        Moneda
                                    </label>

                                    <select
                                        name="currency"
                                        className="form-select"
                                        value={form.currency}
                                        onChange={handleChange}
                                    >
                                        <option value="EUR">
                                            Euro (€)
                                        </option>

                                        <option value="USD">
                                            Dólar ($)
                                        </option>

                                        <option value="ARS">
                                            Peso Argentino ($)
                                        </option>

                                    </select>

                                </div>


                                <div className="d-flex justify-content-between align-items-center">

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={saving}
                                    >
                                        <i className="fa-solid fa-floppy-disk me-1"></i>

                                        {saving
                                            ? "Guardando..."
                                            : "Guardar cambios"}
                                    </button>


                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => navigate("/password-change")}
                                    >
                                        <i className="fa-solid fa-lock me-1"></i>
                                        Cambiar contraseña
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

export default Profile;
