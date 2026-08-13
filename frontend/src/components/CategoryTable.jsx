import { useNavigate } from "react-router-dom";

function CategoryTable({ categories, onDelete }) {
    const navigate = useNavigate();

    if (categories.length === 0) {
        return (
            <div className="card shadow-sm border-0">
                <div className="card-body text-center py-4">
                    Todavía no existen categorías.
                </div>
            </div>
        );
    }

    return (
        <div className="card shadow-sm border-0">
            <div className="card-body">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Nombre</th>
                            <th>Tipo</th>
                            <th>Color</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.name}</td>

                                <td>
                                    <span className={`badge ${category.type === "income" ? "bg-success" : "bg-danger"}`}>
                                        {category.type === "income" ? "Ingreso" : "Gasto"}
                                    </span>
                                </td>

                                <td>
                                    <div style={{
                                        width: 22,
                                        height: 22,
                                        borderRadius: "50%",
                                        background: category.color,
                                        border: "1px solid #ccc",
                                    }}/>
                                </td>

                                <td className="text-center">
                                    <button className="btn btn-warning btn-sm me-2" onClick={() =>
                                        navigate(`/categories/${category.id}/edit`)
                                    }>
                                        <i className="fas fa-pen me-1"></i>
                                        Editar
                                    </button>

                                    <button className="btn btn-danger btn-sm" onClick={() => onDelete?.(category.id)}>
                                        <i className="fas fa-trash me-1"></i>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CategoryTable;