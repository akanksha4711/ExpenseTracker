import { Grid, Stack } from "@mui/material";
import HeroCard from "./components/HeroCard";
import "./ExpenseTracker.css";
import { useState, useEffect } from "react";
import ExpenseCard from "./components/ExpenseCard";
import Example from "./components/PieChart";
import TopExpenses from "./components/TopExpenses";
import { useSnackbar } from "notistack";

export default function ExpenseTracker () {
    const [income, setIncome] = useState(0);
    const [expenses, setExpenses] = useState([]);
    const [data, setData] = useState([]);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [page, setPage] = useState(1);
    const itemsPerPage = 3;

    const getTotalExpenses = (arr) => {
        return arr.reduce((sum, expense)=> sum+Number(expense.price), 0);
    }

    useEffect(() => {
        if(localStorage.getItem("income")){
            setIncome(Number(localStorage.getItem("income")))
        }
        else {
            setIncome(5000);
            localStorage.setItem("income", "5000");
        }
        if(localStorage.getItem("expenses")){
            setExpenses(JSON.parse(localStorage.getItem("expenses")).expenses);
        }
    }, []);

    useEffect(() => {
        setData(generateData(expenses));
    }, [expenses])

    const editExpense = (newExpense) => {
        let newExpenseList = [];
        let newIncome;
        for(let i=0; i<expenses.length; i++){
            if(expenses[i].id === newExpense.id) {
                newIncome = income + Number(expenses[i].price) - Number(newExpense.price);
                if(newIncome < 0) {
                    // show alert here
                    enqueueSnackbar('You cannot add this expense as it is greater than total income',{
                        variant: "error",
                        autoHideDuration: 5000
                    })
                    return;
                }
                newExpenseList.push(newExpense);
            }
            else newExpenseList.push(expenses[i]);
        }
        localStorage.setItem("income", newIncome);
        localStorage.setItem("expenses", JSON.stringify({expenses: newExpenseList}));
        setIncome(newIncome);
        setExpenses(newExpenseList);
        enqueueSnackbar('Successfully edited expense',{
            variant: "success",
            autoHideDuration: 5000
        })
    }

    const deleteExpense = (id) => {
        let newExpenseList = [];
        let newIncome;
        for(let i=0; i<expenses.length; i++){
            if(expenses[i].id === id) {
                newIncome = income + Number(expenses[i].price);
                continue
            }
            else newExpenseList.push(expenses[i]);
        }
        localStorage.setItem("income", newIncome);
        localStorage.setItem("expenses", JSON.stringify({expenses: newExpenseList}));
        setIncome(newIncome);
        setExpenses(newExpenseList);
        enqueueSnackbar('Successfully deleted expense',{
            variant: "success",
            autoHideDuration: 5000
        })
    }

    const generateData = (expenses) => {
        const entertainmentTotal = expenses.filter((expense) => expense.type === "entertainment").reduce((sum,expense) => sum+Number(expense.price),0);
        const foodTotal = expenses.filter((expense) => expense.type === "food").reduce((sum,expense) => sum+Number(expense.price),0);
        const travelTotal = expenses.filter((expense) => expense.type === "travel").reduce((sum,expense) => sum+Number(expense.price),0);
        const groceriesTotal = expenses.filter((expense) => expense.type === "groceries").reduce((sum,expense) => sum+Number(expense.price),0);
        const shoppingTotal = expenses.filter((expense) => expense.type === "shopping").reduce((sum,expense) => sum+Number(expense.price),0);
        const otherTotal = expenses.filter((expense) => expense.type === "other").reduce((sum,expense) => sum+Number(expense.price),0);
        let data = [];
        if(entertainmentTotal !== 0) data.push({name:"entertainment", value: entertainmentTotal})
        if(foodTotal !== 0) data.push({name:"food", value: foodTotal})
        if(travelTotal !== 0) data.push({name:"travel", value: travelTotal})
        if(groceriesTotal !== 0) data.push({name:"groceries", value: groceriesTotal})
        if(shoppingTotal !== 0) data.push({name:"shopping", value: shoppingTotal})
        if(otherTotal !== 0) data.push({name:"other", value: otherTotal})
        return data;
    }
    const COLORS = ['purple', 'orange', 'grey', 'green', 'magenta', 'blue'];
    return (
        <div className="container">
            <h1 className="heading">Expense Tracker</h1>
            <Grid container className="hero">
                <Grid className="hero-item" item xs={12} md={4}><HeroCard type={"balance"} income={income} setIncome={setIncome}/></Grid>
                <Grid className="hero-item" item xs={12} md={4}><HeroCard type={"expense"} income={income} setIncome={setIncome} expenses={expenses} setExpenses={setExpenses} getTotalExpenses={getTotalExpenses}/></Grid>
                <Grid className="hero-item" item xs={12} md={4}>
                    <Example data={data}/>
                    <Stack direction={"column"}>
                        {data.map((d, idx) => {
                            const color = COLORS[idx];
                            return <div style={{display:'flex', flexDirection:'row',alignItems:'center'}}>
                                <div style={{backgroundColor:color, width:"15px", height:"5px"}}></div><span>&nbsp;{d.name}</span>
                            </div>
                        })}
                    </Stack>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                    <h1 className="heading"><em>Recent Transactions</em></h1>
                    <div className="expense-list">
                        {expenses.map((expense,idx) => {
                            if(idx >= (page-1)*itemsPerPage && idx < page*itemsPerPage)
                                return <ExpenseCard expense={expense} deleteExpense={deleteExpense} editExpense={editExpense}/>
                        })}
                    </div>
                    <div style={{textAlign:"center"}}>
                        <button onClick={() => {
                            if(page > 1) setPage(page-1)
                        }}>Previous</button>
                        <span style={{color:'white', margin:"10px"}}>{page}</span>
                        <button onClick={() => {
                            if(page <= Math.floor(expenses.length/itemsPerPage)) setPage(page+1)
                        }}>Next</button>
                    </div>
                </Grid>
                <Grid item xs={12} md={4}>
                    <h1 className="heading"><em>Top Expenses</em></h1>
                    <TopExpenses data={data}/>
                </Grid>
            </Grid>
        </div>
    )
}