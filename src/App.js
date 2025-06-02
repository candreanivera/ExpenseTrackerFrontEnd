import React, { useEffect, useState } from "react";
import ExpenseList from "./components/ExpenseList";
import AddExpenseForm from "./components/AddExpenseForm";
import Saludo from "./components/Saludo";
import "./Css/App.css";

function App() {
  const [expenses, setExpenses] = useState([]);

  // To obtain the current month
  const currentMonth = new Date().toLocaleString("en-US", { month: "long" });

  //Hook used to call the API
  //res: Server's answer. res.json() transforms the answer in a javascript object
  //then result is passed to setExpenses, so expenses can be updated
  useEffect(() => {
    fetch("https://expensetrackerbackend-1-r4ic.onrender.com")
      .then((res) => res.json())
      .then((data) => setExpenses(data));
    //expenses value will be replaced by the value obtained from the server
  }, []);

  //ADD EXPENSES
  const handleAddExpense = (newExpense) => {
    setExpenses([...expenses, newExpense]);
  };

  //DELETE EXPENSE
  const handleDeleteExpense = async (id) => {
    const res = await fetch(
      `https://expensetrackerbackend-1-r4ic.onrender.com/api/expenses/${id}`,
      {
        method: "DELETE",
      }
    );
    if (res.ok) {
      //Removes the eliminated expense from the local list
      setExpenses(expenses.filter((exp) => exp.id !== id));
    } else {
      console.error("Error at deleting the expense");
    }
  };

  //EDIT EXPENSE
  const handleEditExpense = async (id, updatedExpense) => {
    const res = await fetch(
      `https://expensetrackerbackend-1-r4ic.onrender.com/api/expenses/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedExpense),
      }
    );

    if (res.ok) {
      const updated = await res.json();
      setExpenses((expenses) =>
        expenses.map((exp) => (exp.id === id ? updated : exp))
      );
    } else {
      console.error("Error at editing the expense");
    }
  };

  //To obtain the total expense amount
  const totalAmount = expenses.reduce(
    (sum, exp) => sum + parseFloat(exp.amount),
    0
  );

  return (
    <div className="App">
      <div className="main-container">
        <header className="logo-contenedor">
          <div>
            <h1 className="title">Expense Tracker</h1>
          </div>
          <div className="messages">
            <Saludo name="Cristina" month={currentMonth} />
            <p>
              Total spent this month: <b>${totalAmount.toFixed(2)}</b>
            </p>
          </div>
        </header>
        <hr />
        <div>
          <AddExpenseForm onAdd={handleAddExpense} />
        </div>
        <hr className="line" />
        <div
          style={{ marginBottom: "20px", textAlign: "center", padding: "10px" }}
        >
          <ExpenseList
            expenses={expenses}
            onDelete={handleDeleteExpense}
            onEdit={handleEditExpense}
          />
        </div>
        <br />
      </div>
    </div>
  );
}

export default App;
