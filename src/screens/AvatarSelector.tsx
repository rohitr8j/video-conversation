import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAtom } from "jotai";
import { screenAtom } from "@/store/screens";
import { selectedTherapistAtom, therapists } from "@/store/therapy";
import { ArrowLeft, Star, Award, Sparkles } from "lucide-react";

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

  const handleStartSession = (therapist: typeof therapists[0]) => {
    setSelectedTherapist(therapist);
    // Skip topic selector and go directly to video chat
    setScreenState({ currentScreen: "videoChat" });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
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
          <h1 className="text-3xl md:text-4xl font-bold gradient-text">Choose Your AI Therapist</h1>
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {therapists.map((therapist, index) => (
          <motion.div
            key={therapist.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.05 }}
            whileHover={{ 
              scale: 1.03, 
              y: -8,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
            className="group"
          >
            <Card 
              className={`glass border-2 cursor-pointer transition-all duration-300 hover:shadow-2xl relative overflow-hidden ${
                selectedTherapist?.id === therapist.id 
                  ? 'ring-2 ring-primary border-primary shadow-2xl' 
                  : 'hover:border-primary/50 hover:shadow-primary/20'
              }`}
              onClick={() => handleSelectTherapist(therapist)}
            >
              {/* Glowing background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Sparkle effect */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              </div>

              <CardHeader className="text-center pb-3 relative z-10">
                <motion.div 
                  className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300"
                  animate={{ 
                    rotate: [0, 2, -2, 0],
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {therapist.avatar}
                </motion.div>
                
                <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                  {therapist.name}
                </CardTitle>
                
                <p className="text-xs text-muted-foreground font-medium">
                  {therapist.title}
                </p>
                
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold mt-2 inline-block">
                  {therapist.specialty}
                </div>
                
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
              
              <CardContent className="space-y-4 relative z-10">
                <p className="text-xs text-muted-foreground leading-relaxed text-center">
                  {therapist.description}
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-xs">Specialties:</h4>
                  <div className="flex flex-wrap gap-1">
                    {therapist.specialties.slice(0, 3).map((specialty) => (
                      <span
                        key={specialty}
                        className="px-2 py-1 bg-secondary/50 text-secondary-foreground text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                    {therapist.specialties.length > 3 && (
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                        +{therapist.specialties.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    className="w-full group-hover:shadow-lg transition-all duration-300" 
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectTherapist(therapist);
                    }}
                  >
                    Select & Choose Topic
                  </Button>
                  
                  <Button 
                    className="w-full group-hover:shadow-xl group-hover:shadow-primary/25 transition-all duration-300" 
                    variant="glow"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartSession(therapist);
                    }}
                  >
                    Start Session Now
                  </Button>
                </div>
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
        className="text-center space-y-4"
      >
        <div className="glass rounded-lg p-6 border-2 max-w-3xl mx-auto">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">How It Works</h3>
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="space-y-2">
              <p><strong>Select & Choose Topic:</strong> Pick your therapist, then choose what you'd like to discuss</p>
              <p><strong>Start Session Now:</strong> Jump directly into a conversation with your chosen therapist</p>
            </div>
            <div className="space-y-2">
              <p><strong>All sessions are:</strong> Private, confidential, and powered by advanced AI</p>
              <p><strong>Available 24/7:</strong> Get support whenever you need it most</p>
            </div>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
          Not sure which therapist to choose? Each AI therapist is trained in their specialty area and can adapt to your unique needs. 
          You can always try different therapists in future sessions.
        </p>
      </motion.div>
    </div>
  );
};