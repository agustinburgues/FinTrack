import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import api from "../services/api";

function Navbar({ onLogout }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    useEffect(() => {
        api.get("profile/")
            .then((response) => {
                setUser(response.data);
            })
            .catch((error) => {
                console.error(
                    "No se pudo cargar el perfil:",
                    error
                );
            });
    }, []);

    const logout = async () => {
        try {
            const csrfResponse = await api.get("csrf/");
            await api.post(
                "logout/",
                {},
                {
                    headers: {
                        "X-CSRFToken":
                            csrfResponse.data.csrfToken,
                    },
                }
            );
            onLogout();
        } catch (error) {
            console.error(
                "Error al cerrar sesión:",
                error
            );
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
            <div className="container">

                <NavLink className="navbar-brand fw-bold" to="/">
                    <i className="fa-solid fa-wallet me-1"></i>
                    FinTrack
                </NavLink>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <NavLink to="/" className="nav-link">
                                <i className="fa-solid fa-house me-1"></i>
                                Inicio
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink to="/transactions" className="nav-link">
                                <i className="fa-solid fa-money-bill-transfer me-1"></i>
                                Transacciones
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink to="/categories" className="nav-link">
                                <i className="fa-solid fa-tags me-1"></i>
                                Categorías
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink to="/budgets" className="nav-link">
                                <i className="fa-solid fa-wallet me-1"></i>
                                Presupuestos
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink to="/goals" className="nav-link">
                                Metas
                            </NavLink>
                        </li>
                    </ul>

                    <div className="dropdown">
                        <button
                            className="btn btn-outline-light dropdown-toggle d-flex align-items-center"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            {user?.profile_picture ? (
                                <img
                                    src={user.profile_picture}
                                    alt="Perfil"
                                    width="32"
                                    height="32"
                                    className="rounded-circle me-2"
                                    style={{
                                        objectFit: "cover",
                                    }}
                                />
                            ) : (
                                <i className="fa-solid fa-user-circle me-2"></i>
                            )}

                            Hola, {user?.username || "usuario"}
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                                <button className="dropdown-item" onClick={() => navigate("/profile")}>
                                    <i className="fa-solid fa-user me-2"></i>
                                    Mi perfil
                                </button>
                            </li>

                            <li>
                                <button className="dropdown-item" onClick={() => navigate("/password-change")}>
                                    <i className="fa-solid fa-key me-2"></i>
                                    Cambiar contraseña
                                </button>
                            </li>

                            <li><hr className="dropdown-divider" /></li>

                            <li>
                                <button className="dropdown-item text-danger" onClick={logout}>
                                    <i className="fa-solid fa-right-from-bracket me-2"></i>
                                    Cerrar sesión
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;