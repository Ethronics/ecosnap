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
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useDomainStore } from "@/stores/domainStore";
import { useConfigStore } from "@/stores/configStore";

const CustomizeSettings = () => {
  const { toast } = useToast();
  const {
    domains,
    createDomain,
    getDomains,
    isLoading: domainLoading,
  } = useDomainStore();
  const { updateConfig, isLoading: configLoading } = useConfigStore();

  const [domainName, setDomainName] = useState("");
  const [domainDescription, setDomainDescription] = useState("");
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

  const [open, setOpen] = useState(false);

  const handleAddDomain = async () => {
    if (!domainName.trim() || !domainDescription.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both domain name and description.",
        variant: "destructive",
      });
      return;
    }

    const success = await createDomain(domainName, domainDescription);

    if (success) {
      toast({
        title: "Domain Created",
        description: "New domain has been created successfully.",
      });
      setDomainName("");
      setDomainDescription("");
      setOpen(false);
      // Refresh domains list
      await getDomains();
    } else {
      toast({
        title: "Error",
        description: "Failed to create domain. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Load domains on component mount
  useEffect(() => {
    getDomains();
  }, [getDomains]);

  const handleDomainChange = (domainId: string) => {
    const domain = domains.find((d) => d._id === domainId);
    if (domain && domain.config) {
      setSelectedDomain(domain._id);
      setSettings(domain.config);
    }
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

            {/* add domain */}
            <div className="relative w-full max-w-md mx-auto mb-8">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full px-6 py-3 rounded-xl backdrop-blur-md bg-white/10 text-white font-semibold border border-white/10 shadow-md hover:bg-white/20 transition"
              >
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-300" />
                  Add New Domain
                </div>
                {open ? (
                  <ChevronUp className="h-5 w-5 text-white" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-white" />
                )}
              </button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="mt-3"
                  >
                    <Card className="glass-card p-6 shadow-xl backdrop-blur-lg bg-white/10 border border-white/10">
                      <div className="flex items-center space-x-3 mb-4">
                        <Globe className="h-6 w-6 text-blue-400" />
                        <h2 className="text-xl font-semibold text-white">
                          Add Domain
                        </h2>
                      </div>

                      <div className="space-y-3">
                        <Input
                          type="text"
                          placeholder="Enter domain name"
                          value={domainName}
                          onChange={(e) => setDomainName(e.target.value)}
                          className="bg-white/10 text-white border-white/20"
                        />
                        <Input
                          type="text"
                          placeholder="Enter domain description"
                          value={domainDescription}
                          onChange={(e) => setDomainDescription(e.target.value)}
                          className="bg-white/10 text-white border-white/20"
                        />
                      </div>

                      <Button
                        onClick={handleAddDomain}
                        className="mt-4 bg-green-500/80 hover:bg-green-500 text-white px-6 py-2 w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Domain
                      </Button>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Domain Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="glass-card p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Globe className="h-6 w-6 text-blue-400" />
                  <h2 className="text-xl font-semibold">Domain Selection</h2>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="domain-select">Select Domain</Label>
                  <Select
                    value={selectedDomain}
                    onValueChange={(value) => {
                      setSelectedDomain(value);
                      handleDomainChange(value);
                    }}
                  >
                    <SelectTrigger className="glass-card border-white/20">
                      <SelectValue placeholder="Choose a domain..." />
                    </SelectTrigger>
                    <SelectContent>
                      {domains.map((domain) => (
                        <SelectItem key={domain._id} value={domain._id}>
                          <div>
                            <div className="font-medium">{domain.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {domain.description}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
