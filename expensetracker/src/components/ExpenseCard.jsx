import React from 'react';
import Modal from 'react-modal';
import { useState } from "react";

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
};

function ExpenseCard({expense, editExpense, deleteExpense}) {
    let subtitle;
    const [modalIsOpen, setIsOpen] = useState(false);
    function openModal() {
        setIsOpen(true);
    }
    function afterOpenModal() {
        subtitle.style.color = 'black';
    }
    function closeModal() {
        setIsOpen(false);
    }

  const handleEdit = (e) => {
    const newExpense = {};
    newExpense.title = e.target.title.value;
    newExpense.price = Number(e.target.price.value);
    newExpense.type = e.target.type.value;
    newExpense.date = e.target.date.value;
    newExpense.id = expense.id;
    editExpense(newExpense);
  }
  const handleDelete = () => {
    deleteExpense(expense.id);
  }
  return (
    <div className='expense'>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: 'center'
      }}>
        <div style={{
            display: "flex",
            flexDirection: "column"
        }}>
            <div>{expense.title}</div>
            <div>{expense.date}</div>
        </div>
        <div style={{
            display: 'flex',
            flexDirection: "row",
            alignItems: 'center'
        }}>
            <div>{expense.price}</div>
            <button onClick={openModal}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Edit Expense</h2>
                <form  onSubmit={(e)=>{
                        handleEdit(e);
                        closeModal();
                    }}>
                    <input required name="title" type="text" placeholder={expense.title} className="modal-input"/>
                    <input required name="price" type="number" placeholder={expense.price} className="modal-input"/>
                    <br/>
                    <select required name="type" className="modal-input" placeholder={expense.type}>
                        <option value="food">Food</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="travel">Travel</option>
                        <option value="groceries">Groceries</option>
                        <option value="shopping">Shopping</option>
                        <option value="other">Other</option>
                    </select>
                    <input required name="date" type="date" placeholder={expense.date} className="modal-input"/>
                    <br/>
                    <button type="submit" className="modal-submit-btn">Edit Expense</button>
                    <button onClick={closeModal} className="modal-cancel-btn">Cancel</button>
                </form>
            </Modal>
        </div>
      </div>
      <hr/>
    </div>
  )
}

export default ExpenseCard
