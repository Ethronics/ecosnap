import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

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
} from "lucide-react";
import { useDomainStore } from "@/stores/domainStore";
import { useConfigStore } from "@/stores/configStore";
import { useCompanyStore } from "@/stores/companyStore";
import useAuthStore from "@/stores/authStore";

const CustomizeSettings = () => {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { company, getCompanyByManagerId } = useCompanyStore();
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
                <div className="flex items-center space-x-3 mb-6">
                  <Globe className="h-6 w-6 text-blue-400" />
                  <h2 className="text-xl font-semibold">Company Domain</h2>
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
