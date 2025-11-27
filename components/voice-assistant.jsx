"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Mic, MicOff, Volume2, Loader2, Sparkles, X, Zap, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Category mapping for NLP parsing
const CATEGORY_KEYWORDS = {
  Food: [
    "food", "dinner", "lunch", "breakfast", "snack", "restaurant", "cafe", "pizza", "burger", 
    "dominos", "mcdonalds", "kfc", "swiggy", "zomato", "restaurant", "meal", "eat", "dining",
    "coffee", "tea", "drink", "beverage", "grocery", "groceries", "vegetables", "fruits"
  ],
  Transport: [
    "uber", "ola", "cab", "taxi", "bus", "train", "metro", "fuel", "petrol", "diesel",
    "gas", "auto", "rickshaw", "parking", "toll", "transport", "travel", "flight", "ticket"
  ],
  Entertainment: [
    "movie", "cinema", "netflix", "spotify", "amazon", "prime", "youtube", "gaming",
    "game", "entertainment", "music", "streaming", "subscription", "book", "magazine"
  ],
  Shopping: [
    "shopping", "clothes", "shirt", "shoes", "amazon", "flipkart", "online", "purchase",
    "buy", "bought", "clothing", "electronics", "gadget", "phone", "laptop"
  ],
  Healthcare: [
    "doctor", "medicine", "hospital", "pharmacy", "health", "medical", "clinic",
    "checkup", "treatment", "pills", "medicines", "healthcare"
  ],
  Bills: [
    "electricity", "water", "gas", "internet", "wifi", "phone", "mobile", "bill",
    "utility", "rent", "maintenance", "insurance"
  ],
  Education: [
    "course", "book", "education", "school", "college", "university", "tuition",
    "fees", "learning", "study", "training"
  ],
  Other: []
};

export function VoiceAssistant({ onVoiceResult, disabled = false, enableWakeWord = true, enableShortcut = true }) {
  const [isListening, setIsListening] = useState(false);
  const [isWakeWordListening, setIsWakeWordListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showModal, setShowModal] = useState(false);
  const recognitionRef = useRef(null);
  const wakeWordRecognitionRef = useRef(null);
  const [isSupported, setIsSupported] = useState(false);

  // Parse amount from voice input
  const parseAmount = (text) => {
    const patterns = [
      /₹\s*(\d+(?:,\d+)*(?:\.\d{1,2})?)/g,
      /rs\.?\s*(\d+(?:,\d+)*(?:\.\d{1,2})?)/gi,
      /rupees?\s*(\d+(?:,\d+)*(?:\.\d{1,2})?)/gi,
      /(\d+(?:,\d+)*(?:\.\d{1,2})?)\s*(?:₹|rs\.?|rupees?|bucks?|paisa)/gi,
      /(?:spent|paid|cost|costs|add|for)\s*(?:about\s*)?(\d+(?:,\d+)*(?:\.\d{1,2})?)/gi,
      /(?:^|\s)(\d+(?:,\d+)*(?:\.\d{1,2})?)(?:\s|$)/g
    ];

    for (const pattern of patterns) {
      const matches = Array.from(text.matchAll(pattern));
      if (matches.length > 0) {
        for (const match of matches) {
          const amount = match[1].replace(/,/g, '');
          const numAmount = parseFloat(amount);
          if (numAmount > 0 && numAmount < 1000000) {
            return numAmount;
          }
        }
      }
    }
    return null;
  };

  const categorizeExpense = (text) => {
    const lowerText = text.toLowerCase();
    
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword)) {
          return category;
        }
      }
    }
    return 'Other';
  };

  const extractDescription = (text, amount) => {
    let description = text
      .replace(/₹\s*\d+(?:,\d+)*(?:\.\d{1,2})?/gi, '')
      .replace(/rs\.?\s*\d+(?:,\d+)*(?:\.\d{1,2})?/gi, '')
      .replace(/rupees?\s*\d+(?:,\d+)*(?:\.\d{1,2})?/gi, '')
      .replace(/\d+(?:,\d+)*(?:\.\d{1,2})?\s*(?:₹|rs\.?|rupees?|bucks?)/gi, '')
      .replace(/\b\d+(?:,\d+)*(?:\.\d{1,2})?\b/g, '')
      .replace(/\b(?:add|spent|paid|cost|costs|for|on|at|to|the|a|an|in|of|and|or|buy|bought|purchase|purchased|hey|optex)\b/gi, ' ')
      .replace(/\s+/g, ' ')
      .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '')
      .trim();

    if (description.length < 3) {
      const contextMatches = text.match(/(?:for|at|from|to)\s+([a-zA-Z\s]+?)(?:\s|$|[^a-zA-Z])/gi);
      if (contextMatches && contextMatches.length > 0) {
        description = contextMatches[0]
          .replace(/^(?:for|at|from|to)\s+/gi, '')
          .trim();
      }
    }

    if (description.length < 3) {
      const words = text.toLowerCase().split(/\s+/).filter(word => 
        word.length > 2 && 
        !['add', 'spent', 'paid', 'cost', 'costs', 'for', 'the', 'and', 'rupees', 'rupee', 'hey', 'optex'].includes(word)
      );
      description = words.slice(0, 3).join(' ') || 'Voice expense';
    }

    description = description.charAt(0).toUpperCase() + description.slice(1);
    return description.length > 50 ? description.substring(0, 47) + '...' : description;
  };

  const processVoiceInput = async (text) => {
    try {
      console.log('Processing voice input:', text);
      
      const normalizedText = text.toLowerCase().trim();
      const amount = parseAmount(normalizedText);
      const category = categorizeExpense(normalizedText);
      const description = extractDescription(normalizedText, amount);

      if (!amount || amount <= 0) {
        toast.error("I couldn't detect a valid amount. Please try again.", {
          description: "Try saying: 'Add 500 rupees for dinner'"
        });
        return;
      }

      const result = {
        amount,
        category,
        description,
        rawText: text
      };

      console.log('Parsed voice result:', result);
      onVoiceResult(result);
      
      toast.success(`Transaction ready!`, {
        description: `₹${amount} for ${description}`,
        duration: 3000
      });

      setShowModal(false);
      setIsProcessing(false);
      setTranscript("");
    } catch (error) {
      console.error('Voice processing error:', error);
      toast.error("Failed to process voice input");
      setIsProcessing(false);
    }
  };

  // Main speech recognition setup
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      setIsSupported(!!SpeechRecognition);
      
      if (SpeechRecognition) {
        // Main recognition for transaction input
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-IN';
        
        recognition.onstart = () => {
          setIsListening(true);
          setTranscript("");
        };

        recognition.onresult = (event) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          const fullTranscript = finalTranscript || interimTranscript;
          setTranscript(fullTranscript);

          if (finalTranscript) {
            setIsProcessing(true);
            processVoiceInput(finalTranscript);
          }
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          setIsProcessing(false);
          
          switch (event.error) {
            case 'no-speech':
              toast.error("No speech detected. Please try again.");
              break;
            case 'audio-capture':
              toast.error("Microphone not accessible. Please check permissions.");
              break;
            case 'not-allowed':
              toast.error("Microphone permission denied.");
              break;
            default:
              toast.error(`Error: ${event.error}`);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
          if (!isProcessing) {
            setTranscript("");
          }
        };

        recognitionRef.current = recognition;

        // Wake word recognition
        if (enableWakeWord) {
          const wakeWordRecognition = new SpeechRecognition();
          wakeWordRecognition.continuous = true;
          wakeWordRecognition.interimResults = true;
          wakeWordRecognition.lang = 'en-IN';

          wakeWordRecognition.onresult = (event) => {
            const last = event.results.length - 1;
            const transcript = event.results[last][0].transcript.toLowerCase();
            
            console.log('Wake word listening:', transcript);
            
            // Check for wake word
            if (transcript.includes('hey optex') || transcript.includes('hey opt') || transcript.includes('hey op tex')) {
              console.log('Wake word detected!');
              toast.success("Hey! I'm listening...", { duration: 2000 });
              wakeWordRecognition.stop();
              setShowModal(true);
              setTimeout(() => {
                startListening();
              }, 500);
            }
          };

          wakeWordRecognition.onerror = (event) => {
            if (event.error !== 'no-speech' && event.error !== 'aborted') {
              console.error('Wake word error:', event.error);
            }
          };

          wakeWordRecognition.onend = () => {
            // Restart wake word detection if it stops
            if (isWakeWordListening && enableWakeWord) {
              setTimeout(() => {
                try {
                  wakeWordRecognition.start();
                } catch (e) {
                  console.log('Wake word restart delayed');
                }
              }, 1000);
            }
          };

          wakeWordRecognitionRef.current = wakeWordRecognition;

          // Auto-start wake word detection
          try {
            wakeWordRecognition.start();
            setIsWakeWordListening(true);
            console.log('Wake word detection started');
          } catch (e) {
            console.error('Failed to start wake word detection:', e);
          }
        }
      }
    }

    return () => {
      // Cleanup
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      if (wakeWordRecognitionRef.current) {
        try {
          wakeWordRecognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [enableWakeWord, isProcessing]);

  // Keyboard shortcut (Ctrl+Space)
  useEffect(() => {
    if (!enableShortcut) return;

    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.code === 'Space') {
        e.preventDefault();
        if (!showModal && !disabled) {
          setShowModal(true);
          toast.info("Voice assistant activated", { duration: 1500 });
          setTimeout(() => {
            startListening();
          }, 300);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [enableShortcut, showModal, disabled]);

  const startListening = useCallback(() => {
    if (!isSupported) {
      toast.error("Speech recognition not supported in your browser");
      return;
    }

    if (disabled) {
      toast.error("Voice input is currently disabled");
      return;
    }

    try {
      recognitionRef.current?.start();
      toast.info("Listening... Speak now!");
    } catch (error) {
      console.error('Error starting recognition:', error);
      toast.error("Failed to start voice recognition");
    }
  }, [isSupported, disabled]);

  const stopListening = useCallback(() => {
    try {
      recognitionRef.current?.stop();
      setIsListening(false);
      setTranscript("");
    } catch (error) {
      console.error('Error stopping recognition:', error);
    }
  }, []);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      setShowModal(true);
      setTimeout(() => {
        startListening();
      }, 300);
    }
  };

  if (!isSupported) {
    return (
      <div className="text-center p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          Voice input is not supported in your browser. Please use Chrome, Edge, or Safari.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Floating Voice Button */}
      <div className="relative">
        <Button
          type="button"
          onClick={handleToggleListening}
          disabled={disabled}
          className={cn(
            "relative h-12 px-6 rounded-full font-semibold transition-all duration-300",
            "bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700",
            "text-white shadow-lg hover:shadow-xl hover:scale-105",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            isListening && "animate-pulse ring-4 ring-purple-500/50"
          )}
        >
          <div className="flex items-center gap-2">
            {isListening ? (
              <>
                <MicOff className="w-5 h-5 animate-pulse" />
                <span>Listening...</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                <span>Start Voice Input</span>
                {enableShortcut && (
                  <Badge variant="outline" className="ml-1 bg-white/20 text-white border-white/30">
                    Ctrl+Space
                  </Badge>
                )}
              </>
            )}
          </div>
        </Button>
      </div>

      {/* Voice Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-200">
          <div className="relative w-full max-w-md mx-4 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 p-1 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="bg-background rounded-3xl p-8">
              {/* Close button */}
              <button
                onClick={() => {
                  setShowModal(false);
                  stopListening();
                }}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full mb-3">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Voice Assistant
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-2">OptEx is Listening</h3>
                <p className="text-sm text-muted-foreground">
                  Speak naturally about your transaction
                </p>
              </div>

              {/* Microphone Animation */}
              <div className="flex justify-center mb-6">
                <div className={cn(
                  "relative w-24 h-24 rounded-full flex items-center justify-center",
                  "bg-gradient-to-br from-purple-500 to-pink-500",
                  isListening && "animate-pulse"
                )}>
                  {isListening && (
                    <>
                      <div className="absolute inset-0 rounded-full bg-purple-500 animate-ping opacity-75" />
                      <div className="absolute inset-0 rounded-full bg-pink-500 animate-ping opacity-50" style={{ animationDelay: '0.5s' }} />
                    </>
                  )}
                  <Mic className="w-12 h-12 text-white relative z-10" />
                </div>
              </div>

              {/* Transcript Display */}
              {transcript && (
                <div className="mb-6 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">You said:</p>
                  <p className="text-base font-medium">{transcript}</p>
                </div>
              )}

              {/* Processing State */}
              {isProcessing && (
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                  <span className="text-sm font-medium">Processing...</span>
                </div>
              )}

              {/* Examples */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Try saying:
                </p>
                <div className="space-y-1">
                  <div className="text-xs bg-muted/50 rounded-lg p-2">
                    "Add 500 rupees for dinner at Domino's"
                  </div>
                  <div className="text-xs bg-muted/50 rounded-lg p-2">
                    "200 rupees uber ride to office"
                  </div>
                  <div className="text-xs bg-muted/50 rounded-lg p-2">
                    "Spent 150 on coffee at Starbucks"
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6">
                <Button
                  onClick={isListening ? stopListening : startListening}
                  disabled={disabled || isProcessing}
                  className="w-full h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-5 h-5 mr-2" />
                      Stop Listening
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5 mr-2" />
                      Start Listening
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
