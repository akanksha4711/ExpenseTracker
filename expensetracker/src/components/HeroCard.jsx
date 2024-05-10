import "./HeroCard.css"
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

// Modal.setAppElement('#hero-card');

export default function HeroCard ({type, income, setIncome, expenses, setExpenses, getTotalExpenses}) {
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

    const addWalletBalance = (e) => {
        e.preventDefault();
        const extraIncome = Number(e.target.income.value);
        const newIncome = income + extraIncome;
        localStorage.setItem("income", newIncome);
        setIncome(newIncome);
    }

    const addNewExpense = (e) => {
        e.preventDefault();
        let newExpense = {};
        newExpense.title = e.target.title.value;
        newExpense.price = Number(e.target.price.value);
        newExpense.type = e.target.type.value;
        newExpense.date = e.target.date.value;
        newExpense.id = expenses.length;
        const newIncome = income-newExpense.price;
        if(newIncome < 0){
            // show alert here
            return;
        }
        expenses.push(newExpense)
        const newExpenseList = [...expenses];
        localStorage.setItem("expenses", JSON.stringify({expenses: newExpenseList}));
        localStorage.setItem("income", newIncome);
        setExpenses(newExpenseList);
        setIncome(newIncome);
    }

    return (
        <div className="hero-card" id="hero-card">
            <div className="hero-card-text">
                {type==="balance" ? "Wallet Balance: " : "Expenses: "}
                <span style={type === "balance" ? {color: "#89E148", fontWeight:"700"} : {color: "#FF3838", fontWeight:"700"}}>{type==="balance"? income : getTotalExpenses(expenses)}</span>
            </div>
            <button 
                className={type==="balance"?"hero-card-btn hero-card-btn-bkg1":"hero-card-btn hero-card-btn-bkg2"}
                onClick={openModal}
                >
                    {type==="balance" ? "+ Add Income" : "+ Add Expense"}
            </button>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Add Balance</h2>
                {type==="balance" && <form onSubmit={(e)=>{
                        addWalletBalance(e);
                        closeModal();
                    }}>
                    <input required name="income" type="number" placeholder="Income Amount" className="modal-input"/>
                    <button type="submit" className="modal-submit-btn">Add Balance</button>
                    <button onClick={closeModal} className="modal-cancel-btn">Cancel</button>
                </form>}
                {type==="expense" && <form  onSubmit={(e)=>{
                        addNewExpense(e);
                        closeModal();
                    }}>
                    <input required name="title" type="text" placeholder="Title" className="modal-input"/>
                    <input required name="price" type="number" placeholder="Price" className="modal-input"/>
                    <br/>
                    <select required name="type" className="modal-input">
                        <option value="food">Food</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="travel">Travel</option>
                        <option value="groceries">Groceries</option>
                        <option value="shopping">Shopping</option>
                        <option value="other">Other</option>
                    </select>
                    <input required name="date" type="date" className="modal-input"/>
                    <br/>
                    <button type="submit" className="modal-submit-btn">Add Expense</button>
                    <button onClick={closeModal} className="modal-cancel-btn">Cancel</button>
                </form>}
            </Modal>
        </div>
    )
}