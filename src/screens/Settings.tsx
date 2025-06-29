import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAtom } from "jotai";
import { screenAtom } from "@/store/screens";
import { apiTokenAtom } from "@/store/tokens";
import { userProfileAtom } from "@/store/userProfile";
import { ArrowLeft, Key, Info, User, Heart, CheckCircle } from "lucide-react";
import { useState } from "react";

export const Settings = () => {
  const [, setScreenState] = useAtom(screenAtom);
  const [token, setToken] = useAtom(apiTokenAtom);
  const [userProfile, setUserProfile] = useAtom(userProfileAtom);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleBack = () => {
    setScreenState({ currentScreen: "home" });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (userProfile.fullName && userProfile.fullName.length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }
    
    if (userProfile.age !== null && (userProfile.age < 13 || userProfile.age > 100)) {
      newErrors.age = "Age must be between 13 and 100";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    // Save user profile
    localStorage.setItem('user-profile', JSON.stringify(userProfile));
    
    // Save API token
    if (token) {
      localStorage.setItem('tavus-token', token);
    }
    
    // Show success animation
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  const handleStartSession = () => {
    handleSave();
    setScreenState({ currentScreen: "avatarSelector" });
  };

  const updateProfile = (field: keyof typeof userProfile, value: any) => {
    setUserProfile(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
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

      {/* Personal Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass border-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Personal Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="full-name" className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <Input
                id="full-name"
                type="text"
                value={userProfile.fullName}
                onChange={(e) => updateProfile('fullName', e.target.value)}
                placeholder="Enter your full name"
                className={errors.fullName ? "border-red-500" : ""}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium mb-2">
                Age
              </label>
              <Input
                id="age"
                type="number"
                min="13"
                max="100"
                value={userProfile.age || ""}
                onChange={(e) => updateProfile('age', e.target.value ? parseInt(e.target.value) : null)}
                placeholder="Enter your age"
                className={errors.age ? "border-red-500" : ""}
              />
              {errors.age && (
                <p className="text-red-500 text-xs mt-1">{errors.age}</p>
              )}
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium mb-2">
                Gender
              </label>
              <select
                id="gender"
                value={userProfile.gender}
                onChange={(e) => updateProfile('gender', e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-medium mb-2">
                Preferred Language
              </label>
              <select
                id="language"
                value={userProfile.preferredLanguage}
                onChange={(e) => updateProfile('preferredLanguage', e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Italian">Italian</option>
                <option value="Portuguese">Portuguese</option>
                <option value="Chinese">Chinese</option>
                <option value="Japanese">Japanese</option>
                <option value="Korean">Korean</option>
              </select>
            </div>

            <div>
              <label htmlFor="therapy-goals" className="block text-sm font-medium mb-2">
                Therapy Goals
              </label>
              <Textarea
                id="therapy-goals"
                value={userProfile.therapyGoals}
                onChange={(e) => updateProfile('therapyGoals', e.target.value)}
                placeholder="e.g., reduce anxiety, gain confidence, improve relationships, manage stress..."
                className="min-h-[80px] resize-none"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* API Token Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
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
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Button 
          onClick={handleSave} 
          className="flex-1 relative overflow-hidden" 
          variant="outline"
          disabled={showSuccess}
        >
          {showSuccess ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center space-x-2"
            >
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Saved!</span>
            </motion.div>
          ) : (
            "Save Settings"
          )}
        </Button>
        
        <Button 
          onClick={handleStartSession} 
          className="flex-1 flex items-center space-x-2" 
          variant="glow"
        >
          <Heart className="h-4 w-4" />
          <span>Start Session</span>
        </Button>
      </motion.div>

      {/* Privacy Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="glass border-2">
          <CardHeader>
            <CardTitle>Privacy & Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              🔒 Your personal information and API token are stored locally in your browser and never sent to our servers.
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