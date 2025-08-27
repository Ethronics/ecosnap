import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { RoleNavigation } from "@/components/RoleNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  Building2,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import { usePaymentStore } from "@/stores/paymentStore";
import { useCompanyStore } from "@/stores/companyStore";
import { usePlanStore } from "@/stores/planStore";
import { useToast } from "@/hooks/use-toast";

// Types for payment data
interface PaymentData {
  _id: string;
  companyId: string;
  planId: string;
  managerId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionId: string;
  status: "completed" | "pending" | "failed";
  createdAt: string;
  updatedAt: string;
}

interface FormattedPayment {
  id: string;
  companyName: string;
  plan: string;
  amount: number;
  status: string;
  paymentMethod: string;
  date: string;
  transactionId: string;
  manager: string;
  email: string;
  currency: string;
  createdAt: string;
}

const statusColors = {
  completed: "bg-green-500/20 text-green-600",
  pending: "bg-yellow-500/20 text-yellow-600",
  failed: "bg-red-500/20 text-red-600",
};

const planColors = {
  Free: "bg-gray-500/20 text-gray-600",
  Pro: "bg-blue-500/20 text-blue-600",
  Premium: "bg-purple-500/20 text-purple-600",
};

const paymentMethodIcons = {
  card: CreditCard,
  bank_transfer: Building2,
  mobile_money: DollarSign,
};

export const Payments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");

  const { toast } = useToast();
  const {
    payments,
    getAllPayments,
    isLoading: paymentsLoading,
  } = usePaymentStore();
  const {
    companies,
    getAllCompanies,
    isLoading: companiesLoading,
    error: companiesError,
  } = useCompanyStore();
  const {
    plans,
    isLoading: plansLoading,
    getPlans,
    error: plansError,
  } = usePlanStore();

  // Check if all data is loaded
  const isDataLoaded =
    companies.length > 0 &&
    plans.length > 0 &&
    !companiesLoading &&
    !plansLoading;

  // Debug logging
  console.log("Payments Debug:", {
    payments: payments.length,
    companies: companies.length,
    plans: plans.length,
    companiesLoading,
    plansLoading,
    isDataLoaded,
  });

  // Check authentication
  const isAuthenticated = !!localStorage.getItem("envoinsight_token");

  // Fetch data on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      console.log("User not authenticated, skipping data fetch");
      return;
    }

    console.log("Fetching data...");

    // Force fetch all data immediately
    const fetchData = async () => {
      try {
        console.log("Starting data fetch...");

        // Fetch each separately to see which one fails
        console.log("Fetching payments...");
        await getAllPayments();
        console.log("Payments fetched, count:", payments.length);

        console.log("Fetching companies...");
        await getAllCompanies();
        console.log("Companies fetched, count:", companies.length);

        console.log("Fetching plans...");
        await getPlans();
        console.log("Plans fetched, count:", plans.length);

        console.log("Data fetch completed");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [getAllPayments, getAllCompanies, getPlans, isAuthenticated]);

  // Monitor data changes
  useEffect(() => {
    console.log("Data changed:", {
      payments: payments.length,
      companies: companies.length,
      plans: plans.length,
    });

    // Debug: Show payment structure if payments exist
    if (payments.length > 0) {
      console.log("First payment structure:", {
        payment: payments[0],
        hasCompanyId: "companyId" in payments[0],
        hasPlanId: "planId" in payments[0],
        companyId: payments[0].companyId,
        planId: payments[0].planId,
        companyIdType: typeof payments[0].companyId,
        planIdType: typeof payments[0].planId,
      });
    }

    // Debug: Show company structure if companies exist
    if (companies.length > 0) {
      console.log("First company structure:", {
        company: companies[0],
        hasId: "_id" in companies[0],
        hasCompanyName: "companyName" in companies[0],
        id: companies[0]._id,
        companyName: companies[0].companyName,
      });
    }

    // Debug: Show plan structure if plans exist
    if (plans.length > 0) {
      console.log("First plan structure:", {
        plan: plans[0],
        hasId: "_id" in plans[0],
        hasName: "name" in plans[0],
        id: plans[0]._id,
        name: plans[0].name,
      });
    }
  }, [payments, companies, plans]);

  // Format payment data for display
  const formatPaymentData = (payment: PaymentData): FormattedPayment => {
    const company = companies.find((c) => c._id === payment.companyId);
    const plan = plans.find((p) => p._id === payment.planId);

    // Debug logging for individual payment formatting
    console.log("Formatting payment:", {
      paymentId: payment._id,
      companyId: payment.companyId,
      planId: payment.planId,
      foundCompany: company ? company.companyName : "NOT FOUND",
      foundPlan: plan ? plan.name : "NOT FOUND",
      companiesCount: companies.length,
      plansCount: plans.length,
      // Show all available companies and plans for debugging
      availableCompanies: companies.map((c) => ({
        _id: c._id,
        name: c.companyName,
      })),
      availablePlans: plans.map((p) => ({ _id: p._id, name: p.name })),
      // Show the actual payment data
      paymentData: payment,
    });

    return {
      id: payment._id,
      companyName: company?.companyName || "Unknown Company",
      plan: plan?.name || "Unknown Plan",
      amount: payment.amount,
      status: payment.status,
      paymentMethod: payment.paymentMethod,
      date: new Date(payment.createdAt).toLocaleDateString(),
      transactionId: payment.transactionId,
      manager: company?.manager?.reference?.name || "Unknown Manager",
      email: company?.manager?.reference?.email || "Unknown Email",
      currency: payment.currency,
      createdAt: payment.createdAt,
    };
  };

  // Only format payments when all required data is available
  const filteredPayments = useMemo(() => {
    if (companies.length === 0 || plans.length === 0) {
      console.log("Cannot format payments - missing data:", {
        companiesCount: companies.length,
        plansCount: plans.length,
      });
      return [];
    }

    const formattedPayments = payments.map(formatPaymentData);

    // Debug: Check if any payments have "Unknown" values
    const unknownPayments = formattedPayments.filter(
      (p) =>
        p.companyName === "Unknown Company" ||
        p.plan === "Unknown Plan" ||
        p.manager === "Unknown Manager"
    );

    if (unknownPayments.length > 0) {
      console.error("Found payments with unknown values:", unknownPayments);
      console.error(
        "Available companies:",
        companies.map((c) => ({ _id: c._id, name: c.companyName }))
      );
      console.error(
        "Available plans:",
        plans.map((p) => ({ _id: p._id, name: p.name }))
      );
    }

    return formattedPayments.filter((payment) => {
      const matchesSearch =
        payment.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || payment.status === statusFilter;
      const matchesPlan = planFilter === "all" || payment.plan === planFilter;

      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [payments, companies, plans, searchTerm, statusFilter, planFilter]);

  // Calculate statistics
  const totalRevenue = filteredPayments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPayments = filteredPayments.filter(
    (p) => p.status === "pending"
  ).length;

  const completedPayments = filteredPayments.filter(
    (p) => p.status === "completed"
  ).length;

  const failedPayments = filteredPayments.filter(
    (p) => p.status === "failed"
  ).length;

  // Handle refresh
  const handleRefresh = () => {
    getAllPayments();
    getAllCompanies();
    // Also refresh plans data
    getPlans();
    toast({
      title: "Refreshed",
      description: "Payment data has been refreshed.",
    });
  };

  // Handle export (placeholder for now)
  const handleExport = () => {
    toast({
      title: "Export Feature",
      description: "Export functionality will be implemented soon.",
    });
  };

  // Handle view payment details
  const handleViewPayment = (payment: FormattedPayment) => {
    toast({
      title: "Payment Details",
      description: `Viewing details for ${payment.transactionId}`,
    });
    // TODO: Implement payment details modal
  };

  return (
    <div className="min-h-screen bg-background">
      <RoleNavigation />

      <div className="pt-24 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  Payment Management
                </h1>
                <p className="text-foreground/60">
                  Monitor and manage all company payments and subscriptions
                </p>
              </div>
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="glass-card"
                disabled={paymentsLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${
                    paymentsLoading ? "animate-spin" : ""
                  }`}
                />
                Refresh
              </Button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground/60">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold text-green-500">
                      {totalRevenue.toLocaleString()} Birr
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground/60">
                      Completed Payments
                    </p>
                    <p className="text-2xl font-bold text-blue-500">
                      {completedPayments}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground/60">
                      Pending Payments
                    </p>
                    <p className="text-2xl font-bold text-yellow-500">
                      {pendingPayments}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground/60">
                      Failed Payments
                    </p>
                    <p className="text-2xl font-bold text-red-500">
                      {failedPayments}
                    </p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 mb-6"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/40 h-4 w-4" />
                  <Input
                    placeholder="Search companies, managers, or transaction IDs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={planFilter} onValueChange={setPlanFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Plans</SelectItem>
                    {plans.map((plan) => (
                      <SelectItem key={plan._id} value={plan.name}>
                        {plan.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleExport}
                className="glass-card bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </motion.div>

          {/* Payments Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card overflow-hidden"
          >
            {paymentsLoading || !isDataLoaded ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-foreground/60">
                  {paymentsLoading
                    ? "Loading payments..."
                    : "Loading company and plan data..."}
                </p>

                {/* Show raw data for debugging */}
                <div className="mt-6 text-left">
                  <h4 className="font-semibold mb-2">Debug Info:</h4>

                  {/* Error Display */}
                  {(companiesError || plansError) && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700">
                      <strong>API Errors:</strong>
                      {companiesError && <div>Companies: {companiesError}</div>}
                      {plansError && <div>Plans: {plansError}</div>}
                    </div>
                  )}

                  {/* Authentication Check */}
                  <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded text-yellow-700">
                    <strong>Authentication Status:</strong>
                    <div>
                      Token:{" "}
                      {localStorage.getItem("envoinsight_token")
                        ? "Present"
                        : "Missing"}
                    </div>
                    <div>
                      User:{" "}
                      {localStorage.getItem("envoinsight_user")
                        ? "Logged In"
                        : "Not Logged In"}
                    </div>
                  </div>

                  {/* Manual Retry Button */}
                  <div className="mb-4 text-center">
                    <Button
                      onClick={handleRefresh}
                      variant="outline"
                      className="bg-blue-500 text-white hover:bg-blue-600"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry Data Fetch
                    </Button>
                  </div>

                  {/* Individual API Test Buttons */}
                  <div className="mb-4 text-center space-x-2">
                    <Button
                      onClick={() => {
                        console.log("Testing payments API...");
                        getAllPayments();
                      }}
                      variant="outline"
                      size="sm"
                      className="bg-green-500 text-white hover:bg-green-600"
                    >
                      Test Payments API
                    </Button>
                    <Button
                      onClick={() => {
                        console.log("Testing companies API...");
                        getAllCompanies();
                      }}
                      variant="outline"
                      size="sm"
                      className="bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Test Companies API
                    </Button>
                    <Button
                      onClick={() => {
                        console.log("Testing plans API...");
                        getPlans();
                      }}
                      variant="outline"
                      size="sm"
                      className="bg-purple-500 text-white hover:bg-purple-600"
                    >
                      Test Plans API
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <strong>Payments:</strong> {payments.length}
                      {payments.length > 0 && (
                        <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                          {JSON.stringify(payments[0], null, 2)}
                        </pre>
                      )}
                    </div>
                    <div>
                      <strong>Companies:</strong> {companies.length}
                      {companies.length > 0 && (
                        <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                          {JSON.stringify(companies[0], null, 2)}
                        </pre>
                      )}
                    </div>
                    <div>
                      <strong>Plans:</strong> {plans.length}
                      {plans.length > 0 && (
                        <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                          {JSON.stringify(plans[0], null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>

                  {/* API Response Debug */}
                  <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                    <h4 className="font-semibold mb-2">API Response Debug:</h4>
                    <div className="space-y-2 text-xs">
                      <div>
                        <strong>Payments API Status:</strong>{" "}
                        {paymentsLoading
                          ? "Loading..."
                          : payments.length > 0
                          ? "Success"
                          : "No data"}
                      </div>
                      <div>
                        <strong>Companies API Status:</strong>{" "}
                        {companiesLoading
                          ? "Loading..."
                          : companies.length > 0
                          ? "Success"
                          : "No data"}
                      </div>
                      <div>
                        <strong>Plans API Status:</strong>{" "}
                        {plansLoading
                          ? "Loading..."
                          : plans.length > 0
                          ? "Success"
                          : "No data"}
                      </div>
                      <div>
                        <strong>Last Error:</strong>{" "}
                        {companiesError || plansError || "None"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-foreground/40 mb-4">
                  <DollarSign className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No payments found
                </h3>
                <p className="text-foreground/60">
                  {searchTerm || statusFilter !== "all" || planFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "No payments have been recorded yet"}
                </p>
                {/* Debug: Show raw payment data */}
                {payments.length > 0 && (
                  <div className="mt-4 p-4 bg-muted rounded-lg text-left">
                    <h4 className="font-semibold mb-2">
                      Debug: Raw Payment Data
                    </h4>
                    <pre className="text-xs overflow-auto">
                      {JSON.stringify(payments.slice(0, 2), null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => {
                    const PaymentMethodIcon =
                      paymentMethodIcons[
                        payment.paymentMethod as keyof typeof paymentMethodIcons
                      ] || DollarSign;

                    return (
                      <TableRow key={payment.id}>
                        <TableCell className="font-mono text-sm">
                          {payment.transactionId}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{payment.companyName}</p>
                            <p className="text-sm text-foreground/60">
                              {payment.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{payment.manager}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              planColors[
                                payment.plan as keyof typeof planColors
                              ] || "bg-gray-500/20 text-gray-600"
                            }
                          >
                            {payment.plan}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {payment.amount === 0
                              ? "Free"
                              : `${payment.amount.toLocaleString()} ${
                                  payment.currency
                                }`}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <PaymentMethodIcon className="h-4 w-4" />
                            <span className="text-sm capitalize">
                              {payment.paymentMethod.replace("_", " ")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              statusColors[
                                payment.status as keyof typeof statusColors
                              ]
                            }
                          >
                            {payment.status.charAt(0).toUpperCase() +
                              payment.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-foreground/40" />
                            <span className="text-sm">{payment.date}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewPayment(payment)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </motion.div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-center text-foreground/60"
          >
            {!paymentsLoading && isDataLoaded && (
              <>
                Showing {filteredPayments.length} of {payments.length} payments
                {searchTerm ||
                  statusFilter !== "all" ||
                  (planFilter !== "all" && (
                    <span className="ml-2 text-primary">
                      (filtered results)
                    </span>
                  ))}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
