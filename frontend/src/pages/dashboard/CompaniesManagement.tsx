import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { RoleNavigation } from "@/components/RoleNavigation";
import { useToast } from "@/hooks/use-toast";
import { useCompanyStore } from "@/stores/companyStore";
import {
  Building,
  Search,
  Filter,
  Users,
  Globe,
  Shield,
  User,
  Edit,
  Trash2,
  Plus,
  Eye,
  Mail,
  Calendar,
} from "lucide-react";

interface Company {
  _id: string;
  companyName: string;
  manager: {
    reference: {
      _id: string;
      name: string;
      email: string;
      role: string;
    };
  };
  employees: Array<{
    _id: string;
    name: string;
    email: string;
    role: string;
  }>;
  domain: {
    reference: {
      _id: string;
      name: string;
      description: string;
    };
  };
  domains: Array<{
    domainId: string;
    place: string;
  }>;
  created_at: string;
}

const CompaniesManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [domainFilter, setDomainFilter] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Company store
  const {
    companies,
    getAllCompanies,
    isLoading: companyLoading,
  } = useCompanyStore();

  // Fetch companies on component mount
  useEffect(() => {
    getAllCompanies();
  }, [getAllCompanies]);

  // Filter companies based on search and domain filter
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.manager.reference.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      company.manager.reference.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesDomain =
      domainFilter === "all" || company.domain.reference.name === domainFilter;

    return matchesSearch && matchesDomain;
  });

  // Get unique domains for filter
  const uniqueDomains = Array.from(
    new Set(companies.map((company) => company.domain.reference.name))
  ).filter(Boolean); // Filter out any empty or null values

  const handleCompanyClick = (company: Company) => {
    setSelectedCompany(company);
    setIsDialogOpen(true);
  };

  const handleEditCompany = (company: Company) => {
    // TODO: Implement edit functionality
    toast({
      title: "Edit Company",
      description: `Edit functionality for ${company.companyName} will be implemented soon.`,
    });
  };

  const handleDeleteCompany = async (company: Company) => {
    if (
      window.confirm(`Are you sure you want to delete ${company.companyName}?`)
    ) {
      setIsLoading(true);
      try {
        // TODO: Implement delete functionality
        toast({
          title: "Delete Company",
          description: `Delete functionality for ${company.companyName} will be implemented soon.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete company.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
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
        return "bg-red-500/20 text-red-300 border-red-500/30";
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
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Companies Management
            </h1>
            <p className="text-center text-foreground/70 mb-8">
              Manage and oversee all registered companies
            </p>
          </motion.div>

          {/* Search and Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-card p-6 rounded-2xl"
          >
            <div className="grid md:grid-cols-3 gap-6">
              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search">Search Companies</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by company name, manager..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 glass-card border-white/20"
                  />
                </div>
              </div>

              {/* Domain Filter */}
              <div className="space-y-2">
                <Label htmlFor="domain-filter">Filter by Domain</Label>
                <Select value={domainFilter} onValueChange={setDomainFilter}>
                  <SelectTrigger className="glass-card border-white/20">
                    <SelectValue placeholder="All domains" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All domains</SelectItem>
                    {uniqueDomains.map((domain) => (
                      <SelectItem key={domain} value={domain}>
                        {domain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Stats */}
              <div className="space-y-2">
                <Label>Total Companies</Label>
                <div className="flex items-center space-x-2">
                  <Building className="h-6 w-6 text-orange-400" />
                  <span className="text-2xl font-bold text-orange-400">
                    {companyLoading ? "..." : filteredCompanies.length}
                  </span>
                  <span className="text-foreground/70">
                    of {companies.length} total
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Companies Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Company
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Manager
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Domain
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Employees
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {companyLoading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center">
                        <div className="animate-pulse">
                          <div className="h-4 bg-white/10 rounded w-3/4 mx-auto"></div>
                        </div>
                      </td>
                    </tr>
                  ) : filteredCompanies.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-8 text-center text-foreground/70"
                      >
                        No companies found
                      </td>
                    </tr>
                  ) : (
                    filteredCompanies.map((company) => (
                      <tr
                        key={company._id}
                        className="hover:bg-white/5 transition-colors cursor-pointer"
                        onClick={() => handleCompanyClick(company)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <Building className="h-8 w-8 text-blue-400" />
                            <div>
                              <div className="font-semibold text-foreground">
                                {company.companyName}
                              </div>
                              <div className="text-sm text-foreground/70">
                                ID: {company._id.slice(-8)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Shield className="h-4 w-4 text-amber-400" />
                            <div>
                              <div className="font-medium text-foreground">
                                {company.manager.reference.name}
                              </div>
                              <div className="text-sm text-foreground/70">
                                {company.manager.reference.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Globe className="h-4 w-4 text-green-400" />
                            <span className="text-foreground">
                              {company.domain.reference.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-orange-400" />
                            <span className="text-foreground">
                              {company.employees.length}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-red-400" />
                            <span className="text-foreground">
                              {formatDate(company.created_at)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-blue-400 hover:text-blue-300"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditCompany(company);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:text-red-300"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCompany(company);
                              }}
                              disabled={isLoading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Company Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto glass-card">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              {selectedCompany?.companyName}
            </DialogTitle>
          </DialogHeader>

          {selectedCompany && (
            <div className="space-y-6">
              {/* Company Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="glass-card p-4">
                  <h3 className="text-lg font-semibold mb-3 text-foreground">
                    Company Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-blue-400" />
                      <span className="text-foreground">
                        {selectedCompany.companyName}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-orange-400" />
                      <span className="text-foreground">
                        Created: {formatDate(selectedCompany.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-green-400" />
                      <span className="text-foreground">
                        Domain: {selectedCompany.domain.reference.name}
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="glass-card p-4">
                  <h3 className="text-lg font-semibold mb-3 text-foreground">
                    Manager Details
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-amber-400" />
                      <span className="text-foreground">
                        {selectedCompany.manager.reference.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-blue-400" />
                      <span className="text-foreground">
                        {selectedCompany.manager.reference.email}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-red-400" />
                      <span className="text-foreground">
                        Role: {selectedCompany.manager.reference.role}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Domain Details */}
              <Card className="glass-card p-4">
                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  Domain Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-green-400" />
                    <span className="text-foreground font-medium">
                      {selectedCompany.domain.reference.name}
                    </span>
                  </div>
                  <p className="text-foreground/70 ml-6">
                    {selectedCompany.domain.reference.description}
                  </p>
                </div>
              </Card>

              {/* Employees List */}
              <Card className="glass-card p-4">
                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  Team Members ({selectedCompany.employees.length})
                </h3>
                {selectedCompany.employees.length === 0 ? (
                  <p className="text-foreground/70">
                    No employees assigned yet.
                  </p>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedCompany.employees.map((employee) => (
                      <div
                        key={employee._id}
                        className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg"
                      >
                        <User className="h-5 w-5 text-orange-400" />
                        <div className="flex-1">
                          <div className="font-medium text-foreground">
                            {employee.name}
                          </div>
                          <div className="text-sm text-foreground/70">
                            {employee.email}
                          </div>
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full border ${getRoleColor(
                              employee.role
                            )}`}
                          >
                            {employee.role}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-white/20 hover:bg-white/10"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setIsDialogOpen(false);
                    handleEditCompany(selectedCompany);
                  }}
                  className="bg-blue-600/80 hover:bg-blue-600"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Company
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsDialogOpen(false);
                    handleDeleteCompany(selectedCompany);
                  }}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Company
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompaniesManagement;
