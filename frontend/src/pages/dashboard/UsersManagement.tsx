import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  MoreVertical,
  Users,
  RefreshCw,
  Plus,
  Search,
  UserPlus,
  Edit,
  Trash2,
  Shield,
  User,
  Mail,
  Calendar,
} from "lucide-react";
import { RoleNavigation } from "@/components/RoleNavigation";
import { useUserStore } from "@/stores/userStore";
import { useCompanyStore } from "@/stores/companyStore";
import useAuthStore from "@/stores/authStore";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function UsersManagement() {
  const { createUser, isLoading, error: userError } = useUserStore();

  const { company, getCompanyByManagerId } = useCompanyStore();
  const { user } = useAuthStore();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Form state for creating new user
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });

  // Get company data for the current manager
  useEffect(() => {
    if (user?.id) {
      getCompanyByManagerId(user.id);
    }
  }, [user?.id, getCompanyByManagerId]);

  // Surface backend errors from store
  useEffect(() => {
    if (userError) {
      toast({ title: "User Error", description: userError, variant: "destructive" });
    }
  }, [userError, toast]);

  // Filter users to show only those from the manager's company
  const companyUsers = company?.employees || [];

  const filteredUsers = companyUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const handleRefresh = async () => {
    if (user?.id) {
      await getCompanyByManagerId(user.id);
    }
    console.log("Refreshed data:", {
      company: company?.companyName,
      employees: company?.employees?.length,
    });
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newUser.name.trim() ||
      !newUser.email.trim() ||
      !newUser.password.trim()
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // basic client-side validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      toast({ title: "Invalid Email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    if (newUser.password.length < 6) {
      toast({ title: "Weak Password", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }

    setIsCreating(true);
    try {
      const success = await createUser(newUser);
      if (success) {
        toast({
          title: "Success",
          description: "User created successfully!",
        });
        setNewUser({ name: "", email: "", password: "", role: "employee" });
        setIsCreateDialogOpen(false);
        console.log("User created successfully, refreshing data...");
        await handleRefresh();
        console.log("After refresh:", {
          companyEmployees: company?.employees?.length,
        });
      } else {
        toast({
          title: "Error",
          description: userError || "Failed to create user. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: userError || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditUser = (userData: User) => {
    // TODO: Implement edit functionality
    toast({
      title: "Edit User",
      description: `Edit functionality for ${userData.name} will be implemented soon.`,
    });
  };

  const handleDeleteUser = async (userData: User) => {
    if (window.confirm(`Are you sure you want to delete ${userData.name}?`)) {
      // TODO: Implement delete functionality
      toast({
        title: "Delete User",
        description: `Delete functionality for ${userData.name} will be implemented soon.`,
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "manager":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "staff":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "employee":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen">
      <RoleNavigation />
      <div className="pt-32 px-4 pb-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Users Management
            </h1>
            <p className="text-center text-foreground/70 mb-8">
              Manage users in your company
            </p>
          </motion.div>

          {/* Search and Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="glass-card p-6">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Search users by name or email..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 glass-card border-white/20"
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-blue-600/80 hover:bg-blue-600"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                  <Button
                    onClick={handleRefresh}
                    disabled={isLoading}
                    variant="outline"
                    className="border-white/20 hover:bg-white/10"
                  >
                    <RefreshCw
                      className={`h-4 w-4 mr-2 ${
                        isLoading ? "animate-spin" : ""
                      }`}
                    />
                    {isLoading ? "Loading..." : "Refresh"}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6"
          >
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Total Users</h3>
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-blue-400">
                {isLoading ? "..." : filteredUsers.length}
              </p>
              <p className="text-foreground/70 mt-2">In your company</p>
            </Card>

            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Staff Members</h3>
                <Shield className="h-6 w-6 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-green-400">
                {isLoading
                  ? "..."
                  : filteredUsers.filter((u) => u.role === "staff").length}
              </p>
              <p className="text-foreground/70 mt-2">Staff users</p>
            </Card>

            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Employees</h3>
                <User className="h-6 w-6 text-orange-400" />
              </div>
              <p className="text-3xl font-bold text-orange-400">
                {isLoading
                  ? "..."
                  : filteredUsers.filter((u) => u.role === "employee").length}
              </p>
              <p className="text-foreground/70 mt-2">Employee users</p>
            </Card>
          </motion.div>

          {/* Users Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-white/5">
                      <TableHead className="text-foreground">User</TableHead>
                      <TableHead className="text-foreground">Email</TableHead>
                      <TableHead className="text-foreground">Role</TableHead>
                      <TableHead className="text-foreground">
                        Date Joined
                      </TableHead>
                      <TableHead className="text-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      // Loading skeleton
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={`skeleton-${index}`}>
                          <TableCell>
                            <Skeleton className="h-4 w-32" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-40" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-16" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-24" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-8 w-8 rounded" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-8 text-foreground/70"
                        >
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user._id} className="hover:bg-white/5">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <User className="h-8 w-8 text-blue-400" />
                              <div>
                                <div className="font-semibold text-foreground">
                                  {user.name}
                                </div>
                                <div className="text-sm text-foreground/70">
                                  ID: {user._id?.slice(-8)}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4 text-blue-400" />
                              <span className="text-foreground">
                                {user.email}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-block px-3 py-1 text-sm rounded-full border ${getRoleColor(
                                user.role
                              )}`}
                            >
                              {user.role}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-orange-400" />
                              <span className="text-foreground">N/A</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-5 w-5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleEditUser(user)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteUser(user)}
                                  className="text-red-400"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md glass-card">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Add New User
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateUser} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter full name"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  className="pl-10 glass-card border-white/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="pl-10 glass-card border-white/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Shield className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  className="pl-10 glass-card border-white/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={newUser.role}
                onValueChange={(value) =>
                  setNewUser({ ...newUser, role: value })
                }
              >
                <SelectTrigger className="glass-card border-white/20">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                className="border-white/20 hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isCreating ||
                  !newUser.name.trim() ||
                  !newUser.email.trim() ||
                  !newUser.password.trim()
                }
                className="bg-blue-600/80 hover:bg-blue-600"
              >
                {isCreating ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <UserPlus className="h-4 w-4" />
                    <span>Create User</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
