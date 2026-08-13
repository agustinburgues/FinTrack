import { Link } from "react-router-dom";
import {
    FaPlus,
    FaList,
    FaTags,
    FaFolderOpen,
    FaWallet,
    FaBullseye,
} from "react-icons/fa";

function QuickActions() {

    const actions = [
        {
            title: "Nueva transacción",
            icon: <FaPlus />,
            to: "/transactions/new",
            className: "btn btn-primary",
        },
        {
            title: "Ver transacciones",
            icon: <FaList />,
            to: "/transactions",
            className: "btn btn-outline-primary",
        },
        {
            title: "Nueva categoría",
            icon: <FaTags />,
            to: "/categories/new",
            className: "btn btn-outline-success",
        },
        {
            title: "Ver categorías",
            icon: <FaFolderOpen />,
            to: "/categories",
            className: "btn btn-outline-secondary",
        },
        {
            title: "Presupuestos",
            icon: <FaWallet />,
            to: "/budgets",
            className: "btn btn-outline-primary",
        },
        {
            title: "Metas",
            icon: <FaBullseye />,
            to: "/goals",
            className: "btn btn-outline-primary",
        },
    ];

    return (
        <div className="d-flex flex-wrap gap-2 mb-4">
            {actions.map((action) => (
                <Link
                    key={action.title}
                    to={action.to}
                    className={action.className}
                >
                    {action.icon}{" "}
                    {action.title}
                </Link>
            ))}
        </div>
    );
}

export default QuickActions;