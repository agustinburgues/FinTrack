import { useNavigate } from "react-router-dom";

function PublicNavbar() {
    const navigate = useNavigate();
    return (
        <nav className="navbar navbar-expand-lg navbar-dark shadow-sm" style={{ backgroundColor: "#0d6efd" }}>
            <div className="container">
                <button type="button" className="navbar-brand fw-bold border-0 bg-transparent text-white" onClick={() => navigate("/")}>
                    <i className="fa-solid fa-wallet me-1"></i>
                    FinTrack
                </button>

                <div className="d-flex gap-2">
                    <button type="button" className="btn btn-outline-light" onClick={() => navigate("/")}>
                        Iniciar sesión
                    </button>

                    <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => {
                            window.location.href =
                                "http://localhost:8000/accounts/register/";
                        }}
                    >
                        Crear cuenta
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default PublicNavbar;