import React, { useState, useEffect } from 'react';
import { Send, MapPin, Search, Compass, Paintbrush, ChevronRight, CheckCircle2 } from 'lucide-react';
import './index.css';

function App() {
  const [location, setLocation] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      sender: 'orchestrator',
      text: "Hello! I am The Orchestrator. I can generate a beautiful, highly detailed 'Birds of Britain' style nature poster tailored to your area. Please tell me your location, and I will dispatch my swarm of subagents to research, layout, and illustrate the seasonal flora and fauna phenomena.",
    }
  ]);
  const [activeAgent, setActiveAgent] = useState(null); // 'research', 'layout', 'artist', 'done'

  const handleSend = (e) => {
    e.preventDefault();
    if (!location.trim()) return;

    // Add user message
    const newChat = [...chatHistory, { id: Date.now(), sender: 'user', text: location }];
    setChatHistory(newChat);
    setIsStarted(true);
    setActiveAgent('research');
    
    // Simulate Orchestrator response
    setTimeout(() => {
      setChatHistory(prev => [...prev, {
        id: Date.now(),
        sender: 'orchestrator',
        text: `Excellent. I have dispatched the Nature Research Agent to investigate the seasonal flora and fauna phenomena around ${location}.`
      }]);
    }, 1000);

    setLocation('');
  };

  // Simulate the swarm progression for the V1 UI mockup
  useEffect(() => {
    if (activeAgent === 'research') {
      const timer = setTimeout(() => {
        setChatHistory(prev => [...prev, {
          id: Date.now(),
          sender: 'orchestrator',
          text: "The Research Agent has returned a detailed catalog of seasonal events (migrating birds, spawning fish, etc.). Dispatching the Layout Agent to map this onto a 12-month circular calendar SVG."
        }]);
        setActiveAgent('layout');
      }, 5000);
      return () => clearTimeout(timer);
    }
    
    if (activeAgent === 'layout') {
      const timer = setTimeout(() => {
        setChatHistory(prev => [...prev, {
          id: Date.now(),
          sender: 'orchestrator',
          text: "The Layout Agent has completed the structural wireframe. Dispatching the Artist Agent to generate the final gorgeous, realistic artwork using the layout as a prompt."
        }]);
        setActiveAgent('artist');
      }, 5000);
      return () => clearTimeout(timer);
    }

    if (activeAgent === 'artist') {
      const timer = setTimeout(() => {
        setChatHistory(prev => [...prev, {
          id: Date.now(),
          sender: 'orchestrator',
          text: "The Artist Agent has finished! Your beautiful Nature Wheel poster is ready. (In a fully connected V1, the image would appear here)."
        }]);
        setActiveAgent('done');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [activeAgent]);

  const AgentStep = ({ agent, label, icon: Icon, currentActive }) => {
    const isDone = 
      (agent === 'research' && ['layout', 'artist', 'done'].includes(currentActive)) ||
      (agent === 'layout' && ['artist', 'done'].includes(currentActive)) ||
      (agent === 'artist' && currentActive === 'done');
      
    const isActive = agent === currentActive;
    
    return (
      <div className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-500 ${isActive ? 'glass-panel border-accent scale-105' : isDone ? 'opacity-80' : 'opacity-40'}`}>
        <div className={`p-3 rounded-full ${isActive ? 'bg-accent text-bg-deep animate-pulse-slow' : isDone ? 'bg-accent/20 text-accent' : 'bg-glass-border text-text-secondary'}`}>
          {isDone ? <CheckCircle2 size={24} /> : <Icon size={24} />}
        </div>
        <div>
          <h3 className="font-serif font-semibold text-lg">{label}</h3>
          <p className="text-sm text-text-secondary opacity-80">
            {isDone ? 'Completed' : isActive ? 'Working...' : 'Waiting'}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Sidebar - Swarm Status */}
      <div className="w-full md:w-1/3 p-6 md:p-8 flex flex-col gap-8 border-b md:border-b-0 md:border-r border-glass-border">
        <div className="animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-serif text-accent mb-2">Nature Wheel</h1>
          <p className="text-text-secondary">AI Swarm Orchestrator V1</p>
        </div>

        <div className="flex-1 flex flex-col justify-center gap-4">
          <AgentStep 
            agent="research" 
            label="Research Agent" 
            icon={Search} 
            currentActive={activeAgent} 
          />
          <AgentStep 
            agent="layout" 
            label="Layout Agent" 
            icon={Compass} 
            currentActive={activeAgent} 
          />
          <AgentStep 
            agent="artist" 
            label="Artist Agent" 
            icon={Paintbrush} 
            currentActive={activeAgent} 
          />
        </div>
        
        <div className="mt-auto text-xs text-text-secondary opacity-60">
          Powered by Google Antigravity Native Subagents
        </div>
      </div>

      {/* Right Content - Chat Interface */}
      <div className="flex-1 flex flex-col h-screen p-4 md:p-8 relative">
        <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-6 pb-24">
          {chatHistory.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div className={`max-w-[80%] p-5 rounded-2xl ${
                msg.sender === 'user' 
                  ? 'bg-accent text-bg-deep rounded-tr-sm' 
                  : 'glass-panel rounded-tl-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-bg-deep via-bg-deep to-transparent">
          <form onSubmit={handleSend} className="max-w-3xl mx-auto relative group">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary opacity-50 transition-opacity group-focus-within:opacity-100 group-focus-within:text-accent" size={20} />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your location (e.g. Chichester Harbour, UK)"
              className="glass-input pl-12 pr-16 py-4 shadow-lg"
              disabled={activeAgent && activeAgent !== 'done'}
            />
            <button 
              type="submit" 
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-accent hover:bg-accent/10 transition-colors disabled:opacity-30"
              disabled={!location.trim() || (activeAgent && activeAgent !== 'done')}
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
