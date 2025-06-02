import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function AddExpenseForm({ onAdd }) {
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "",
    date: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.amount) {
      newErrors.amount = "Amount must be filled.";
    } else if (isNaN(form.amount) || parseFloat(form.amount) <= 0) {
      newErrors.amount = "Amount must be greater than zero.";
    }

    if (!form.description.trim()) {
      newErrors.description = "Description must be filled.";
    } else if (form.description.trim().length > 20) {
      newErrors.description = "Description must be up until 20 characters.";
    }

    if (!form.category.trim()) {
      newErrors.category = "Category must be filled.";
    }

    if (form.category.trim().length > 15) {
      newErrors.category = "Category must be up until 15 characters.";
    }

    if (!form.date) {
      newErrors.date = "Date must be completed.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    //If validations are OK we call the API with POST
    fetch("https://expensetrackerbackend-1-r4ic.onrender.com/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: form.description,
        amount: parseFloat(form.amount),
        category: form.category,
        date: form.date,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          if (data.details) {
            setErrors(data.details.join(" | ")); // conviertes el array en un string
          } else if (data.message) {
            setErrors(data.message);
          } else {
            setErrors("Unknown error occurred.");
          }
          return;
        }

        const newExpense = await res.json();
        onAdd(newExpense);
        setForm({ description: "", amount: "", category: "", date: "" });
        setErrors("");
      })
      .catch(() => {
        setErrors("Error adding the expense.");
      });
  };

  return (
    <div className="addExpense">
      <div
        className={`error-message ${
          !errors ||
          (typeof errors === "object" && Object.keys(errors).length === 0)
            ? "error-hidden"
            : ""
        }`}
      >
        {typeof errors === "string"
          ? errors
          : Object.values(errors)
              .filter((msg) => msg)
              .join(" | ")}
      </div>
      <h2 className="subtitulo" style={{ paddingBottom: "10px" }}>
        🪙 Add Expense
      </h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="addExpenseLabel">Expense Detail:</label>
          <input
            name="description"
            placeholder="Expense Detail"
            value={form.description}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="addExpenseLabel">Amount: </label>
          <input
            name="amount"
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="addExpenseLabel">Category:</label>
          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="addExpenseLabel">Date: </label>
          <DatePicker
            selected={
              form.date && !isNaN(new Date(form.date).getTime())
                ? new Date(form.date)
                : null
            }
            onChange={(date) => {
              if (date) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                const formatted = `${year}-${month}-${day}`;
                setForm({ ...form, date: formatted });
              } else {
                setForm({ ...form, date: "" });
              }
            }}
            dateFormat="dd/MM/yyyy"
            placeholderText="dd/mm/yyyy"
          />
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-dark">
            Add Expense
          </button>
        </div>
      </form>
    </div>
  );
} //EndForm

export default AddExpenseForm;
