import {
    FaWallet,
    FaArrowUp,
    FaArrowDown,
    FaExchangeAlt,
    FaTags,
    FaTrophy,
    FaCalendarAlt,
} from "react-icons/fa";

function SummaryCard({ title, value }) {

    let icon = <FaWallet />;
    let color = "primary";

    switch (title) {

        case "Balance":
            icon = <FaWallet />;
            color = "primary";
            break;

        case "Ingresos":
            icon = <FaArrowUp />;
            color = "success";
            break;

        case "Gastos":
            icon = <FaArrowDown />;
            color = "danger";
            break;

        case "Transacciones":
            icon = <FaExchangeAlt />;
            color = "warning";
            break;

        case "Categorías":
            icon = <FaTags />;
            color = "info";
            break;

        case "Mayor ingreso":
            icon = <FaTrophy />;
            color = "success";
            break;

        case "Mayor gasto":
            icon = <FaTrophy />;
            color = "danger";
            break;

        case "Mes actual":
            icon = <FaCalendarAlt />;
            color = "secondary";
            break;

        default:
            break;
    }

    return (

        <div className="col-lg-3 col-md-6 mb-4">
            <div className="card border-0 shadow-sm h-100 summary-card">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 className="text-muted mb-2">{title}</h6>
                            <h3 className="fw-bold mb-0">{value}</h3>
                        </div>

                        <div
                            className={`bg-${color} text-white rounded-circle d-flex align-items-center justify-content-center`}
                            style={{
                                width: "55px",
                                height: "55px",
                                fontSize: "22px",
                            }}
                        >
                            {icon}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SummaryCard;