import { useEffect, useState } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import api from "./services/api";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import TransactionForm from "./pages/TransactionForm";
import Categories from "./pages/Categories";
import Budgets from "./pages/Budgets";
import Goals from "./pages/Goals";
import GoalForm from "./pages/GoalForm";
import GoalContributionForm from "./pages/GoalContributionForm";
import GoalDetail from "./pages/GoalDetail";
import Profile from "./pages/Profile";
import CategoryForm from "./pages/CategoryForm";
import BudgetForm from "./pages/BudgetForm";
import PasswordChange from "./pages/PasswordChange";
import PublicNavbar from "./components/PublicNavbar";
import BudgetDetail from "./pages/BudgetDetail";

function App() {
    const [loading, setLoading] = useState(true);
    const [logged, setLogged] = useState(false);

    useEffect(() => {
        api.get("me/")
            .then((response) => {
                setLogged(response.data.authenticated);
            })
            .catch(() => {
                setLogged(false);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <h2>Cargando...</h2>;
    }

    return (
        <BrowserRouter>
            {!logged ? (
                <>
                    <PublicNavbar />
                    <Routes>
                        <Route path="/" element={<Login onLogin={() => setLogged(true)} />}/>
                        <Route path="/register" element={<Register />}/>
                    </Routes>
                </>
            ) : (
                <Routes>
                    <Route path="/" element={<Dashboard onLogout={() => setLogged(false)}/>}/>
                    <Route path="/transactions" element={<Transactions onLogout={() => setLogged(false)}/>}/>
                    <Route path="/transactions/new" element={<TransactionForm onLogout={() => setLogged(false)}/>}/>
                    <Route path="/transactions/:id/edit" element={<TransactionForm onLogout={() => setLogged(false)}/>}/>
                    <Route path="/categories" element={<Categories onLogout={() => setLogged(false)}/>}/>
                    <Route path="/categories/new" element={<CategoryForm onLogout={() => setLogged(false)}/>}/>
                    <Route path="/categories/:id/edit" element={<CategoryForm onLogout={() => setLogged(false)}/>}/>
                    <Route path="/budgets" element={<Budgets onLogout={() => setLogged(false)}/>}/>
                    <Route path="/budgets/new" element={<BudgetForm onLogout={() => setLogged(false)}/>}/>
                    <Route path="/budgets/:id" element={<BudgetDetail />} />
                    <Route path="/budgets/:id/edit" element={<BudgetForm />} />
                    <Route path="/goals" element={<Goals onLogout={() => setLogged(false)}/>}/>
                    <Route path="/goals/new" element={<GoalForm onLogout={() => setLogged(false)}/>}/>
                    <Route path="/goals/:id" element={<GoalDetail onLogout={() => setLogged(false)}/>}/>
                    <Route path="/goals/:id/edit" element={<GoalForm onLogout={() => setLogged(false)}/>}/>
                    <Route path="/goals/:id/contribute" element={<GoalContributionForm onLogout={() => setLogged(false)}/>}/>
                    <Route path="/profile" element={<Profile onLogout={() => setLogged(false)}/>}/>
                    <Route path="/password-change" element={<PasswordChange />}/>
                </Routes>
            )}
        </BrowserRouter>
    );
}

export default App;