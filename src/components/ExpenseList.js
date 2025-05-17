// src/components/ExpenseList.js
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../Css/ExpenseList.css';


function ExpenseList({ expenses, onDelete, onEdit }) {

  //Tp edit expenses
  const [editingExpense, setEditingExpense] = useState(null);
  //Error handling messages
  const [error, setError] = useState('');
  //To include a filter by date on the expenses list
  const [filterDate, setFilterDate] = useState('');
  //To include a filter by category on the expenses list
  const [filterCategory, setFilterCategory] = useState('');
  
  //Pagination variables. Current page and how many items to show per page
    const [currentPage, setCurrentPage] = useState(1);
    const itemsperpage = 8;

    useEffect(() => {
    setCurrentPage(1);
    }, [filterDate, filterCategory]);

  //Function to activate the edition mode
  const handleEdit = (expense) => {
    setEditingExpense({ ...expense });
  }

  //Function to save changes after editing
  const handleSaveEdit = async (id, updatedExpense) => {
    setError('');

    //validations
    if (!updatedExpense.description || !updatedExpense.amount) {
      setError('Please, fill all the required fields');
      return;
    }
    if (isNaN(updatedExpense.amount) || parseFloat(updatedExpense.amount) <= 0) {
      setError('Amount should be greater than zero');
      return;
    }
    try{
      //Function onEdit will update the database
      await onEdit(id, updatedExpense);
      //Cleaning the state after editing
      setEditingExpense(null);
    } catch (error) {
      console.error('Error at editing the expense', error);
      setError('Error at editing the expense');
    }
  };

  //Applying filters by date and category
  const filteredExpenses = [...expenses]
  .filter(exp => {
    if (!filterDate) return true;
    const expenseDateObj = new Date(exp.date);
    const year = expenseDateObj.getFullYear();
    const month = String(expenseDateObj.getMonth() + 1).padStart(2, '0');
    const day = String(expenseDateObj.getDate()).padStart(2, '0');
    const expenseDateFormatted = `${year}-${month}-${day}`;
    return expenseDateFormatted === filterDate;
  })
  .filter(exp => {
    if (!filterCategory) return true;
    return exp.category.toLowerCase() === filterCategory.toLowerCase();
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date));

   //Calculate paginated items
   const lastItemIndex = currentPage * itemsperpage;
   const firstItemIndex = lastItemIndex - itemsperpage;
   const currentItems = filteredExpenses.slice(firstItemIndex, lastItemIndex);   
   const totalPages = Math.ceil(filteredExpenses.length / itemsperpage);

  return (
    <div>
      <h2 className= 'subtitulo' style={{ paddingBottom: '10px' }} >💸Filter Expenses:</h2>
      <div className="filters-container">
        {/* Filter expenses by Date and Category*/}
        {/* By Date*/}  
        <div className="filter">
          <label className="filter-label">Filter expenses by date: </label>
          <DatePicker selected={filterDate && !isNaN(new Date(filterDate).getTime()) ? new Date(filterDate) : null} onChange={(date) => {
                if (date) {
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const day = String(date.getDate()).padStart(2, '0');
                  const formatted = `${year}-${month}-${day}`;
                  setFilterDate(formatted);
                } else {
                  setFilterDate('');
                }
              }}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/yyyy"
          />
          <button className="btn btn-dark" onClick={() => setFilterDate('')}>Clear</button>
        </div>
        {/* By Category*/}
        <div className="filter">
          <label className="filter-label">Filter expenses by Category: </label>
          <input type="text" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}/>
          <button className="btn btn-dark" onClick={() => setFilterCategory('')}>Clear</button>
        </div>
        {/* End of the filter by date */}
      </div>

      <div className={`error-message ${!error ? 'error-hidden' : ''}`}>{error || ' '}</div>
      <h2 className= 'subtitulo' style={{ paddingBottom: '10px', paddingTop: '10px', color: 'white' }}>Expenses List:</h2>
      <ul className="contenedor-lista">
        {currentItems.map(exp => (
            <li key={exp.id}>
              {editingExpense && editingExpense.id === exp.id ? (
                //Editing section
                <div className="row g-2 align-items-center">
                    <div className="col-md-3">
                      <input
                        type="text"
                        className="form-control"
                        value={editingExpense.description}
                        onChange={(e) => setEditingExpense({ ...editingExpense, description: e.target.value })}/>
                    </div>
                    <div className="col-md-2">
                      <input
                        type="number"
                        className="form-control"
                        value={editingExpense.amount}
                        onChange={(e) => setEditingExpense({ ...editingExpense, amount: e.target.value })}/>
                    </div>
                    <div className="col-md-2">
                      <input
                        type="text"
                        value={editingExpense.category}
                        onChange={(e) => setEditingExpense({ ...editingExpense, category: e.target.value })}/>
                    </div>
                    <div className="col-md-2">
                      <input
                        type="date"
                        value={editingExpense.date}
                        onChange={(e) => setEditingExpense({ ...editingExpense, date: e.target.value })}/>
                    </div>
                    <div className="col-md-auto">
                      <button className="btn btn-sm btn-success me-2" onClick={() => handleSaveEdit(exp.id, editingExpense)}>Save</button>
                      <button className="btn btn-sm btn-secondary" onClick={() => {setEditingExpense(null); setError('')}}>Cancel</button>
                    </div>
                </div>
              ) : 
              (
                  //listing section
              <div className = 'item-lista'>
                  <div className='letras-lista'>
                    <div>{exp.description.length > 30 ? exp.description.substring(0, 30) + '...' : exp.description} </div>
                    <div>${exp.amount}</div>
                    <div>{exp.category}</div> 
                    <div>{new Date(exp.date).toLocaleDateString('en-NZ')}</div>
                  </div>
                    <div className="botones">
                      <button className="btn btn-info me-2" onClick={() => onDelete(exp.id)}>Delete</button>
                      <button className="btn btn-info" onClick={() => handleEdit(exp)}>Edit</button>
                    </div>
              </div>
              )}
          </li>
          
        ))}
        
      </ul>
      {/* Pagination */}
      <div className="pagination">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="btn btn-sm btn-dark me-1" >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`btn btn-sm btn btn-dark me-1 ${currentPage === index + 1 ? 'btn-dark' : 'btn btn-dark'}`} >
                        {index + 1}
                    </button>
                    ))}
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="btn btn-sm btn-dark">
                      Next
                    </button>
        </div>  
    </div>

  ); //closing return


} //Closing function

export default ExpenseList;