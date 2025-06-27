"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, TestTube } from "lucide-react";
import { toast } from "sonner";

export const LdapSettings = () => {
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "testing"
  >("disconnected");
  const [loading, setLoading] = useState(false);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    server: "",
    port: "389",
    protocol: "ldap",
    baseDn: "",
    bindDn: "",
    bindPassword: "",
    searchFilter: "(objectClass=user)",
    attributes: "cn,mail,sAMAccountName,displayName,department",
    useSSL: false,
    validateCert: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      //   const { data, error } = await supabase
      //     .from("ldap_settings")
      //     .select("*")
      //     .maybeSingle();
      //   if (error && error.code !== "PGRST116") {
      //     throw error;
      //   }
      //   if (data) {
      //     setSettingsId(data.id);
      //     setSettings({
      //       server: data.server || "",
      //       port: data.port?.toString() || "389",
      //       protocol: data.protocol || "ldap",
      //       baseDn: data.base_dn || "",
      //       bindDn: data.bind_dn || "",
      //       bindPassword: data.bind_password || "",
      //       searchFilter: data.search_filter || "(objectClass=user)",
      //       attributes:
      //         data.attributes || "cn,mail,sAMAccountName,displayName,department",
      //       useSSL: data.use_ssl || false,
      //       validateCert: data.validate_cert !== false,
      //     });
      //   }
    } catch (error: any) {
      console.error("Error loading settings:", error);
      toast.error("Error loading settings");
    }
  };

  const testConnection = async () => {
    setConnectionStatus("testing");
    // Simulate connection test
    setTimeout(() => {
      if (settings.server && settings.baseDn) {
        setConnectionStatus("connected");
        toast.success("Connection successful");
      } else {
        setConnectionStatus("disconnected");
        toast.error("Connection failed");
      }
    }, 2000);
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      const settingsData = {
        server: settings.server,
        port: parseInt(settings.port),
        protocol: settings.protocol,
        base_dn: settings.baseDn,
        bind_dn: settings.bindDn,
        bind_password: settings.bindPassword,
        search_filter: settings.searchFilter,
        attributes: settings.attributes,
        use_ssl: settings.useSSL,
        validate_cert: settings.validateCert,
        updated_at: new Date().toISOString(),
      };

      if (settingsId) {
        // const { error } = await supabase
        //   .from("ldap_settings")
        //   .update(settingsData)
        //   .eq("id", settingsId);
        // if (error) throw error;
      } else {
        // const { data, error } = await supabase
        //   .from("ldap_settings")
        //   .insert([settingsData])
        //   .select()
        //   .single();
        // if (error) throw error;
        // setSettingsId(data.id);
      }

      toast.success("Settings saved successfully");
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast.error("Error saving settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                LDAP Server Configuration
                {connectionStatus === "connected" && (
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                )}
                {connectionStatus === "disconnected" && (
                  <Badge variant="destructive">
                    <XCircle className="w-3 h-3 mr-1" />
                    Disconnected
                  </Badge>
                )}
                {connectionStatus === "testing" && (
                  <Badge variant="secondary">
                    <TestTube className="w-3 h-3 mr-1" />
                    Testing...
                  </Badge>
                )}
              </CardTitle>
            </div>
            <Button
              onClick={testConnection}
              disabled={connectionStatus === "testing"}
            >
              Test Connection
            </Button>
          </div>
          <CardDescription>
            Configure your Active Directory LDAP server connection settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="server">LDAP Server</Label>
              <Input
                id="server"
                placeholder="ldap.company.com"
                value={settings.server}
                onChange={(e) =>
                  setSettings({ ...settings, server: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                type="number"
                value={settings.port}
                onChange={(e) =>
                  setSettings({ ...settings, port: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="protocol">Protocol</Label>
              <Select
                value={settings.protocol}
                onValueChange={(value) =>
                  setSettings({ ...settings, protocol: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select protocol" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="ldap">LDAP</SelectItem>
                  <SelectItem value="ldaps">LDAPS (SSL)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="baseDn">Base DN</Label>
              <Input
                id="baseDn"
                placeholder="DC=company,DC=com"
                value={settings.baseDn}
                onChange={(e) =>
                  setSettings({ ...settings, baseDn: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bindDn">Bind DN</Label>
              <Input
                id="bindDn"
                placeholder="CN=service,OU=users,DC=company,DC=com"
                value={settings.bindDn}
                onChange={(e) =>
                  setSettings({ ...settings, bindDn: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bindPassword">Bind Password</Label>
              <Input
                id="bindPassword"
                type="password"
                value={settings.bindPassword}
                onChange={(e) =>
                  setSettings({ ...settings, bindPassword: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="searchFilter">Search Filter</Label>
            <Input
              id="searchFilter"
              placeholder="(objectClass=user)"
              value={settings.searchFilter}
              onChange={(e) =>
                setSettings({ ...settings, searchFilter: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attributes">Attributes to Retrieve</Label>
            <Textarea
              id="attributes"
              placeholder="cn,mail,sAMAccountName,displayName,department"
              value={settings.attributes}
              onChange={(e) =>
                setSettings({ ...settings, attributes: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="useSSL"
                checked={settings.useSSL}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, useSSL: checked })
                }
              />
              <Label htmlFor="useSSL">Use SSL/TLS</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="validateCert"
                checked={settings.validateCert}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, validateCert: checked })
                }
              />
              <Label htmlFor="validateCert">Validate Certificate</Label>
            </div>
          </div>

          <Button onClick={saveSettings} className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Save LDAP Settings"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
