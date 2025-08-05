import { useState, useEffect } from "react";
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
import { MoreVertical, Plus, Users, Building } from "lucide-react";
import { RoleNavigation } from "@/components/RoleNavigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import useAuthStore from "@/stores/authStore";
import { useCompanyStore } from "@/stores/companyStore";
import { useUserStore } from "@/stores/userStore";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/config/constant";
import axios from "axios";

export default function EmployeesManagement() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { toast } = useToast();

  // Auth and Company stores
  const { user } = useAuthStore();
  const {
    company,
    isLoading: companyLoading,
    getCompanyByManagerId,
  } = useCompanyStore();
  const { createUser, isLoading: isCreating } = useUserStore();

  // Fetch company data when component mounts
  useEffect(() => {
    if (user?.id) {
      getCompanyByManagerId(user.id);
    }
  }, [user?.id, getCompanyByManagerId]);

  // Filter employees by role "employee" and search criteria
  const filteredEmployees =
    company?.employees
      ?.filter((emp) => emp.role === "employee")
      ?.filter((emp) => {
        const matchesSearch =
          emp.name.toLowerCase().includes(search.toLowerCase()) ||
          emp.email.toLowerCase().includes(search.toLowerCase());
        return matchesSearch;
      }) || [];

  const handleAddEmployee = async () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const success = await createUser({
        name: newEmployee.name,
        email: newEmployee.email,
        password: newEmployee.password,
        role: "employee",
      });

      if (success) {
        toast({
          title: "Success",
          description: "Employee created successfully",
        });

        // Reset form and close dialog
        setNewEmployee({ name: "", email: "", password: "" });
        setDialogOpen(false);

        // Refresh company data to show the new employee
        if (user?.id) {
          await getCompanyByManagerId(user.id);
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to create employee",
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to create employee";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      const token = localStorage.getItem("envoinsight_token");
      await axios.delete(`${API_URL}/api/users/${employeeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: "Success",
        description: "Employee removed successfully",
      });

      // Refresh company data
      if (user?.id) {
        await getCompanyByManagerId(user.id);
      }
    } catch (error: unknown) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to remove employee";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen ">
      <RoleNavigation />
      <div className="pt-32 px-4 pb-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {companyLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-white/10 rounded mb-2"></div>
                <div className="h-6 bg-white/10 rounded w-64 mx-auto"></div>
              </div>
            ) : company ? (
              <>
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Users className="h-8 w-8 text-amber-400" />
                  <h1 className="text-3xl font-bold text-amber-400">
                    Employee Management
                  </h1>
                </div>
                <div className="flex items-center justify-center space-x-2 text-foreground/70">
                  <Building className="h-4 w-4" />
                  <span>{company.companyName}</span>
                  <span>•</span>
                  <span>{filteredEmployees.length} Employees</span>
                </div>
              </>
            ) : (
              <h1 className="text-3xl font-bold text-amber-400">
                Employee Management
              </h1>
            )}
            <p className="text-center text-foreground/70 mt-4">
              Manage your company's employee team
            </p>
          </motion.div>

          {/* Stats Card */}
          {company && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid md:grid-cols-3 gap-6"
            >
              <Card className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Total Employees</h3>
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
                <p className="text-3xl font-bold text-blue-400">
                  {filteredEmployees.length}
                </p>
                <p className="text-foreground/70 mt-2">Active team members</p>
              </Card>

              <Card className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Company</h3>
                  <Building className="h-6 w-6 text-green-400" />
                </div>
                <p className="text-xl font-bold text-green-400">
                  {company.companyName}
                </p>
                <p className="text-foreground/70 mt-2">Current organization</p>
              </Card>

              <Card className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Manager</h3>
                  <Users className="h-6 w-6 text-purple-400" />
                </div>
                <p className="text-xl font-bold text-purple-400">
                  {company.manager?.reference?.name || "Manager"}
                </p>
                <p className="text-foreground/70 mt-2">
                  {company.manager?.reference?.email || "No email"}
                </p>
              </Card>
            </motion.div>
          )}

          {/* Search and Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-6 rounded-2xl"
          >
            <div className="flex flex-col md:flex-row md:items-end md:space-x-4 space-y-2 md:space-y-0">
              <Input
                placeholder="Search employees by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-1/2 glass-card border-white/20"
              />
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  {/* <Button className="w-full md:w-auto bg-blue-500">
                    <Plus className="h-4 w-4 mr-2" /> Add Employee
                  </Button> */}
                </DialogTrigger>
                <DialogContent className="max-w-md w-full glass-card border-white/20">
                  <h2 className="text-lg font-semibold mb-4 text-foreground">
                    Add New Employee
                  </h2>
                  <div className="space-y-3">
                    <Input
                      placeholder="Name"
                      value={newEmployee.name}
                      onChange={(e) =>
                        setNewEmployee({ ...newEmployee, name: e.target.value })
                      }
                      className="glass-card border-white/20"
                    />
                    <Input
                      placeholder="Email"
                      value={newEmployee.email}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          email: e.target.value,
                        })
                      }
                      className="glass-card border-white/20"
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={newEmployee.password}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          password: e.target.value,
                        })
                      }
                      className="glass-card border-white/20"
                    />
                    <Button
                      className="w-full mt-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                      onClick={handleAddEmployee}
                      disabled={isCreating}
                    >
                      {isCreating ? "Creating..." : "Add Employee"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>

          {/* Employees Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-card p-6 rounded-2xl"
          >
            {companyLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-white/10 rounded"></div>
                <div className="h-8 bg-white/10 rounded"></div>
                <div className="h-8 bg-white/10 rounded"></div>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-foreground/40 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground/60 mb-2">
                  No employees found
                </h3>
                <p className="text-foreground/40">
                  {search
                    ? "Try adjusting your search criteria"
                    : "Add your first employee to get started"}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/20">
                    <TableHead className="text-foreground/80">Name</TableHead>
                    <TableHead className="text-foreground/80">Email</TableHead>
                    <TableHead className="text-foreground/80">Role</TableHead>
                    {/* <TableHead className="text-foreground/80">
                      Actions
                    </TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((emp) => (
                    <TableRow
                      key={emp._id}
                      className="border-white/10 hover:bg-white/5"
                    >
                      <TableCell className="text-foreground">
                        {emp.name}
                      </TableCell>
                      <TableCell className="text-foreground/80">
                        {emp.email}
                      </TableCell>
                      <TableCell>
                        <span className="inline-block px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-full">
                          {emp.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-foreground/60 hover:text-foreground"
                            >
                              <MoreVertical className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="glass-card border-white/20"
                          >
                            <DropdownMenuItem className="text-foreground/80 hover:bg-white/10">
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-400 hover:bg-red-500/10"
                              onClick={() => handleDeleteEmployee(emp._id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
