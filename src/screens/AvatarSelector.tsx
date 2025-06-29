import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAtom } from "jotai";
import { screenAtom } from "@/store/screens";
import { selectedTherapistAtom, therapists } from "@/store/therapy";
import { ArrowLeft, Star, Award } from "lucide-react";

export const AvatarSelector = () => {
  const [, setScreenState] = useAtom(screenAtom);
  const [selectedTherapist, setSelectedTherapist] = useAtom(selectedTherapistAtom);

  const handleBack = () => {
    setScreenState({ currentScreen: "home" });
  };

  const handleSelectTherapist = (therapist: typeof therapists[0]) => {
    setSelectedTherapist(therapist);
    setScreenState({ currentScreen: "topicSelector" });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
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
        <div className="text-center">
          <h1 className="text-3xl font-bold gradient-text">Choose Your Therapist</h1>
          <p className="text-muted-foreground mt-2">
            Select the therapist who feels right for your needs
          </p>
        </div>
        <div className="w-20" /> {/* Spacer for centering */}
      </motion.div>

      {/* Therapist Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {therapists.map((therapist, index) => (
          <motion.div
            key={therapist.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`glass border-2 cursor-pointer transition-all duration-300 hover:shadow-xl hover:animate-glow ${
                selectedTherapist?.id === therapist.id 
                  ? 'ring-2 ring-primary border-primary' 
                  : 'hover:border-primary/50'
              }`}
              onClick={() => handleSelectTherapist(therapist)}
            >
              <CardHeader className="text-center pb-4">
                <div className="text-6xl mb-4 animate-float">
                  {therapist.avatar}
                </div>
                <CardTitle className="text-xl">{therapist.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{therapist.title}</p>
                
                <div className="flex items-center justify-center space-x-4 mt-3 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Award className="h-3 w-3" />
                    <span>{therapist.experience}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>4.9</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {therapist.description}
                </p>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Specialties:</h4>
                  <div className="flex flex-wrap gap-2">
                    {therapist.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-1">Approach:</h4>
                  <p className="text-xs text-muted-foreground">{therapist.approach}</p>
                </div>
                
                <Button 
                  className="w-full mt-4" 
                  variant="glow"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectTherapist(therapist);
                  }}
                >
                  Select {therapist.name.split(' ')[1]}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Help Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-sm text-muted-foreground"
      >
        <p>
          Not sure which therapist to choose? You can always switch to a different therapist 
          in future sessions based on your experience and needs.
        </p>
      </motion.div>
    </div>
  );
};