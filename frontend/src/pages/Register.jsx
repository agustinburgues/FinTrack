import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        try {

            await api.get("csrf/");

            await api.post("register/", {
                username,
                first_name: firstName,
                last_name: lastName,
                email,
                password,
                password_confirm: passwordConfirm,
            });

            setSuccess("Cuenta creada correctamente. Puedes iniciar sesión.");

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {

            console.error(error);

            if (error.response?.data?.error) {
                setError(error.response.data.error);
            } else {
                setError("No se pudo crear la cuenta.");
            }
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">
                            <h2 className="text-center mb-4">Crear cuenta</h2>

                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="alert alert-success">
                                    {success}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Usuario</label>
                                    <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Nombre</label>
                                    <input type="text" className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Apellido</label>
                                    <input type="text" className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Contraseña</label>
                                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Confirmar contraseña</label>
                                    <input type="password" className="form-control" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} required/>
                                </div>

                                <button type="submit" className="btn btn-primary w-100">
                                    Crear cuenta
                                </button>
                            </form>

                            <div className="text-center mt-3">
                                <button type="button" className="btn btn-link" onClick={() => navigate("/login")}>
                                    Ya tengo una cuenta
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;