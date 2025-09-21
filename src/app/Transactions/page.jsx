"use client";
import { useState ,useEffect} from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
  Divider,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  addToast,
} from "@heroui/react";
import Loading from "../../component/LodingUi/Loding.jsx";

export default function TransactionsPage() {
  const [date, Setdate] = useState("");
  const [note, Setnote] = useState("");
  const [amount, Setamount] = useState("");
  const [category, Setcategory] = useState("");
  const [method, Setmethod] = useState("Cash");
  const [type, Settype] = useState("Expense");

  const [laod,Setload]=useState(false);

  //  type

  const [transactions, setTransactions] = useState([
    
  ]);

//  fetch transaaction
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("/api/transactions", {
          method: "GET",
          credentials: "include", // ✅ include cookies
        });
          const data = await res.json();
          

        if (!res.ok) {
          addToast({
          title: "error",
          description: data.message,
          color:'danger',
        });
        }

        
        setTransactions(data.transactions || []);
      } catch (error) {
         addToast({
          title: "error",
          description:'Somthing went wrong',
          color:'danger',
        });
      }
    };

    fetchTransactions();
  }, []);

 
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    type: "all",
  });

  // Add new transaction
  const addTransaction = async () => {
    
    if (
      date != "" &&
      category != "" &&
      method != "" &&
      type != "" &&
      note != "" &&
      amount != ""
    ) {
      // start logic
       Setload(true);
      // call api of /api/transactions
      try {
        const res = await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category: category,
            amount: amount,
            method: method,
            note: note,
            date: date,
            type: type,
          }),
        });

        const data = await res.json();
        Setload(false);
        if(res.ok){
          addToast({
          title: "Added",
          description: data.message,
          color:'success',
        });
        window.location.reload();
        }
        else{
          addToast({
          title: "Error",
          description: data.message,
          color: "danger",
        });
        }

        console.log("Transaction Response:", data);
      } catch (error) {
        Setload(false);
        addToast({
          title: "Error",
          description: "somthing went wrong",
          color: "danger",
        });
      }
    } else {
      addToast({
        title: "Error",
        description: "All field are requried",
        color: "danger",
      });
    }
  };

  // Delete transaction
  const deleteTransaction = async (transactionId) => {
    // setTransactions(transactions.filter((tx) => tx.id !== id));
        console.log(transactionId)

     try {
      const res = await fetch("/api/transactions", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transactionId }),
      });

      const data = await res.json();
      if (res.ok) {
          addToast({
          title: "Deleted",
          description: data.message,
          color:'success',
        });
        window.location.reload();

      } else {
        addToast({
          title: "Faild",
          description: data.message,
          color:'danger',
        });
        
      }
    } catch (err) {
      addToast({
          title: "Try again",
          description:'something went wrong',
          color:'danger',
        });
    }
  };

  // Filtering
  const filteredTx = transactions.filter((tx) => {
    const matchesSearch =
      filters.search === "" ||
      tx.category.toLowerCase().includes(filters.search.toLowerCase()) ||
      tx.note.toLowerCase().includes(filters.search.toLowerCase());

    const matchesCategory =
      filters.category === "all" || tx.category === filters.category;

    const matchesType = filters.type === "all" || tx.type === filters.type;

    return matchesSearch && matchesCategory && matchesType;
  });

  const pages = Math.ceil(filteredTx.length / rowsPerPage);
  const displayedTx = filteredTx.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <div className="p-6 space-y-6">
      {laod?<Loading/>:null}
      {/* Add Transaction Form */}
      <Card shadow="sm" className="border border-gray-200">
        <CardHeader>
          <h2 className="text-xl font-semibold">➕ Add New Transaction</h2>
        </CardHeader>
        <Divider />
        <CardBody className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => {
              Setdate(e.target.value);
            }}
          />
          <Input
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => Setamount(e.target.value)}
          />
          <Input
            label="Category"
            placeholder="Groceries, Rent, Salary"
            value={category}
            onChange={(e) => Setcategory(e.target.value)}
          />
          <Select
            label="Method"
            selectedKeys={[method]}
            onChange={(e) => Setmethod(e.target.value)}
          >
            <SelectItem key="Cash">Cash</SelectItem>
            <SelectItem key="UPI">UPI</SelectItem>
            <SelectItem key="Card">Card</SelectItem>
            <SelectItem key="Bank">Bank</SelectItem>
            <SelectItem key="Wallet">Wallet</SelectItem>
          </Select>
          {/* {"Cash", "UPI", "Card", "Bank", "Wallet"} */}
          <Input
            label="Note"
            placeholder="Optional"
            value={note}
            onChange={(e) => {
              Setnote(e.target.value);
            }}
          />
          <Select
            label="Type"
            selectedKeys={[type]}
            onChange={(e) => Settype(e.target.value)}
          >
            <SelectItem key="Income">Income</SelectItem>
            <SelectItem key="Expense">Expense</SelectItem>
          </Select>
        </CardBody>
        <CardFooter>
          <Button color="primary" onPress={addTransaction}>
            Save Transaction
          </Button>
        </CardFooter>
      </Card>

      {/* Filters */}
      <Card shadow="sm" className="border border-gray-200">
        <CardBody className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <Input
            clearable
            placeholder="🔍 Search by category or note..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full md:w-1/3"
          />
          <Select
            label="Filter by Category"
            selectedKeys={[filters.category]}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            className="w-full md:w-1/4"
          >
            <SelectItem key="all">All</SelectItem>
            {[... new Set(transactions.map(item => item.category))].map(e => <SelectItem key={e}>{e}</SelectItem>)}
            
           
          </Select>
          <Select
            label="Filter by Type"
            selectedKeys={[filters.type]}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="w-full md:w-1/4"
          >
            <SelectItem key="all">All</SelectItem>
            <SelectItem key="Income">Income</SelectItem>
            <SelectItem key="Expense">Expense</SelectItem>
          </Select>
        </CardBody>
      </Card>

      {/* Transactions Table */}
      <Card shadow="sm" className="border border-gray-200">
        <CardHeader>
          <h2 className="text-xl font-semibold">📊 Transactions</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <Table
            aria-label="Transactions Table"
            selectionMode="none"
            classNames={{
              th: "text-gray-600 font-medium",
              td: "text-gray-800",
            }}
          >
            <TableHeader>
              <TableColumn>Date</TableColumn>
              <TableColumn>Amount</TableColumn>
              <TableColumn>Category</TableColumn>
              <TableColumn>Method</TableColumn>
              <TableColumn>Note</TableColumn>
              <TableColumn>Type</TableColumn>
              <TableColumn>Action</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"No transactions found"}>
              {displayedTx.map((tx) => (
                <TableRow key={tx._id}>
                  <TableCell>{tx.date.split("T")[0]}</TableCell>
                  <TableCell className="font-semibold text-blue-600">
                    ₹{tx.amount}
                  </TableCell>
                  <TableCell>{tx.category}</TableCell>
                  <TableCell>{tx.method}</TableCell>
                  <TableCell>{tx.note}</TableCell>
                  <TableCell
                    className={
                      tx.type === "Income"
                        ? "text-green-600 font-semibold"
                        : "text-red-600 font-semibold"
                    }
                  >
                    {tx.type}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      color="danger"
                      onPress={() => deleteTransaction(tx._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-center mt-4">
            <Pagination
              total={pages}
              page={page}
              onChange={setPage}
              showControls
              color="primary"
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
