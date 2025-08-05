import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import useAuthStore from "@/stores/authStore";
import { useCompanyStore } from "@/stores/companyStore";
import {
  X,
  Users,
  UserCheck,
  UserX,
  Search,
  Send,
  CheckCircle,
} from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface UserSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  alertTitle: string;
  onNotifyUsers: (selectedUserIds: string[]) => void;
}

const UserSelectionModal = ({
  isOpen,
  onClose,
  alertTitle,
  onNotifyUsers,
}: UserSelectionModalProps) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNotifying, setIsNotifying] = useState(false);

  const { user } = useAuthStore();
  const { company, getCompanyByManagerId } = useCompanyStore();

  // Fetch company data when modal opens
  useEffect(() => {
    if (isOpen && user?.id) {
      if (user.role === "manager") {
        getCompanyByManagerId(user.id);
      } else if (user.role === "staff") {
        // For staff, we'll need to get company data differently
        // This will be implemented in the next phase
      }
    }
  }, [isOpen, user?.id, user?.role, getCompanyByManagerId]);

  // Filter users based on role and search term
  const getFilteredUsers = (): User[] => {
    if (!company?.employees) return [];

    let filteredUsers = company.employees;

    // Filter by role based on current user's role
    if (user?.role === "staff") {
      // Staff can only see employees
      filteredUsers = filteredUsers.filter((emp) => emp.role === "employee");
    }
    // Manager can see all users (no additional filtering needed)

    // Filter by search term
    if (searchTerm) {
      filteredUsers = filteredUsers.filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredUsers;
  };

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    const filteredUsers = getFilteredUsers();
    const allUserIds = filteredUsers.map((u) => u._id);
    setSelectedUsers(allUserIds);
  };

  const handleDeselectAll = () => {
    setSelectedUsers([]);
  };

  const handleNotify = async () => {
    if (selectedUsers.length === 0) return;

    setIsNotifying(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    onNotifyUsers(selectedUsers);
    setIsNotifying(false);
    onClose();
    setSelectedUsers([]);
    setSearchTerm("");
  };

  const filteredUsers = getFilteredUsers();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="glass-card w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-blue-400" />
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Notify Users
                  </h2>
                  <p className="text-sm text-foreground/70">
                    Select users to notify about: {alertTitle}
                  </p>
                </div>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-foreground/70 hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Search and Controls */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-foreground/50" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 glass-card border-white/20"
                  />
                </div>
                <Button
                  onClick={handleSelectAll}
                  variant="outline"
                  size="sm"
                  className="glass-card border-blue-400/30 text-blue-400 hover:bg-blue-400/10"
                >
                  Select All
                </Button>
                <Button
                  onClick={handleDeselectAll}
                  variant="outline"
                  size="sm"
                  className="glass-card border-gray-400/30 text-gray-400 hover:bg-gray-400/10"
                >
                  Clear
                </Button>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground/70">
                  {filteredUsers.length} user
                  {filteredUsers.length !== 1 ? "s" : ""} found
                </span>
                <span className="text-blue-400">
                  {selectedUsers.length} selected
                </span>
              </div>
            </div>

            {/* User List */}
            <div className="flex-1 overflow-y-auto max-h-96">
              {filteredUsers.length === 0 ? (
                <div className="p-6 text-center">
                  <Users className="h-12 w-12 text-foreground/30 mx-auto mb-3" />
                  <p className="text-foreground/70">
                    {searchTerm
                      ? "No users found matching your search."
                      : "No users available."}
                  </p>
                </div>
              ) : (
                <div className="p-6 space-y-3">
                  {filteredUsers.map((user) => (
                    <Card
                      key={user._id}
                      className={`glass-card p-4 cursor-pointer transition-all ${
                        selectedUsers.includes(user._id)
                          ? "border-blue-400/50 bg-blue-400/10"
                          : "border-white/20 hover:border-white/30"
                      }`}
                      onClick={() => handleUserToggle(user._id)}
                    >
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={selectedUsers.includes(user._id)}
                          onChange={() => handleUserToggle(user._id)}
                          className="data-[state=checked]:bg-blue-400 data-[state=checked]:border-blue-400"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-foreground">
                                {user.name}
                              </h4>
                              <p className="text-sm text-foreground/70">
                                {user.email}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                user.role === "manager"
                                  ? "bg-purple-400/20 text-purple-400 border border-purple-400/30"
                                  : user.role === "staff"
                                  ? "bg-blue-400/20 text-blue-400 border border-blue-400/30"
                                  : "bg-green-400/20 text-green-400 border border-green-400/30"
                              }`}
                            >
                              {user.role}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-white/10">
              <div className="text-sm text-foreground/70">
                {selectedUsers.length > 0 && (
                  <span className="text-blue-400">
                    {selectedUsers.length} user
                    {selectedUsers.length !== 1 ? "s" : ""} will be notified
                  </span>
                )}
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="glass-card border-white/20 text-foreground/70 hover:text-foreground"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleNotify}
                  disabled={selectedUsers.length === 0 || isNotifying}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                >
                  {isNotifying ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Notifying...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Notifications
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserSelectionModal;
