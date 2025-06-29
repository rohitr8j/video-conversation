import { useAtom } from "jotai";
import { screenAtom } from "./store/screens";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ThemeProvider } from "./components/ThemeProvider";
import {
  Home,
  AvatarSelector,
  TopicSelector,
  VideoChat,
  Journal,
  ThankYou,
  Settings,
} from "./screens";

function App() {
  const [{ currentScreen }] = useAtom(screenAtom);

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return <Home />;
      case "avatarSelector":
        return <AvatarSelector />;
      case "topicSelector":
        return <TopicSelector />;
      case "videoChat":
        return <VideoChat />;
      case "journal":
        return <Journal />;
      case "thankYou":
        return <ThankYou />;
      case "settings":
        return <Settings />;
      default:
        return <Home />;
    }
  };

  return (
    <ThemeProvider>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-colors duration-500">
        <div className="flex min-h-screen flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center p-4">
            {renderScreen()}
          </div>
          <Footer />
        </div>
      </main>
    </ThemeProvider>
  );
}

export default App;