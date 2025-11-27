"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Volume2, Loader2 } from "lucide-react";
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

// Currency symbols and patterns
const CURRENCY_PATTERNS = {
  INR: ["₹", "rupees", "rupee", "rs", "inr"],
  USD: ["$", "dollars", "dollar", "usd"],
  EUR: ["€", "euros", "euro", "eur"],
  GBP: ["£", "pounds", "pound", "gbp"]
};

export function VoiceInput({ onVoiceResult, disabled = false, className }) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [confidence, setConfidence] = useState(0);
  const recognitionRef = useRef(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if Speech Recognition is supported
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      setIsSupported(!!SpeechRecognition);
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-IN'; // English (India) for better Hindi-English mix
        
        recognition.onstart = () => {
          setIsListening(true);
          setTranscript("");
          toast.info("Listening... Speak now!");
        };

        recognition.onresult = (event) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
              setConfidence(event.results[i][0].confidence);
            } else {
              interimTranscript += transcript;
            }
          }

          const fullTranscript = finalTranscript || interimTranscript;
          setTranscript(fullTranscript);

          if (finalTranscript) {
            setIsProcessing(true);
            processVoiceInput(finalTranscript, event.results[0][0].confidence);
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
              toast.error("Microphone permission denied. Please allow microphone access.");
              break;
            default:
              toast.error(`Speech recognition error: ${event.error}`);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
          if (!isProcessing) {
            setTranscript("");
          }
        };

        recognitionRef.current = recognition;
      }
    }
  }, [isProcessing]);

  const parseAmount = (text) => {
    // Enhanced amount parsing with more patterns and better number detection
    const patterns = [
      // Rupee symbol patterns
      /₹\s*(\d+(?:,\d+)*(?:\.\d{1,2})?)/g,
      /rs\.?\s*(\d+(?:,\d+)*(?:\.\d{1,2})?)/gi,
      /rupees?\s*(\d+(?:,\d+)*(?:\.\d{1,2})?)/gi,
      
      // Number followed by currency
      /(\d+(?:,\d+)*(?:\.\d{1,2})?)\s*(?:₹|rs\.?|rupees?|bucks?|paisa)/gi,
      
      // Verbal numbers (basic)
      /(?:spent|paid|cost|costs|add|for)\s*(?:about\s*)?(\d+(?:,\d+)*(?:\.\d{1,2})?)/gi,
      
      // Any standalone number (as fallback)
      /(?:^|\s)(\d+(?:,\d+)*(?:\.\d{1,2})?)(?:\s|$)/g
    ];

    for (const pattern of patterns) {
      const matches = Array.from(text.matchAll(pattern));
      if (matches.length > 0) {
        // Get the first valid amount found
        for (const match of matches) {
          const amount = match[1].replace(/,/g, '');
          const numAmount = parseFloat(amount);
          if (numAmount > 0 && numAmount < 1000000) { // Reasonable amount range
            return numAmount;
          }
        }
      }
    }
    return null;
  };

  const detectCurrency = (text) => {
    const lowerText = text.toLowerCase();
    
    for (const [currency, keywords] of Object.entries(CURRENCY_PATTERNS)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword.toLowerCase())) {
          return currency;
        }
      }
    }
    return 'INR'; // Default to INR
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
    // Clean up the text and extract meaningful description
    let description = text
      // Remove amount mentions
      .replace(/₹\s*\d+(?:,\d+)*(?:\.\d{1,2})?/gi, '')
      .replace(/rs\.?\s*\d+(?:,\d+)*(?:\.\d{1,2})?/gi, '')
      .replace(/rupees?\s*\d+(?:,\d+)*(?:\.\d{1,2})?/gi, '')
      .replace(/\d+(?:,\d+)*(?:\.\d{1,2})?\s*(?:₹|rs\.?|rupees?|bucks?)/gi, '')
      .replace(/\b\d+(?:,\d+)*(?:\.\d{1,2})?\b/g, '') // Remove standalone numbers
      
      // Remove common voice command words
      .replace(/\b(?:add|spent|paid|cost|costs|for|on|at|to|the|a|an|in|of|and|or|buy|bought|purchase|purchased)\b/gi, ' ')
      
      // Clean up extra spaces and punctuation
      .replace(/\s+/g, ' ')
      .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '')
      .trim();

    // If description is too short or empty, try to extract from context
    if (description.length < 3) {
      // Try to find the main subject/object
      const contextMatches = text.match(/(?:for|at|from|to)\s+([a-zA-Z\s]+?)(?:\s|$|[^a-zA-Z])/gi);
      if (contextMatches && contextMatches.length > 0) {
        description = contextMatches[0]
          .replace(/^(?:for|at|from|to)\s+/gi, '')
          .trim();
      }
    }

    // Still too short? Use a generic description with original text hint
    if (description.length < 3) {
      const words = text.toLowerCase().split(/\s+/).filter(word => 
        word.length > 2 && 
        !['add', 'spent', 'paid', 'cost', 'costs', 'for', 'the', 'and', 'rupees', 'rupee'].includes(word)
      );
      description = words.slice(0, 3).join(' ') || 'Voice expense';
    }

    // Capitalize first letter and limit length
    description = description.charAt(0).toUpperCase() + description.slice(1);
    return description.length > 50 ? description.substring(0, 47) + '...' : description;
  };

  const processVoiceInput = async (text, confidence) => {
    try {
      console.log('Processing voice input:', text);
      
      // Clean and normalize the text
      const normalizedText = text.toLowerCase().trim();
      
      // Parse the voice input
      const amount = parseAmount(normalizedText);
      const currency = detectCurrency(normalizedText);
      const category = categorizeExpense(normalizedText);
      const description = extractDescription(normalizedText, amount);

      // Validation
      if (!amount || amount <= 0) {
        toast.error("Could not detect a valid amount. Please try again and speak clearly like '500 rupees' or '₹500'");
        setIsProcessing(false);
        return;
      }

      if (amount > 100000) {
        toast.warning(`Detected amount ₹${amount} seems very high. Please confirm this is correct.`);
      }

      const result = {
        amount: amount,
        currency: currency,
        category: category,
        description: description,
        confidence: confidence,
        originalText: text,
        inputMethod: 'voice'
      };

      console.log('Parsed result:', result);
      
      // Provide audio feedback for high confidence results
      if ('speechSynthesis' in window && confidence > 0.7) {
        const feedbackText = `Added ${currency === 'INR' ? '₹' : '$'}${amount} for ${description} under ${category}`;
        const utterance = new SpeechSynthesisUtterance(feedbackText);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        
        // Stop any ongoing speech before starting new one
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }

      // Show success toast with parsed information
      toast.success(
        <div className="flex flex-col gap-1">
          <div className="font-semibold">Voice input processed!</div>
          <div className="text-sm">₹{amount} • {description} • {category}</div>
          {confidence < 0.8 && (
            <div className="text-xs text-amber-600">
              Low confidence - please verify the details
            </div>
          )}
        </div>, 
        { 
          duration: 5000 
        }
      );

      onVoiceResult(result);
      
    } catch (error) {
      console.error('Error processing voice input:', error);
      toast.error("Error processing voice input. Please try speaking more clearly and try again.");
    } finally {
      setIsProcessing(false);
      setTimeout(() => setTranscript(""), 3000);
    }
  };

  const startListening = () => {
    if (!isSupported) {
      toast.error("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (disabled) {
      toast.warning("Voice input is currently disabled.");
      return;
    }

    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        toast.error("Failed to start voice recognition. Please try again.");
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  if (!isSupported) {
    return (
      <div className={cn("flex items-center gap-2 text-muted-foreground", className)}>
        <MicOff className="h-4 w-4" />
        <span className="text-sm">Voice input not supported</span>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant={isListening ? "destructive" : "outline"}
          size="lg"
          onClick={isListening ? stopListening : startListening}
          disabled={disabled || isProcessing}
          className="flex items-center gap-2 cursor-pointer"
        >
          {isProcessing ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isListening ? (
            <MicOff className="h-5 w-5" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
          {isProcessing ? "Processing..." : isListening ? "Stop Recording" : "Voice Input"}
        </Button>
        
        {isListening && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Listening...</span>
          </div>
        )}
        
        {!isListening && !isProcessing && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              const utterance = new SpeechSynthesisUtterance(
                "Say something like: Add 500 rupees for dinner at Domino's, or 200 rupees uber ride"
              );
              utterance.rate = 0.8;
              window.speechSynthesis.speak(utterance);
            }}
            className="flex items-center gap-1 text-xs cursor-pointer"
          >
            <Volume2 className="h-3 w-3" />
            Help
          </Button>
        )}
      </div>

      {transcript && (
        <div className="space-y-2">
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm">
              <span className="font-medium">Transcript: </span>
              {transcript}
            </p>
            {confidence > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={confidence > 0.8 ? "default" : confidence > 0.6 ? "secondary" : "destructive"}>
                  {Math.round(confidence * 100)}% confidence
                </Badge>
              </div>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground">
            <p><strong>Tips:</strong></p>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>Say amount clearly: "500 rupees" or "₹500"</li>
              <li>Include details: "dinner at Domino's" or "uber ride"</li>
              <li>Examples: "Add 200 rupees for grocery shopping"</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
