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

// Interface for domain structure based on Company.js schema
interface DomainItem {
  domainId: string | { _id: string; name: string; description: string };
  name: string;
  description: string;
  place: string;
  config: {
    threshold_temp: number;
    threshold_humidity: number;
    parameters: {
      temperature: {
        min: number;
        max: number;
        optimal: number;
      };
      humidity: {
        min: number;
        max: number;
        optimal: number;
      };
    };
    updated_at: string;
  };
}

const CustomizeSettings = () => {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { company, getCompanyByManagerId, addDomain, updateDomainPlace } =
    useCompanyStore();
  const { domains, getDomains, isLoading: domainLoading } = useDomainStore();
  const { updateConfig, isLoading: configLoading } = useConfigStore();

  const [selectedDomainIndex, setSelectedDomainIndex] = useState(0);
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

  // Get current selected domain
  const currentDomain = company?.domains?.[selectedDomainIndex];

  // Helper function to safely get domain name
  const getDomainName = (domain: DomainItem) => {
    // First check if we have the embedded name field
    if (typeof domain?.name === "string") return domain.name;
    // If not, check if domainId is populated and has a name
    if (typeof domain?.domainId === "object" && domain.domainId?.name)
      return domain.domainId.name;
    return "Unknown Domain";
  };

  // Helper function to safely get domain description
  const getDomainDescription = (domain: DomainItem) => {
    // First check if we have the embedded description field
    if (typeof domain?.description === "string") return domain.description;
    // If not, check if domainId is populated and has a description
    if (typeof domain?.domainId === "object" && domain.domainId?.description)
      return domain.domainId.description;
    return "No description";
  };

  // Helper function to safely get domain ID
  const getDomainId = (domain: DomainItem) => {
    if (typeof domain?.domainId === "string") return domain.domainId;
    if (typeof domain?.domainId === "object" && domain.domainId?._id)
      return domain.domainId._id;
    return "Unknown ID";
  };

  const handleSave = async () => {
    if (!currentDomain) {
      toast({
        title: "Domain Required",
        description: "Please select a domain before saving settings.",
        variant: "destructive",
      });
      return;
    }

    const success = await updateConfig({
      company_id: company?._id || "",
      domain_id: getDomainId(currentDomain),
      ...settings,
    });

    if (success) {
      toast({
        title: "Settings Saved",
        description: `Settings for ${getDomainName(currentDomain)} (${
          currentDomain.place
        }) have been saved successfully.`,
      });

      // Refresh company data to get updated config values
      if (user?.id) {
        await getCompanyByManagerId(user.id);
      }
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

  // Update settings when selected domain changes
  useEffect(() => {
    if (currentDomain?.config) {
      setSettings({
        threshold_temp: currentDomain.config.threshold_temp || 22,
        threshold_humidity: currentDomain.config.threshold_humidity || 55,
        parameters: currentDomain.config.parameters || {
          temperature: { min: 18, max: 28, optimal: 22 },
          humidity: { min: 40, max: 70, optimal: 55 },
        },
      });
    }
  }, [currentDomain]);

  const handleDomainSelect = (index: number) => {
    const selectedDomain = company?.domains?.[index];
    setSelectedDomainIndex(index);
    setSelectedDomainDetails({
      domainId: selectedDomain ? getDomainId(selectedDomain) : "",
      place: selectedDomain?.place || "",
    });
    setEditingPlace(selectedDomain?.place || "");
  };

  const handlePlaceEdit = () => {
    setIsEditingPlace(true);
  };

  const handlePlaceSave = async () => {
    if (!selectedDomainDetails || !company?._id) return;

    try {
      const success = await updateDomainPlace(
        company._id,
        selectedDomainDetails.domainId,
        editingPlace
      );

      if (success) {
        setSelectedDomainDetails({
          ...selectedDomainDetails,
          place: editingPlace,
        });
        setIsEditingPlace(false);

        toast({
          title: "Place Updated",
          description: "Place name has been updated successfully.",
        });

        // Refresh company data to get updated place value
        if (user?.id) {
          await getCompanyByManagerId(user.id);
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to update place name. Please try again.",
          variant: "destructive",
        });
      }
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
                NOTE: these setings are used for alerting system.
              </p>
            </motion.div>

            {/* Company Domains Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-6 w-6 text-blue-400" />
                    <h2 className="text-xl font-semibold">Company Domains</h2>
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

                {/* Company Domains Buttons */}
                {company?.domains && company.domains.length > 0 ? (
                  <div className="space-y-4">
                    <Label>Select Domain to Configure</Label>
                    <div className="flex flex-wrap gap-3">
                      {company.domains.map((domainItem, index) => (
                        <Button
                          key={index}
                          onClick={() => handleDomainSelect(index)}
                          variant={
                            selectedDomainIndex === index
                              ? "default"
                              : "outline"
                          }
                          className={`${
                            selectedDomainIndex === index
                              ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                              : "bg-white/5 text-foreground/70 border-white/20"
                          }`}
                        >
                          <Globe className="h-4 w-4 mr-2" />
                          {getDomainName(domainItem)} - {domainItem.place}
                        </Button>
                      ))}
                    </div>

                    {/* Current Domain Details */}
                    {currentDomain && (
                      <div className="space-y-4 mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">
                            Current Domain: {getDomainName(currentDomain)}
                          </h3>
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
                                onChange={(e) =>
                                  setEditingPlace(e.target.value)
                                }
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
                                {currentDomain.place}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Domain Information */}
                        <div className="space-y-2">
                          <Label>Domain Information</Label>
                          <div className="p-3 rounded-lg bg-white/10 border border-white/20">
                            <div className="text-sm text-muted-foreground">
                              Domain ID: {getDomainId(currentDomain)}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              Type: {getDomainName(currentDomain)}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              Description: {getDomainDescription(currentDomain)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No domains configured yet.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Add your first domain to start configuring settings.
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Settings Configuration - Only show if domain is selected */}
            {currentDomain && (
              <>
                {/* Main Thresholds (based on Config.js) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Card className="glass-card p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <Settings className="h-6 w-6 text-green-400" />
                      <h2 className="text-xl font-semibold">
                        Main Thresholds - {getDomainName(currentDomain)} (
                        {currentDomain.place})
                      </h2>
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
                      <h2 className="text-xl font-semibold">
                        Humidity Controls
                      </h2>
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
                    disabled={!currentDomain || configLoading}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings for {getDomainName(currentDomain)}
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
              </>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CustomizeSettings;
