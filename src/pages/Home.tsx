import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Crosshair, MousePointer2, Zap } from 'lucide-react';

function GameMode({ title, icon: Icon, description, to }: { 
  title: string; 
  icon: React.ElementType; 
  description: string;
  to: string;
}) {
  return (
    <Link to={to} className="block">
      <div className="bg-[#1e2a3f] p-6 rounded-lg hover:bg-[#2a3a5f] transition-colors">
        <Icon className="w-8 h-8 text-[#ff4757] mb-4" />
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </Link>
  );
}

function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6">Improve Your FPS Skills</h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          A free browser game specifically designed to improve the player's aim in various First Person Shooter games.
        </p>
        <Link
          to="/play/challenge"
          className="inline-flex items-center gap-2 bg-[#ff4757] hover:bg-[#ff5e6c] px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
        >
          Start Training
          <Target className="w-5 h-5" />
        </Link>
      </div>

      {/* Training Modes */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Training Modes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GameMode
            title="Challenge Mode"
            icon={Target}
            description="Test your skills with increasingly difficult target patterns and speeds."
            to="/play/challenge"
          />
          <GameMode
            title="Target Tracking"
            icon={MousePointer2}
            description="Improve your target tracking ability and aim accuracy through continuous target following."
            to="/play/tracking"
          />
          <GameMode
            title="Moving Targets"
            icon={MousePointer2}
            description="Practice tracking and leading shots with moving targets."
            to="/play/moving"
          />
          <GameMode
            title="Precision Training"
            icon={Target}
            description="Enhance your precise aiming ability and stability through small target training."
            to="/play/precision"
          />
          <GameMode
            title="Doubleshot Training"
            icon={Target}
            description="Improve your multi-target aiming ability with simultaneously appearing targets."
            to="/play/doubleshot"
          />
        </div>
      </div>

      {/* Introduction */}
      <div className="mb-16 bg-[#1e2a3f] rounded-lg p-8">
        <p className="text-lg leading-relaxed text-gray-300">
          Aim Trainer is a free browser game that is specifically designed to improve the player's aim in various First-Person Shooter games such as Fortnite, Counter-Strike: GO, and Call of Duty. Designed with only one goal in mind, to improve the aiming skill of the individual, Aim Trainer comes with a lot of customization options and different challenges that are specifically created to help the player improve different aspects of aiming. It is a tool custom made to help players become better at games like Rainbow Six Siege, Overwatch, PUBG and other First-Person Shooters.
        </p>
      </div>

      {/* Supported Games */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Supported Games</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <img src="/csgo.svg" 
               alt="Counter-Strike: Global Offensive" 
               className="h-16 object-contain opacity-75 hover:opacity-100 transition-opacity" />
          <img src="/fortnite.svg" 
               alt="Fortnite" 
               className="h-16 object-contain opacity-75 hover:opacity-100 transition-opacity" />
          <img src="/rainbow-6-siege.svg"
               alt="Rainbow Six Siege"
               className="h-16 object-contain opacity-75 hover:opacity-100 transition-opacity" />
          <img src="/apex-legends.svg" 
               alt="Apex Legends" 
               className="h-16 object-contain opacity-75 hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Game Description */}
      <div className="mb-16 bg-[#1e2a3f] rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-4">Improve Your FPS Skills</h2>
        <p className="text-lg leading-relaxed text-gray-300">
          The goal of Aim Trainer is to make the player improve at aiming and other different aspects of First-Person Shooter Games. While each and every game is different, FPS Games like Fortnite, Counter-Strike GO, Apex Legends and Rainbow Six Siege share similar mechanics and thus have similar skill requirements and Aim Trainer helps players improve on them.
        </p>
      </div>

      {/* Features */}
      <div>
        <h2 className="text-3xl font-bold mb-8">Why Choose Our Trainer?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#1e2a3f] p-8 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Practice Like the Pros</h3>
            <p className="text-gray-400">
              With Aim Trainer at your side and consistent practice, you'll improve your accuracy and aiming skills. The best eSport players in games like Overwatch, PUBG, Fortnite, and Call of Duty use similar training methods to hone their skills.
            </p>
          </div>
          <div className="bg-[#1e2a3f] p-8 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Different Challenges</h3>
            <p className="text-gray-400">
              Our trainer features multiple specialized challenges, each designed to improve specific aspects of aiming. From reflex training to accuracy improvement and multi-target shooting, every mode is crafted to enhance your FPS gaming performance.
            </p>
          </div>
          <div className="bg-[#1e2a3f] p-8 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Custom Challenge</h3>
            <p className="text-gray-400">
              Take control of your training with our Custom Challenge Mode. Customize target frequency, speed progression, and life count to create a practice session that perfectly matches your specific needs and skill level.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;