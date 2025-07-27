import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { MoreVertical, Plus } from "lucide-react";
import { RoleNavigation } from "@/components/RoleNavigation";

// Dummy data for demonstration
const initialEmployees = [
  {
    id: 1,
    name: "Bob Employee",
    email: "bob@company.com",
    profession: "Engineer",
  },
  {
    id: 2,
    name: "Carol Employee",
    email: "carol@company.com",
    profession: "Designer",
  },
];

export default function EmployeesManagement() {
  const [search, setSearch] = useState("");
  const [professionFilter, setProfessionFilter] = useState("");
  const [employees, setEmployees] = useState(initialEmployees);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    profession: "",
  });

  // Filter logic (simplified)
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase());
    const matchesProfession =
      !professionFilter || emp.profession === professionFilter;
    return matchesSearch && matchesProfession;
  });

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.profession)
      return;
    setEmployees([...employees, { id: Date.now(), ...newEmployee }]);
    setNewEmployee({ name: "", email: "", profession: "" });
    setDialogOpen(false);
  };

  return (
    <div className="pt-24 px-4 max-w-4xl mx-auto">
      <RoleNavigation />
      <div className="my-6 flex flex-col md:flex-row md:items-end md:space-x-4 space-y-2 md:space-y-0">
        <Input
          placeholder="Search employees by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 glass-card"
        />
        <Input
          placeholder="Filter by profession..."
          value={professionFilter}
          onChange={(e) => setProfessionFilter(e.target.value)}
          className="w-full md:w-1/4 glass-card"
        />
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto" variant="default">
              <Plus className="h-4 w-4 mr-2" /> Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Add New Employee</h2>
            <div className="space-y-3">
              <Input
                placeholder="Name"
                value={newEmployee.name}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, name: e.target.value })
                }
                className="glass-card"
              />
              <Input
                placeholder="Email"
                value={newEmployee.email}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, email: e.target.value })
                }
                className="glass-card"
              />
              <Input
                placeholder="Profession"
                value={newEmployee.profession}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, profession: e.target.value })
                }
                className="glass-card"
              />
              <Button className="w-full mt-2" onClick={handleAddEmployee}>
                Add
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Profession</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEmployees.map((emp) => (
            <TableRow key={emp.id}>
              <TableCell>{emp.name}</TableCell>
              <TableCell>{emp.email}</TableCell>
              <TableCell>{emp.profession}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
