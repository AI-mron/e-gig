import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type {
  JobRequirements,
  ChatMessage,
  DemoBooking,
  ServerStatusResponse,
  ServiceCategory
} from '../types';
import { WORKERS } from '../data/workers';
import { explicitWorkerCount } from '../utils/requestCount';
import { matchWorkers } from '../utils/matching';
import { calculatePricing } from '../utils/pricing';
import { getTomorrowShortLabel, getNextSaturdayShortLabel } from '../utils/dates';

interface AppContextType {
  requirements: JobRequirements;
  updateRequirements: (updates: Partial<JobRequirements>) => void;
  messages: ChatMessage[];
  addMessage: (sender: 'user' | 'assistant', text: string, clarificationField?: keyof JobRequirements | null) => void;
  selectedWorkerIds: string[];
  toggleSelectWorker: (workerId: string) => void;
  clearSelection: () => void;
  serverStatus: ServerStatusResponse;
  isLoadingAi: boolean;
  activeBooking: DemoBooking | null;
  confirmBooking: () => DemoBooking | null;
  startNewRequest: () => void;
  loadPresetQuery: (presetText: string) => Promise<void>;
  processUserPrompt: (userPrompt: string) => Promise<void>;
}

const STORAGE_KEY_REQ = 'egig_requirements_v1';
const STORAGE_KEY_MSGS = 'egig_messages_v1';
const STORAGE_KEY_SELECTION = 'egig_selection_v1';
const STORAGE_KEY_BOOKING = 'egig_booking_v1';

const defaultRequirements: JobRequirements = {
  rawQuery: '',
  category: null,
  location: '',
  requestedDate: '',
  requestedTime: '',
  workerCount: 1,
  budgetKes: null,
  durationDays: 1,
  taskDetails: '',
  preferNetwork: false
};

const initialWelcomeMessage: ChatMessage = {
  id: 'msg-welcome',
  sender: 'assistant',
  text: 'Hello! I am your e-gig hiring assistant. Tell me what work you need done, the location, your date, and your budget. I will match you with trusted local professionals or help you assemble a crew.',
  timestamp: 'Just now'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial state from sessionStorage / localStorage
  const [requirements, setRequirements] = useState<JobRequirements>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY_REQ);
      return saved ? JSON.parse(saved) : defaultRequirements;
    } catch {
      return defaultRequirements;
    }
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY_MSGS);
      return saved ? JSON.parse(saved) : [initialWelcomeMessage];
    } catch {
      return [initialWelcomeMessage];
    }
  });

  const [selectedWorkerIds, setSelectedWorkerIds] = useState<string[]>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY_SELECTION);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeBooking, setActiveBooking] = useState<DemoBooking | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKING);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [serverStatus, setServerStatus] = useState<ServerStatusResponse>({
    geminiAvailable: false,
    model: 'gemini-2.5-flash',
    mode: 'fallback'
  });

  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  // Sync to storage
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY_REQ, JSON.stringify(requirements));
  }, [requirements]);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY_MSGS, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY_SELECTION, JSON.stringify(selectedWorkerIds));
  }, [selectedWorkerIds]);

  useEffect(() => {
    if (activeBooking) {
      localStorage.setItem(STORAGE_KEY_BOOKING, JSON.stringify(activeBooking));
    } else {
      localStorage.removeItem(STORAGE_KEY_BOOKING);
    }
  }, [activeBooking]);

  // Check server status on load
  useEffect(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(data => {
        setServerStatus({
          geminiAvailable: !!data.geminiAvailable,
          model: data.model || 'gemini-2.5-flash',
          mode: data.mode || (data.geminiAvailable ? 'gemini' : 'fallback')
        });
      })
      .catch(() => {
        setServerStatus({
          geminiAvailable: false,
          model: 'gemini-2.5-flash',
          mode: 'fallback'
        });
      });
  }, []);

  const requestSequence = useRef(0);

  const updateRequirements = (updates: Partial<JobRequirements>) => {
    requestSequence.current++;
    setIsLoadingAi(false);
    const next = { ...requirements, ...updates };
    setRequirements(next);
    setSelectedWorkerIds(matchWorkers(next).suggestedCrewIds);
  };

  const addMessage = (
    sender: 'user' | 'assistant',
    text: string,
    clarificationField?: keyof JobRequirements | null
  ) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      clarificationField
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const toggleSelectWorker = (workerId: string) => {
    const isTv = requirements.category === 'tv_repair';
    const maxCount = isTv ? 1 : (requirements.workerCount || 4);

    setSelectedWorkerIds(prev => {
      if (isTv) {
        // Single selection mode
        if (prev.includes(workerId)) {
          return []; // toggle off
        }
        return [workerId]; // replace with new worker
      }

      // Crew selection mode
      if (prev.includes(workerId)) {
        return prev.filter(id => id !== workerId);
      }
      if (prev.length >= maxCount) {
        return prev; // already reached crew capacity
      }
      return [...prev, workerId];
    });
  };

  const clearSelection = () => {
    setSelectedWorkerIds([]);
  };

  const startNewRequest = () => {
    requestSequence.current++;
    setIsLoadingAi(false);
    setRequirements(defaultRequirements);
    setMessages([initialWelcomeMessage]);
    setSelectedWorkerIds([]);
    setActiveBooking(null);
    sessionStorage.removeItem(STORAGE_KEY_REQ);
    sessionStorage.removeItem(STORAGE_KEY_MSGS);
    sessionStorage.removeItem(STORAGE_KEY_SELECTION);
    localStorage.removeItem(STORAGE_KEY_BOOKING);
  };

  // Helper to call backend /api/interpret
  const callInterpretApi = async (userPrompt: string, updatedReq: JobRequirements) => {
    const sequence = ++requestSequence.current;
    setIsLoadingAi(true);
    try {
      const convoHistory = [
        ...messages.map(m => ({
          role: (m.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
          text: m.text
        })),
        { role: 'user' as const, text: userPrompt }
      ];

      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation: convoHistory,
          currentRequirements: updatedReq
        })
      });

      if (!res.ok) {
        throw new Error(`API responded with ${res.status}`);
      }

      const data = await res.json();
      if (sequence !== requestSequence.current) return;
      const interp = data.interpretation;
      const explicitCount = explicitWorkerCount(userPrompt, updatedReq.category === 'harvesting' && !!updatedReq.budgetKes);
      if (explicitCount !== null) { interp.workerCount = explicitCount; if (updatedReq.category && !/tv|television|appliance/i.test(userPrompt)) interp.category = updatedReq.category; }

      // Merge into requirements
      const merged: JobRequirements = {
        rawQuery: userPrompt,
        category: (interp.category as ServiceCategory) || updatedReq.category,
        location: interp.location || updatedReq.location,
        requestedDate: interp.requestedDate || updatedReq.requestedDate,
        requestedTime: interp.requestedTime || updatedReq.requestedTime,
        workerCount: interp.category === 'tv_repair' ? 1 : (interp.workerCount || updatedReq.workerCount || 4),
        budgetKes: interp.budgetKes !== null && interp.budgetKes !== undefined ? interp.budgetKes : updatedReq.budgetKes,
        durationDays: 1,
        taskDetails: interp.taskDetails || updatedReq.taskDetails || userPrompt,
        preferNetwork: interp.preferNetwork !== null && interp.preferNetwork !== undefined ? interp.preferNetwork : updatedReq.preferNetwork
      };

      setRequirements(merged);

      // Handle assistant reply
      if (interp.clarificationQuestion) {
        addMessage('assistant', interp.clarificationQuestion);
      } else if (data.explanationMessage) {
        addMessage('assistant', data.explanationMessage);
      } else if (merged.category === 'tv_repair') {
        addMessage('assistant', 'I found suitable technicians. Diagnosis is priced separately from repairs.');
      } else if (merged.category === 'harvesting') {
        addMessage('assistant', 'I found available harvesting workers in Nakuru. Rates cover one-day labour with a crew leader.');
      }

      // Recompute selection for every request, including changed crew size or budget.
      const matches = matchWorkers(merged);
      setSelectedWorkerIds(interp.clarificationQuestion ? [] : matches.suggestedCrewIds);
      if (!interp.clarificationQuestion && matches.isBudgetTooLow) {
        addMessage('assistant', `Your budget is below the minimum for ${merged.workerCount} worker(s). The minimum including the customer fee is KSh ${matches.minimumPossibleBudgetKes.toLocaleString('en-KE')}. Please adjust your budget or requirements.`);
      }
    } catch (err) {
      if (sequence !== requestSequence.current) return;
      console.error('Interpret failed:', err);
      addMessage(
        'assistant',
        'Could not reach AI assistant. Switched to guided demo mode — you can also adjust the fields on the right directly.'
      );
    } finally {
      if (sequence === requestSequence.current) setIsLoadingAi(false);
    }
  };

  const processUserPrompt = async (userPrompt: string) => {
    if (!userPrompt.trim()) return;
    addMessage('user', userPrompt);
    await callInterpretApi(userPrompt, requirements);
  };

  const loadPresetQuery = async (presetText: string) => {
    // Clear old state for new query
    setSelectedWorkerIds([]);
    addMessage('user', presetText);

    // Initial parsing for immediate responsiveness
    const isTv = presetText.toLowerCase().includes('tv');
    const initialReq: JobRequirements = {
      rawQuery: presetText,
      category: isTv ? 'tv_repair' : 'harvesting',
      location: isTv ? 'Kilimani' : 'Nakuru',
      requestedDate: isTv ? getTomorrowShortLabel() : getNextSaturdayShortLabel(),
      requestedTime: isTv ? 'Afternoon (2:00 PM – 5:00 PM)' : 'Full Day (7:00 AM – 5:00 PM)',
      workerCount: isTv ? 1 : 4,
      budgetKes: isTv ? 3000 : 6000,
      durationDays: 1,
      taskDetails: presetText,
      preferNetwork: false
    };

    setRequirements(initialReq);
    await callInterpretApi(presetText, initialReq);
  };

  const confirmBooking = (): DemoBooking | null => {
    const selectedWorkers = WORKERS.filter(w => selectedWorkerIds.includes(w.id));
    if (selectedWorkers.length === 0) return null;

    const pricing = calculatePricing(selectedWorkers);
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const locCode = (requirements.location || 'NAI').substring(0, 3).toUpperCase();
    const referenceId = `EG-${randomSuffix}-${locCode}`;

    const newBooking: DemoBooking = {
      referenceId,
      createdAt: new Date().toISOString(),
      requirements,
      workers: selectedWorkers,
      labourTotal: pricing.labourTotal,
      customerFee: pricing.customerFee,
      totalPayable: pricing.totalPayable,
      workerFee: pricing.workerFeeTotal,
      workerNetTotal: pricing.workerNetTotal,
      itemisedWorkers: pricing.items.map(item => ({
        workerId: item.workerId,
        name: item.workerName,
        role: item.role,
        isLeader: item.isLeader,
        labour: item.labourRate,
        workerFee: item.workerFee,
        netEarnings: item.workerNetEarnings
      }))
    };

    setActiveBooking(newBooking);
    return newBooking;
  };

  return (
    <AppContext.Provider
      value={{
        requirements,
        updateRequirements,
        messages,
        addMessage,
        selectedWorkerIds,
        toggleSelectWorker,
        clearSelection,
        serverStatus,
        isLoadingAi,
        activeBooking,
        confirmBooking,
        startNewRequest,
        loadPresetQuery,
        processUserPrompt
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
