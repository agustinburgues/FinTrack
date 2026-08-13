import { useEffect, useState } from "react";
import api from "../services/api";
import TransactionTable from "../components/TransactionTable";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Transactions({ onLogout }) {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [type, setType] = useState("");
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const navigate = useNavigate();

    const loadTransactions = () => {
        setLoading(true);
        api.get("transactions/", {
            params: {
                search,
                type,
                category,
                month,
                year,
            },
        })
            .then((response) => {
                setTransactions(response.data);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const deleteTransaction = async (id) => {
        if (!window.confirm("¿Eliminar esta transacción?")) {
            return;
        }

        try {
            const csrfResponse = await api.get("csrf/");
            await api.delete(`transactions/${id}/`, {
                headers: {
                    "X-CSRFToken": csrfResponse.data.csrfToken,
                },
            });
            loadTransactions();
        } catch (error) {
            console.error(error);
            alert("No se pudo eliminar la transacción.");
        }
    };

    useEffect(() => {
        let cancelled = false;

        api.get("transactions/", {
            params: {
                search,
                type,
                category,
                month,
                year,
            },
        })
            .then((response) => {
                if (!cancelled) {
                    setTransactions(response.data);
                }
            })
            .catch((error) => {
                if (!cancelled) {
                    console.error(error);
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [search, type, category, month, year]);

    useEffect(() => {
        api.get("categories/")
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const clearFilters = () => {
        setSearch("");
        setType("");
        setCategory("");
        setMonth("");
        setYear("");
    };

    const exportCSV = () => {
        if (transactions.length === 0) {
            alert("No hay transacciones para exportar.");
            return;
        }

        const headers = ["Fecha", "Descripción", "Categoría", "Tipo", "Importe"];

        const rows = transactions.map((transaction) => [
            transaction.date,
            transaction.description || "-",
            transaction.category,
            transaction.type === "income" ? "Ingreso" : "Gasto",
            transaction.amount,
        ]);

        const csvContent = [
            headers.join(";"),
            ...rows.map((row) => row.map((value) => `"${value}"`).join(";")),
        ].join("\n");

        const blob = new Blob(["\uFEFF" + csvContent], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "transacciones.csv";
        link.click();

        URL.revokeObjectURL(url);
    };

    const currentYear = new Date().getFullYear();
    const years = [];

    for (let i = currentYear; i >= currentYear - 5; i--) {
        years.push(i);
    }

    if (loading) {
        return (
            <>
                <Navbar onLogout={onLogout} />
                <div className="container mt-4">
                    <h3>Cargando transacciones...</h3>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar onLogout={onLogout} />

            <div className="container mt-4">

                <h2 className="mb-4">Transacciones</h2>

                <div className="d-flex gap-2 mb-3">
                    <button className="btn btn-primary" onClick={() => navigate("/transactions/new")}>
                        <i className="fas fa-plus me-2"></i>
                        Nueva transacción
                    </button>

                    <button className="btn btn-success" onClick={exportCSV}>
                        <i className="fas fa-file-csv me-2"></i>
                        Exportar CSV
                    </button>
                </div>

                <div className="card shadow-sm border-0 mb-4">
                    <div className="card-body">
                        <div className="row g-3">

                            <div className="col-lg">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Buscar..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            <div className="col-lg">
                                <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                                    <option value="">Todas las categorías</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-lg">
                                <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                                    <option value="">Todos los tipos</option>
                                    <option value="income">Ingresos</option>
                                    <option value="expense">Gastos</option>
                                </select>
                            </div>

                            <div className="col-lg">
                                <select className="form-select" value={month} onChange={(e) => setMonth(e.target.value)}>
                                    <option value="">Todos los meses</option>
                                    <option value="1">Enero</option>
                                    <option value="2">Febrero</option>
                                    <option value="3">Marzo</option>
                                    <option value="4">Abril</option>
                                    <option value="5">Mayo</option>
                                    <option value="6">Junio</option>
                                    <option value="7">Julio</option>
                                    <option value="8">Agosto</option>
                                    <option value="9">Septiembre</option>
                                    <option value="10">Octubre</option>
                                    <option value="11">Noviembre</option>
                                    <option value="12">Diciembre</option>
                                </select>
                            </div>

                            <div className="col-lg">
                                <select className="form-select" value={year} onChange={(e) => setYear(e.target.value)}>
                                    <option value="">Todos los años</option>
                                    {years.map((itemYear) => (
                                        <option key={itemYear} value={itemYear}>{itemYear}</option>
                                    ))}
                                </select>
                            </div>

                        </div>

                        <div className="d-flex justify-content-end gap-2 mt-3">
                            <button className="btn btn-primary" onClick={loadTransactions}>
                                <i className="fas fa-filter me-2"></i>
                                Filtrar
                            </button>

                            <button className="btn btn-outline-secondary" onClick={clearFilters}>
                                Limpiar filtros
                            </button>
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">
                        Total de transacciones:
                        <span className="badge bg-primary ms-2">{transactions.length}</span>
                    </h4>
                </div>

                <TransactionTable
                    title=""
                    transactions={transactions}
                    onDelete={deleteTransaction}
                />

            </div>
        </>
    );
}

export default Transactions;