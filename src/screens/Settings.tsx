import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAtom } from "jotai";
import { screenAtom } from "@/store/screens";
import { apiTokenAtom } from "@/store/tokens";
import { userProfileAtom, saveUserProfile, UserProfile } from "@/store/userProfile";
import { ArrowLeft, Key, Info, User, CheckCircle, Play } from "lucide-react";
import { useState } from "react";

const genderOptions = [
  { value: "", label: "Select gender" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non-binary", label: "Non-binary" },
  { value: "other", label: "Other" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

const languageOptions = [
  { value: "English", label: "English" },
  { value: "Hindi", label: "Hindi" },
  { value: "Spanish", label: "Spanish" },
  { value: "French", label: "French" },
  { value: "German", label: "German" },
  { value: "Italian", label: "Italian" },
  { value: "Portuguese", label: "Portuguese" },
  { value: "Chinese", label: "Chinese" },
  { value: "Japanese", label: "Japanese" },
  { value: "Korean", label: "Korean" },
];

export const Settings = () => {
  const [, setScreenState] = useAtom(screenAtom);
  const [token, setToken] = useAtom(apiTokenAtom);
  const [userProfile, setUserProfile] = useAtom(userProfileAtom);
  
  const [localProfile, setLocalProfile] = useState<UserProfile>(userProfile);
  const [errors, setErrors] = useState<Partial<UserProfile>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleBack = () => {
    setScreenState({ currentScreen: "home" });
  };

  const validateProfile = (profile: UserProfile): Partial<UserProfile> => {
    const newErrors: Partial<UserProfile> = {};
    
    if (profile.fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }
    
    if (profile.age !== null && (profile.age < 13 || profile.age > 100)) {
      newErrors.age = "Age must be between 13 and 100";
    }
    
    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validateProfile(localProfile);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      setUserProfile(localProfile);
      saveUserProfile(localProfile);
      
      if (token) {
        localStorage.setItem('tavus-token', token);
      }
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleStartSession = () => {
    handleSave();
    if (Object.keys(validateProfile(localProfile)).length === 0) {
      setScreenState({ currentScreen: "avatarSelector" });
    }
  };

  const updateProfile = (field: keyof UserProfile, value: string | number | null) => {
    setLocalProfile(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
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

      {/* Success Message */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
        >
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <p className="text-green-800 dark:text-green-200 font-medium">
              Settings saved successfully!
            </p>
          </div>
        </motion.div>
      )}

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
          <CardContent className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="full-name" className="block text-sm font-medium mb-2">
                Full Name *
              </label>
              <Input
                id="full-name"
                type="text"
                value={localProfile.fullName}
                onChange={(e) => updateProfile('fullName', e.target.value)}
                placeholder="Enter your full name"
                className={errors.fullName ? "border-red-500" : ""}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Age and Gender Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="age" className="block text-sm font-medium mb-2">
                  Age *
                </label>
                <Input
                  id="age"
                  type="number"
                  min="13"
                  max="100"
                  value={localProfile.age || ""}
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
                  value={localProfile.gender}
                  onChange={(e) => updateProfile('gender', e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {genderOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Preferred Language */}
            <div>
              <label htmlFor="language" className="block text-sm font-medium mb-2">
                Preferred Language
              </label>
              <select
                id="language"
                value={localProfile.preferredLanguage}
                onChange={(e) => updateProfile('preferredLanguage', e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Therapy Goals */}
            <div>
              <label htmlFor="therapy-goals" className="block text-sm font-medium mb-2">
                Therapy Goals
              </label>
              <Textarea
                id="therapy-goals"
                value={localProfile.therapyGoals}
                onChange={(e) => updateProfile('therapyGoals', e.target.value)}
                placeholder="e.g., reduce anxiety, gain confidence, improve relationships, manage stress..."
                className="min-h-[100px] resize-none"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {localProfile.therapyGoals.length}/500 characters
              </p>
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
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Button onClick={handleSave} className="flex-1 sm:flex-none" variant="outline">
          Save Settings
        </Button>
        <Button 
          onClick={handleStartSession} 
          className="flex-1 sm:flex-none flex items-center space-x-2" 
          variant="glow"
          disabled={!token || localProfile.fullName.trim().length < 2}
        >
          <Play className="h-4 w-4" />
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
              🔒 Your API token and personal information are stored locally in your browser and never sent to our servers.
            </p>
            <p>
              🤝 All therapy sessions are conducted through Tavus's secure platform with end-to-end encryption.
            </p>
            <p>
              📝 Journal entries and personal data are stored locally on your device and are not shared with anyone.
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