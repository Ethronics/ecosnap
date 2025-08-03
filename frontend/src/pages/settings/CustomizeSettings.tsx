import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { RoleNavigation } from "@/components/RoleNavigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useToast } from "@/hooks/use-toast";
import {
  Settings,
  Thermometer,
  Droplets,
  Wind,
  Bell,
  Save,
  RotateCcw,
  Globe,
  Plus,
  Edit,
} from "lucide-react";
import { useDomainStore } from "@/stores/domainStore";
import { useConfigStore } from "@/stores/configStore";
import { useCompanyStore } from "@/stores/companyStore";
import useAuthStore from "@/stores/authStore";

const CustomizeSettings = () => {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { company, getCompanyByManagerId, addDomain } = useCompanyStore();
  const { domains, getDomains, isLoading: domainLoading } = useDomainStore();
  const { updateConfig, isLoading: configLoading } = useConfigStore();

  const [selectedDomain, setSelectedDomain] = useState("");
  const [settings, setSettings] = useState({
    threshold_temp: 22,
    threshold_humidity: 55,
    parameters: {
      temperature: {
        min: 18,
        max: 28,
        optimal: 22,
      },
      humidity: {
        min: 40,
        max: 70,
        optimal: 55,
      },
    },
  });

  // Add Domain Dialog State
  const [isAddDomainOpen, setIsAddDomainOpen] = useState(false);
  const [newDomainData, setNewDomainData] = useState({
    domainType: "",
    placeName: "",
  });

  // Domain Details State
  const [selectedDomainDetails, setSelectedDomainDetails] = useState<{
    domainId: string;
    place: string;
  } | null>(null);
  const [editingPlace, setEditingPlace] = useState("");
  const [isEditingPlace, setIsEditingPlace] = useState(false);

  const handleSave = async () => {
    if (!selectedDomain) {
      toast({
        title: "Domain Required",
        description: "Please select a domain before saving settings.",
        variant: "destructive",
      });
      return;
    }

    const success = await updateConfig({
      domain_id: selectedDomain,
      ...settings,
    });

    if (success) {
      toast({
        title: "Settings Saved",
        description: `Settings for ${
          domains.find((d) => d._id === selectedDomain)?.name
        } have been saved successfully.`,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setSettings({
      threshold_temp: 22,
      threshold_humidity: 55,
      parameters: {
        temperature: { min: 18, max: 28, optimal: 22 },
        humidity: { min: 40, max: 70, optimal: 55 },
      },
    });

    toast({
      title: "Settings Reset",
      description: "All settings have been restored to defaults.",
    });
  };

  const handleAddDomain = async () => {
    if (!newDomainData.domainType || !newDomainData.placeName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a domain type and enter a place name.",
        variant: "destructive",
      });
      return;
    }

    if (!company?._id) {
      toast({
        title: "Error",
        description: "Company information not found. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Find the domain ID from the selected domain type name
      const selectedDomain = domains.find(
        (d) => d.name === newDomainData.domainType
      );
      if (!selectedDomain) {
        toast({
          title: "Error",
          description: "Selected domain type not found.",
          variant: "destructive",
        });
        return;
      }

      // Add domain to company using the company store
      const success = await addDomain(
        company._id,
        selectedDomain._id,
        newDomainData.placeName
      );

      if (success) {
        toast({
          title: "Domain Added",
          description: `Successfully added ${newDomainData.placeName} as a ${newDomainData.domainType} domain.`,
        });

        // Reset form and close dialog
        setNewDomainData({ domainType: "", placeName: "" });
        setIsAddDomainOpen(false);

        // Refresh company data to get updated domains
        if (user?.id) {
          getCompanyByManagerId(user.id);
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to add domain. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add domain. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Load domains and company data on component mount
  useEffect(() => {
    getDomains();
    if (user?.id) {
      getCompanyByManagerId(user.id);
    }
  }, [getDomains, user?.id, getCompanyByManagerId]);

  // Set the company's domain when company data is loaded
  useEffect(() => {
    if (company?.domain?.reference?._id) {
      setSelectedDomain(company.domain.reference._id);
    }
  }, [company]);

  const handleDomainChange = (domainId: string) => {
    const domain = domains.find((d) => d._id === domainId);
    if (domain && domain.config) {
      setSelectedDomain(domain._id);
      setSettings(domain.config);
    }
  };

  const handleDomainSelect = (domainItem: {
    domainId: string;
    place: string;
  }) => {
    setSelectedDomainDetails(domainItem);
    setSelectedDomain(domainItem.domainId);
    setEditingPlace(domainItem.place);
    setIsEditingPlace(false);
  };

  const handlePlaceEdit = () => {
    setIsEditingPlace(true);
  };

  const handlePlaceSave = async () => {
    if (!selectedDomainDetails || !company?._id) return;

    try {
      // Here you would typically make an API call to update the place name
      // For now, we'll just update the local state
      setSelectedDomainDetails({
        ...selectedDomainDetails,
        place: editingPlace,
      });
      setIsEditingPlace(false);

      toast({
        title: "Place Updated",
        description: "Place name has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update place name. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePlaceCancel = () => {
    setEditingPlace(selectedDomainDetails?.place || "");
    setIsEditingPlace(false);
  };

  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <div className="min-h-screen">
        <RoleNavigation />

        <div className="pt-32 px-4 pb-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Customize Settings
              </h1>
              <p className="text-center text-foreground/70 mb-8">
                Configure environmental thresholds and system parameters
              </p>
            </motion.div>

            {/* Company Domain Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-6 w-6 text-blue-400" />
                    <h2 className="text-xl font-semibold">Company Domain</h2>
                  </div>

                  <Dialog
                    open={isAddDomainOpen}
                    onOpenChange={setIsAddDomainOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="glass-card bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Domain
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-card border-white/10">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                          Add New Domain
                        </DialogTitle>
                      </DialogHeader>

                      <div className="space-y-6 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="domain-type">Domain Type</Label>
                          <Select
                            value={newDomainData.domainType}
                            onValueChange={(value) =>
                              setNewDomainData((prev) => ({
                                ...prev,
                                domainType: value,
                              }))
                            }
                          >
                            <SelectTrigger className="glass-card border-white/20">
                              <SelectValue placeholder="Select domain type" />
                            </SelectTrigger>
                            <SelectContent>
                              {domains.map((domain) => (
                                <SelectItem
                                  key={domain._id}
                                  value={domain.name}
                                >
                                  {domain.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="place-name">Place Name</Label>
                          <Input
                            id="place-name"
                            placeholder="e.g., Inventory, Lab, Warehouse, Office"
                            value={newDomainData.placeName}
                            onChange={(e) =>
                              setNewDomainData((prev) => ({
                                ...prev,
                                placeName: e.target.value,
                              }))
                            }
                            className="glass-card border-white/20"
                          />
                        </div>

                        <div className="flex space-x-3 pt-4">
                          <Button
                            onClick={handleAddDomain}
                            className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save Domain
                          </Button>
                          <Button
                            onClick={() => {
                              setNewDomainData({
                                domainType: "",
                                placeName: "",
                              });
                              setIsAddDomainOpen(false);
                            }}
                            variant="outline"
                            className="flex-1 border-white/20 hover:bg-white/10"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-2">
                  <Label>Current Domain</Label>
                  <div className="p-3 rounded-lg bg-white/10 border border-white/20">
                    <div className="font-medium text-white">
                      {company?.domain?.reference?.name || "Loading..."}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {company?.domain?.reference?.description ||
                        "Domain description"}
                    </div>
                  </div>
                </div>

                {/* Company Domains Buttons */}
                {company?.domains && company.domains.length > 0 && (
                  <div className="space-y-2">
                    <Label>Company Domains</Label>
                    <div className="flex flex-wrap gap-3">
                      {company.domains.map((domainItem, index) => (
                        <Button
                          key={index}
                          onClick={() => handleDomainSelect(domainItem)}
                          variant={
                            selectedDomain === domainItem.domainId
                              ? "default"
                              : "outline"
                          }
                          className={`${
                            selectedDomain === domainItem.domainId
                              ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                              : "bg-white/5 text-foreground/70 border-white/20"
                          }`}
                        >
                          <Globe className="h-4 w-4 mr-2" />
                          {domainItem.place}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Domain Details Section */}
                {selectedDomainDetails && (
                  <div className="space-y-4 mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Domain Details</h3>
                      <Button
                        onClick={handlePlaceEdit}
                        variant="outline"
                        size="sm"
                        className="border-white/20 hover:bg-white/10"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Edit Place
                      </Button>
                    </div>

                    {/* Place Editor */}
                    <div className="space-y-2">
                      <Label>Place Name</Label>
                      {isEditingPlace ? (
                        <div className="flex space-x-2">
                          <Input
                            value={editingPlace}
                            onChange={(e) => setEditingPlace(e.target.value)}
                            className="flex-1 glass-card border-white/20"
                          />
                          <Button
                            onClick={handlePlaceSave}
                            size="sm"
                            className="bg-green-500/80 hover:bg-green-500 text-white"
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={handlePlaceCancel}
                            size="sm"
                            variant="outline"
                            className="border-white/20 hover:bg-white/10"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="p-3 rounded-lg bg-white/10 border border-white/20">
                          <div className="font-medium text-white">
                            {selectedDomainDetails.place}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Domain Information */}
                    <div className="space-y-2">
                      <Label>Domain Information</Label>
                      <div className="p-3 rounded-lg bg-white/10 border border-white/20">
                        <div className="text-sm text-muted-foreground">
                          Domain ID: {selectedDomainDetails.domainId}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Type:{" "}
                          {domains.find(
                            (d) => d._id === selectedDomainDetails.domainId
                          )?.name || "Unknown"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Main Thresholds (based on Config.js) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="glass-card p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Settings className="h-6 w-6 text-green-400" />
                  <h2 className="text-xl font-semibold">Main Thresholds</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="threshold-temp">
                      Temperature Threshold (°C)
                    </Label>
                    <Input
                      id="threshold-temp"
                      type="number"
                      value={settings.threshold_temp}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          threshold_temp: Number(e.target.value),
                        }))
                      }
                      className="glass-card border-white/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="threshold-humidity">
                      Humidity Threshold (%)
                    </Label>
                    <Input
                      id="threshold-humidity"
                      type="number"
                      value={settings.threshold_humidity}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          threshold_humidity: Number(e.target.value),
                        }))
                      }
                      className="glass-card border-white/20"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Temperature Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="glass-card p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Thermometer className="h-6 w-6 text-red-400" />
                  <h2 className="text-xl font-semibold">
                    Temperature Controls
                  </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="temp-min">Minimum (°C)</Label>
                    <Input
                      id="temp-min"
                      type="number"
                      value={settings.parameters.temperature.min}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          parameters: {
                            ...prev.parameters,
                            temperature: {
                              ...prev.parameters.temperature,
                              min: Number(e.target.value),
                            },
                          },
                        }))
                      }
                      className="glass-card border-white/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="temp-optimal">Optimal (°C)</Label>
                    <Input
                      id="temp-optimal"
                      type="number"
                      value={settings.parameters.temperature.optimal}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          parameters: {
                            ...prev.parameters,
                            temperature: {
                              ...prev.parameters.temperature,
                              optimal: Number(e.target.value),
                            },
                          },
                        }))
                      }
                      className="glass-card border-white/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="temp-max">Maximum (°C)</Label>
                    <Input
                      id="temp-max"
                      type="number"
                      value={settings.parameters.temperature.max}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          parameters: {
                            ...prev.parameters,
                            temperature: {
                              ...prev.parameters.temperature,
                              max: Number(e.target.value),
                            },
                          },
                        }))
                      }
                      className="glass-card border-white/20"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Humidity Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="glass-card p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Droplets className="h-6 w-6 text-blue-400" />
                  <h2 className="text-xl font-semibold">Humidity Controls</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="humidity-min">Minimum (%)</Label>
                    <Input
                      id="humidity-min"
                      type="number"
                      value={settings.parameters.humidity.min}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          parameters: {
                            ...prev.parameters,
                            humidity: {
                              ...prev.parameters.humidity,
                              min: Number(e.target.value),
                            },
                          },
                        }))
                      }
                      className="glass-card border-white/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="humidity-optimal">Optimal (%)</Label>
                    <Input
                      id="humidity-optimal"
                      type="number"
                      value={settings.parameters.humidity.optimal}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          parameters: {
                            ...prev.parameters,
                            humidity: {
                              ...prev.parameters.humidity,
                              optimal: Number(e.target.value),
                            },
                          },
                        }))
                      }
                      className="glass-card border-white/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="humidity-max">Maximum (%)</Label>
                    <Input
                      id="humidity-max"
                      type="number"
                      value={settings.parameters.humidity.max}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          parameters: {
                            ...prev.parameters,
                            humidity: {
                              ...prev.parameters.humidity,
                              max: Number(e.target.value),
                            },
                          },
                        }))
                      }
                      className="glass-card border-white/20"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex space-x-4 justify-center"
            >
              <Button
                onClick={handleSave}
                className="bg-green-500/80 hover:bg-green-500 text-white px-8"
                disabled={!selectedDomain || configLoading}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>

              <Button
                onClick={handleReset}
                variant="outline"
                className="border-white/20 hover:bg-white/10 px-8"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CustomizeSettings;
