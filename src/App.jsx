import React, { useState, useEffect, useRef } from 'react';
import { Send, MapPin, Search, Compass, Paintbrush, CheckCircle2 } from 'lucide-react';
import PosterCanvas from './PosterCanvas';
import './index.css';

function App() {
  const [location, setLocation] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [activeAgent, setActiveAgent] = useState(null); // 'research', 'layout', 'artist', 'done'
  
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      sender: 'orchestrator',
      text: "Hello! I am The Orchestrator. I can generate a beautiful, highly detailed 'Birds of Britain' style nature poster tailored to your area. Please tell me your location, and I will dispatch my swarm of subagents to research, layout, and illustrate the seasonal flora and fauna phenomena.",
      image: null
    }
  ]);
  
  const chatEndRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!location.trim()) return;

    // Add user message
    setChatHistory(prev => [...prev, { id: Date.now(), sender: 'user', text: location }]);
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

  // Simulate the swarm progression for the UI mockup
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
          text: "The Swarm has finished! Here is your true V2 Programmatic Nature Wheel poster with individual species artwork:",
          posterData: [
            { name: "Brent Goose", description: "Wintering flocks", startMonth: 0, endMonth: 2, ring: 2, imageUrl: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=200&h=200&fit=crop" },
            { name: "Common Seal", description: "Pupping season", startMonth: 5, endMonth: 7, ring: 3, imageUrl: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&h=200&fit=crop" },
            { name: "Sea Kale", description: "Blooming", startMonth: 4, endMonth: 5, ring: 0, imageUrl: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=200&h=200&fit=crop" },
            { name: "Roe Deer", description: "Rutting season", startMonth: 6, endMonth: 7, ring: 1, imageUrl: "https://images.unsplash.com/photo-1480044965905-02098d419e96?w=200&h=200&fit=crop" }
          ]
        }]);
        setActiveAgent('done');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [activeAgent]);

  const AgentStep = ({ agent, label, icon: Icon }) => {
    const isDone = 
      (agent === 'research' && ['layout', 'artist', 'done'].includes(activeAgent)) ||
      (agent === 'layout' && ['artist', 'done'].includes(activeAgent)) ||
      (agent === 'artist' && activeAgent === 'done');
      
    const isActive = agent === activeAgent;
    
    let stateClass = 'waiting';
    if (isActive) stateClass = 'active';
    if (isDone) stateClass = 'done';

    return (
      <div className={`agent-step ${stateClass}`}>
        <div className={`agent-icon-container ${isActive ? 'animate-pulse-slow' : ''}`}>
          {isDone ? <CheckCircle2 size={24} /> : <Icon size={24} />}
        </div>
        <div className="agent-step-info">
          <h3>{label}</h3>
          <p>{isDone ? 'Completed' : isActive ? 'Working...' : 'Waiting'}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      {/* Left Sidebar - Swarm Status */}
      <aside className="sidebar">
        <div className="sidebar-header animate-fade-in">
          <h1>Nature Wheel</h1>
          <p>AI Swarm Orchestrator V1</p>
        </div>

        <div className="agent-steps-container">
          <AgentStep 
            agent="research" 
            label="Research Agent" 
            icon={Search} 
          />
          <AgentStep 
            agent="layout" 
            label="Layout Agent" 
            icon={Compass} 
          />
          <AgentStep 
            agent="artist" 
            label="Artist Agent" 
            icon={Paintbrush} 
          />
        </div>
        
        <div className="sidebar-footer">
          Powered by Google Antigravity Native Subagents
        </div>
      </aside>

      {/* Right Content - Chat Interface */}
      <main className="chat-area">
        <div className="chat-history">
          {chatHistory.map((msg) => (
            <div key={msg.id} className={`chat-row ${msg.sender} animate-fade-in`}>
              <div className={`chat-bubble ${msg.sender}`}>
                {msg.text}
                {msg.image && (
                  <div className="message-image-container">
                    <img src={msg.image} alt="Nature Wheel Output" className="message-image" />
                  </div>
                )}
                {msg.posterData && (
                  <div className="message-poster-container" style={{ marginTop: '20px', width: '100%', maxWidth: '800px' }}>
                    <PosterCanvas data={msg.posterData} />
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="input-container">
          <form onSubmit={handleSend} className="input-form">
            <MapPin className="input-icon" size={24} />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your location (e.g. Chichester Harbour, UK)"
              className="glass-input"
              disabled={activeAgent && activeAgent !== 'done'}
            />
            <button 
              type="submit" 
              className="submit-btn"
              disabled={!location.trim() || (activeAgent && activeAgent !== 'done')}
            >
              <Send size={24} />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default App;
