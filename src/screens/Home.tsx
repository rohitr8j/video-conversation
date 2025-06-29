import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAtom } from "jotai";
import { screenAtom } from "@/store/screens";
import { Heart, Shield, Clock, Users } from "lucide-react";

export const Home = () => {
  const [, setScreenState] = useAtom(screenAtom);

  const handleStartNow = () => {
    setScreenState({ currentScreen: "avatarSelector" });
  };

  const features = [
    {
      icon: <Heart className="h-6 w-6 text-red-500" />,
      title: "Compassionate Care",
      description: "AI therapists trained in evidence-based therapeutic approaches"
    },
    {
      icon: <Shield className="h-6 w-6 text-green-500" />,
      title: "Private & Secure",
      description: "Your conversations are confidential and encrypted"
    },
    {
      icon: <Clock className="h-6 w-6 text-blue-500" />,
      title: "Available 24/7",
      description: "Get support whenever you need it, day or night"
    },
    {
      icon: <Users className="h-6 w-6 text-purple-500" />,
      title: "Expert Therapists",
      description: "Choose from specialized AI therapists for your specific needs"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto text-center space-y-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <motion.div
          className="inline-block"
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 1, -1, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="text-6xl mb-4">🧠💙</div>
        </motion.div>
        
        <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
          Your Mental Health Journey Starts Here
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Connect with AI-powered therapists for professional, compassionate mental health support. 
          Choose your therapist, select your topic, and start your healing journey today.
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={handleStartNow}
            variant="glow"
            size="lg"
            className="text-lg px-8 py-6 rounded-full animate-pulse-glow"
          >
            Start Your Session Now
          </Button>
        </motion.div>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <Card className="glass border-2 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="glass rounded-2xl p-8 border-2"
      >
        <h2 className="text-2xl font-bold mb-4">Ready to Begin?</h2>
        <p className="text-muted-foreground mb-6">
          Take the first step towards better mental health. Our AI therapists are here to listen, 
          understand, and guide you through your journey.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleStartNow} variant="glow" size="lg">
            Choose Your Therapist
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </motion.div>
    </div>
  );
};