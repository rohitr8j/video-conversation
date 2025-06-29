import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAtom } from "jotai";
import { screenAtom } from "@/store/screens";
import { apiTokenAtom } from "@/store/tokens";
import { ArrowLeft, Key, Info } from "lucide-react";

export const Settings = () => {
  const [, setScreenState] = useAtom(screenAtom);
  const [token, setToken] = useAtom(apiTokenAtom);

  const handleBack = () => {
    setScreenState({ currentScreen: "home" });
  };

  const handleSave = () => {
    if (token) {
      localStorage.setItem('tavus-token', token);
    }
    handleBack();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <Button
          variant="ghost"
          onClick={handleBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        <h1 className="text-3xl font-bold gradient-text">Settings</h1>
        <div className="w-20" />
      </motion.div>

      {/* API Token Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass border-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="h-5 w-5" />
              <span>Tavus API Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="api-token" className="block text-sm font-medium mb-2">
                API Token
              </label>
              <Input
                id="api-token"
                type="password"
                value={token || ""}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter your Tavus API token"
                className="font-mono"
              />
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    How to get your API token:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-blue-800 dark:text-blue-200">
                    <li>Visit <a href="https://platform.tavus.io" target="_blank" rel="noopener noreferrer" className="underline">platform.tavus.io</a></li>
                    <li>Create an account or sign in</li>
                    <li>Navigate to API Keys section</li>
                    <li>Generate a new API key</li>
                    <li>Copy and paste it here</li>
                  </ol>
                </div>
              </div>
            </div>

            <Button onClick={handleSave} className="w-full" variant="glow">
              Save Settings
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Privacy Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass border-2">
          <CardHeader>
            <CardTitle>Privacy & Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              🔒 Your API token is stored locally in your browser and never sent to our servers.
            </p>
            <p>
              🤝 All therapy sessions are conducted through Tavus's secure platform with end-to-end encryption.
            </p>
            <p>
              📝 Journal entries are stored locally on your device and are not shared with anyone.
            </p>
            <p>
              🛡️ We follow industry best practices to ensure your privacy and data security.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};