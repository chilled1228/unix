"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Copy, Clock, Calendar, Check, AlertCircle, Info, ChevronDown } from "lucide-react";
import { format, fromUnixTime, formatDistanceToNow, formatRFC7231 } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

// Types
interface ConversionResult {
  iso8601: string;
  utc: string;
  local: string;
  relative: string;
  rfc2822: string;
  unixSeconds: string;
  unixMilliseconds: string;
  weekday: string;
  dayOfYear: number;
  weekNumber: number;
  isValid: boolean;
  precision: 'seconds' | 'milliseconds';
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
  suggestion?: string;
  suggestedAction?: () => void;
}

// Constants
const TIMEZONES = [
  { value: "UTC", label: "UTC", offset: "+00:00" },
  { value: "America/New_York", label: "Eastern Time", offset: "UTC-5/-4" },
  { value: "America/Chicago", label: "Central Time", offset: "UTC-6/-5" },
  { value: "America/Denver", label: "Mountain Time", offset: "UTC-7/-6" },
  { value: "America/Los_Angeles", label: "Pacific Time", offset: "UTC-8/-7" },
  { value: "Europe/London", label: "London", offset: "UTC+0/+1" },
  { value: "Europe/Paris", label: "Paris", offset: "UTC+1/+2" },
  { value: "Europe/Berlin", label: "Berlin", offset: "UTC+1/+2" },
  { value: "Asia/Tokyo", label: "Tokyo", offset: "UTC+9" },
  { value: "Asia/Shanghai", label: "Shanghai", offset: "UTC+8" },
  { value: "Asia/Kolkata", label: "India", offset: "UTC+5:30" },
  { value: "Australia/Sydney", label: "Sydney", offset: "UTC+10/+11" },
];

// Utility functions
const detectTimestampPrecision = (input: string): 'seconds' | 'milliseconds' | null => {
  const num = input.replace(/\D/g, '');
  if (num.length === 10) return 'seconds';
  if (num.length === 13) return 'milliseconds';
  return null;
};

const validateTimestampInput = (input: string): ValidationResult => {
  if (!input.trim()) {
    return { isValid: false };
  }

  // Check for non-numeric characters
  if (!/^\d+$/.test(input.trim())) {
    return {
      isValid: false,
      error: "Only digits allowed.",
    };
  }

  const precision = detectTimestampPrecision(input);
  if (!precision) {
    if (input.length > 13) {
      return {
        isValid: false,
        error: "Value too long—did you paste milliseconds?",
      };
    }
    return {
      isValid: false,
      error: "Invalid timestamp length. Use 10 digits (seconds) or 13 digits (milliseconds).",
    };
  }

  const timestamp = parseInt(input);
  
  // Check reasonable range (1970 to 2100)
  const minTimestamp = 0;
  const maxTimestamp = precision === 'seconds' ? 4102444800 : 4102444800000; // Year 2100
  
  if (timestamp < minTimestamp || timestamp > maxTimestamp) {
    return {
      isValid: false,
      error: "Out of reasonable range (1970-2100).",
    };
  }

  return { isValid: true };
};

const convertTimestamp = (input: string, timezone: string = 'UTC'): ConversionResult => {
  const validation = validateTimestampInput(input);
  if (!validation.isValid) {
    return {
      iso8601: '',
      utc: '',
      local: '',
      relative: '',
      rfc2822: '',
      unixSeconds: '',
      unixMilliseconds: '',
      weekday: '',
      dayOfYear: 0,
      weekNumber: 0,
      isValid: false,
      precision: 'seconds',
    };
  }

  const precision = detectTimestampPrecision(input)!;
  const timestamp = parseInt(input);
  
  // Convert to Date object
  const date = precision === 'seconds' ? fromUnixTime(timestamp) : new Date(timestamp);
  
  // Get device timezone
  const deviceTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const targetTimezone = timezone === 'Device' ? deviceTimezone : timezone;

  return {
    iso8601: date.toISOString(),
    utc: format(date, 'EEE, MMM d, yyyy, HH:mm:ss') + ' UTC',
    local: formatInTimeZone(date, targetTimezone, 'EEE, MMM d, yyyy, HH:mm:ss zzz'),
    relative: formatDistanceToNow(date, { addSuffix: true }),
    rfc2822: formatRFC7231(date),
    unixSeconds: Math.floor(date.getTime() / 1000).toString(),
    unixMilliseconds: date.getTime().toString(),
    weekday: format(date, 'EEEE'),
    dayOfYear: parseInt(format(date, 'DDD')),
    weekNumber: parseInt(format(date, 'I')),
    isValid: true,
    precision,
  };
};

// Debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Sub-components
interface EpochToDateConverterProps {
  epochInput: string;
  setEpochInput: (value: string) => void;
  timezone: string;
  setTimezone: (value: string) => void;
  precisionOverride: 'seconds' | 'milliseconds' | 'auto';
  setPrecisionOverride: (value: 'seconds' | 'milliseconds' | 'auto') => void;
  validation: ValidationResult;
  result: ConversionResult;
  copyToClipboard: (text: string, format: string) => void;
  handlePrecisionSuggestion: (precision: 'seconds' | 'milliseconds') => void;
  epochInputRef: React.RefObject<HTMLInputElement | null>;
}

function EpochToDateConverter({
  epochInput,
  setEpochInput,
  timezone,
  setTimezone,
  precisionOverride,
  setPrecisionOverride,
  validation,
  result,
  copyToClipboard,
  handlePrecisionSuggestion,
  epochInputRef
}: EpochToDateConverterProps) {
  const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false);

  const detectedPrecision = detectTimestampPrecision(epochInput);
  const shouldShowPrecisionSuggestion = detectedPrecision && precisionOverride === 'auto' &&
    ((detectedPrecision === 'milliseconds' && epochInput.length === 13) ||
     (detectedPrecision === 'seconds' && epochInput.length === 10));

  return (
    <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
      {/* Input Section */}
      <div className="space-y-4 sm:space-y-6">
        <div>
          <label htmlFor="epoch-input" className="block text-sm font-medium text-brand-secondary-700 mb-2">
            Unix Timestamp
          </label>
          <div className="relative">
            <input
              ref={epochInputRef}
              id="epoch-input"
              type="tel"
              inputMode="numeric"
              value={epochInput}
              onChange={(e) => setEpochInput(e.target.value)}
              placeholder="e.g., 1640995200 or 1640995200000"
              maxLength={13}
              autoComplete="off"
              className={`w-full px-4 py-4 sm:py-3 border rounded-lg font-mono text-base sm:text-lg focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500 transition-colors min-h-[44px] ${
                validation.isValid === false && epochInput ? 'border-red-500 bg-red-50' : 'border-brand-secondary-300 bg-white'
              }`}
              aria-describedby={validation.error ? "epoch-error" : undefined}
              style={{ fontSize: '16px' }} // Prevent zoom on iOS
            />
            {epochInput && (
              <button
                onClick={() => setEpochInput('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-secondary-400 hover:text-brand-secondary-600 w-6 h-6 flex items-center justify-center text-xl"
                title="Clear input"
                aria-label="Clear input"
              >
                ×
              </button>
            )}
          </div>

          {/* Validation Error */}
          {validation.error && epochInput && (
            <div id="epoch-error" className="mt-2 flex items-start gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{validation.error}</span>
            </div>
          )}

          {/* Precision Suggestion */}
          {shouldShowPrecisionSuggestion && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <span className="text-blue-800">
                    Looks like {detectedPrecision}. Switch to {detectedPrecision}?
                  </span>
                  <button
                    onClick={() => handlePrecisionSuggestion(detectedPrecision)}
                    className="ml-2 text-blue-600 hover:text-blue-800 font-medium underline"
                  >
                    Switch
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Precision Toggle - Mobile Optimized */}
        <div>
          <fieldset>
            <legend className="text-sm font-medium text-brand-secondary-700 mb-3">Precision</legend>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <label className="flex items-center min-h-[44px] px-3 py-2 rounded-lg border border-brand-secondary-200 hover:border-brand-secondary-300 cursor-pointer">
                <input
                  type="radio"
                  name="precision"
                  value="seconds"
                  checked={precisionOverride === 'seconds'}
                  onChange={(e) => setPrecisionOverride(e.target.value as 'seconds')}
                  className="mr-3"
                />
                <span className="text-sm text-brand-secondary-700">Seconds</span>
              </label>
              <label className="flex items-center min-h-[44px] px-3 py-2 rounded-lg border border-brand-secondary-200 hover:border-brand-secondary-300 cursor-pointer">
                <input
                  type="radio"
                  name="precision"
                  value="milliseconds"
                  checked={precisionOverride === 'milliseconds'}
                  onChange={(e) => setPrecisionOverride(e.target.value as 'milliseconds')}
                  className="mr-3"
                />
                <span className="text-sm text-brand-secondary-700">Milliseconds</span>
              </label>
              <label className="flex items-center min-h-[44px] px-3 py-2 rounded-lg border border-brand-secondary-200 hover:border-brand-secondary-300 cursor-pointer">
                <input
                  type="radio"
                  name="precision"
                  value="auto"
                  checked={precisionOverride === 'auto'}
                  onChange={(e) => setPrecisionOverride(e.target.value as 'auto')}
                  className="mr-3"
                />
                <span className="text-sm text-brand-secondary-700">Auto-detect</span>
              </label>
            </div>
          </fieldset>
        </div>

        {/* Timezone Selector */}
        <TimezoneSelector
          timezone={timezone}
          setTimezone={setTimezone}
        />
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-brand-secondary-900">Results</h3>

        {result.isValid ? (
          <div className="space-y-3">
            <ResultRow
              label="ISO 8601"
              value={result.iso8601}
              onCopy={() => copyToClipboard(result.iso8601, 'ISO 8601')}
            />
            <ResultRow
              label="UTC"
              value={result.utc}
              onCopy={() => copyToClipboard(result.utc, 'UTC')}
            />
            <ResultRow
              label="Local Time"
              value={result.local}
              onCopy={() => copyToClipboard(result.local, 'Local Time')}
            />
            <ResultRow
              label="Relative"
              value={result.relative}
              onCopy={() => copyToClipboard(result.relative, 'Relative Time')}
            />
            <ResultRow
              label="RFC 2822"
              value={result.rfc2822}
              onCopy={() => copyToClipboard(result.rfc2822, 'RFC 2822')}
            />
            <ResultRow
              label="Unix Seconds"
              value={result.unixSeconds}
              onCopy={() => copyToClipboard(result.unixSeconds, 'Unix Seconds')}
            />
            <ResultRow
              label="Unix Milliseconds"
              value={result.unixMilliseconds}
              onCopy={() => copyToClipboard(result.unixMilliseconds, 'Unix Milliseconds')}
            />

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-brand-secondary-50 rounded-lg border border-brand-secondary-200">
              <h4 className="text-sm font-medium text-brand-secondary-900 mb-2">Additional Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm text-brand-secondary-700">
                <div>
                  <span className="font-medium">Weekday:</span> {result.weekday}
                </div>
                <div>
                  <span className="font-medium">Day of Year:</span> {result.dayOfYear}
                </div>
                <div>
                  <span className="font-medium">Week Number:</span> {result.weekNumber}
                </div>
                <div>
                  <span className="font-medium">Precision:</span> {result.precision}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-brand-secondary-500">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Enter a Unix timestamp to see the conversion</p>
            <p className="text-sm mt-1">Try: 1640995200 (seconds) or 1640995200000 (milliseconds)</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface DateToEpochConverterProps {
  dateInput: string;
  setDateInput: (value: string) => void;
  timezone: string;
  setTimezone: (value: string) => void;
  copyToClipboard: (text: string, format: string) => void;
}

function DateToEpochConverter({
  dateInput,
  setDateInput,
  timezone,
  setTimezone,
  copyToClipboard
}: DateToEpochConverterProps) {
  // This would be implemented similarly to EpochToDateConverter
  // For now, returning a placeholder
  return (
    <div className="text-center py-8 text-brand-secondary-500">
      <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
      <p>Date to Epoch converter coming soon...</p>
    </div>
  );
}

interface TimezoneSelector {
  timezone: string;
  setTimezone: (value: string) => void;
}

function TimezoneSelector({ timezone, setTimezone }: TimezoneSelector) {
  const [showDropdown, setShowDropdown] = useState(false);
  const deviceTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const selectedTimezoneLabel = timezone === 'Device'
    ? `Device (${deviceTimezone})`
    : TIMEZONES.find(tz => tz.value === timezone)?.label || timezone;

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-brand-secondary-700 mb-2">
        Timezone
      </label>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="w-full px-4 py-3 border border-brand-secondary-300 rounded-lg bg-white text-left flex items-center justify-between hover:border-brand-secondary-400 focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500"
      >
        <span>{selectedTimezoneLabel}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      {showDropdown && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-brand-secondary-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <button
            onClick={() => {
              setTimezone('Device');
              setShowDropdown(false);
            }}
            className="w-full px-4 py-2 text-left hover:bg-brand-secondary-50 focus:bg-brand-secondary-50 focus:outline-none"
          >
            Device ({deviceTimezone})
          </button>
          {TIMEZONES.map((tz) => (
            <button
              key={tz.value}
              onClick={() => {
                setTimezone(tz.value);
                setShowDropdown(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-brand-secondary-50 focus:bg-brand-secondary-50 focus:outline-none"
            >
              <div>
                <div className="font-medium">{tz.label}</div>
                <div className="text-sm text-brand-secondary-500">{tz.value} ({tz.offset})</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface ResultRowProps {
  label: string;
  value: string;
  onCopy: () => void;
}

function ResultRow({ label, value, onCopy }: ResultRowProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-brand-secondary-50 rounded-lg border border-brand-secondary-200">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-brand-secondary-900">{label}</div>
        <div className="text-sm text-brand-secondary-700 font-mono break-all">{value}</div>
      </div>
      <button
        onClick={onCopy}
        className="ml-3 p-2 text-brand-secondary-400 hover:text-brand-primary-600 hover:bg-white rounded-md transition-colors"
        title={`Copy ${label} to clipboard`}
        aria-label={`Copy ${label} to clipboard`}
      >
        <Copy className="w-4 h-4" />
      </button>
    </div>
  );
}

export function EnhancedTimestampConverter() {
  // State
  const [mode, setMode] = useState<'epoch-to-date' | 'date-to-epoch'>('epoch-to-date');
  const [epochInput, setEpochInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [timezone, setTimezone] = useState("Device");
  const [precisionOverride, setPrecisionOverride] = useState<'seconds' | 'milliseconds' | 'auto'>('auto');
  const [currentTimestamp, setCurrentTimestamp] = useState(0);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false);
  const [recentConversions, setRecentConversions] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // Refs
  const epochInputRef = useRef<HTMLInputElement>(null);
  const timezoneDropdownRef = useRef<HTMLDivElement>(null);

  // Debounced values
  const debouncedEpochInput = useDebounce(epochInput, 200);
  const debouncedDateInput = useDebounce(dateInput, 200);

  // Conversion results
  const epochResult = convertTimestamp(debouncedEpochInput, timezone);
  const validation = validateTimestampInput(epochInput);

  // Update current timestamp
  useEffect(() => {
    const updateCurrentTime = () => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000));
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Load recent conversions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentConversions');
    if (saved) {
      try {
        setRecentConversions(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse recent conversions:', e);
      }
    }
  }, []);

  // Save recent conversions to localStorage
  useEffect(() => {
    if (recentConversions.length > 0) {
      localStorage.setItem('recentConversions', JSON.stringify(recentConversions));
    }
  }, [recentConversions]);

  // Add to recent conversions when valid conversion happens
  useEffect(() => {
    if (epochResult.isValid && debouncedEpochInput && debouncedEpochInput.length >= 10) {
      setRecentConversions(prev => {
        const newConversions = [debouncedEpochInput, ...prev.filter(c => c !== debouncedEpochInput)];
        return newConversions.slice(0, 10); // Keep only last 10
      });
    }
  }, [epochResult.isValid, debouncedEpochInput]);

  // Handle URL parameters for shareable links
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const timestamp = urlParams.get('timestamp');
    const modeParam = urlParams.get('mode');

    if (timestamp) {
      setEpochInput(timestamp);
    }

    if (modeParam === 'date-to-epoch') {
      setMode('date-to-epoch');
    }
  }, []);

  // Handle copy to clipboard
  const copyToClipboard = useCallback(async (text: string, format: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(`Copied ${format} to clipboard`);
      setTimeout(() => setCopySuccess(null), 2000);
      
      // Analytics event would go here
      console.log('copy_click', { format, device: window.innerWidth < 768 ? 'mobile' : 'desktop', success: true });
    } catch (err) {
      setCopySuccess("Copy failed—press Ctrl/Cmd+C");
      setTimeout(() => setCopySuccess(null), 3000);
      console.error('Copy failed:', err);
    }
  }, []);

  // Handle precision suggestion
  const handlePrecisionSuggestion = useCallback((newPrecision: 'seconds' | 'milliseconds') => {
    setPrecisionOverride(newPrecision);
  }, []);

  // Generate shareable link
  const generateShareableLink = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('timestamp', epochInput);
    url.searchParams.set('mode', mode);
    return url.toString();
  }, [epochInput, mode]);

  // Share functionality
  const handleShare = useCallback(async () => {
    const shareUrl = generateShareableLink();

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Unix Timestamp Conversion',
          text: `Unix timestamp ${epochInput} converts to ${epochResult.iso8601}`,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Share failed:', err);
        copyToClipboard(shareUrl, 'Shareable link');
      }
    } else {
      copyToClipboard(shareUrl, 'Shareable link');
    }
  }, [generateShareableLink, epochInput, epochResult.iso8601, copyToClipboard]);

  // Clear recent conversions
  const clearHistory = useCallback(() => {
    setRecentConversions([]);
    localStorage.removeItem('recentConversions');
  }, []);

  // Get device timezone
  const deviceTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const selectedTimezone = timezone === 'Device' ? deviceTimezone : timezone;

  return (
    <section id="converter" className="py-4 sm:py-8 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header with Mode Switch */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-brand-secondary-900 text-center sm:text-left">Unix Converter</h2>

            {/* Mode Toggle - Mobile Optimized */}
            <div className="flex bg-brand-secondary-100 rounded-lg p-1 w-full sm:w-auto sm:self-start">
              <button
                onClick={() => setMode('epoch-to-date')}
                className={`flex-1 sm:flex-none px-4 py-3 sm:py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] ${
                  mode === 'epoch-to-date'
                    ? 'bg-white text-brand-primary-600 shadow-sm'
                    : 'text-brand-secondary-600 hover:text-brand-secondary-900'
                }`}
                aria-pressed={mode === 'epoch-to-date'}
              >
                Epoch → Date
              </button>
              <button
                onClick={() => setMode('date-to-epoch')}
                className={`flex-1 sm:flex-none px-4 py-3 sm:py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] ${
                  mode === 'date-to-epoch'
                    ? 'bg-white text-brand-primary-600 shadow-sm'
                    : 'text-brand-secondary-600 hover:text-brand-secondary-900'
                }`}
                aria-pressed={mode === 'date-to-epoch'}
              >
                Date → Epoch
              </button>
            </div>
          </div>
        </div>

        {/* Current Timestamp Display - Mobile Optimized */}
        <div className="mb-6 sm:mb-8 p-4 bg-brand-primary-50 rounded-lg border border-brand-primary-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-center sm:text-left">
              <div className="text-sm text-brand-secondary-600 mb-1">Current Unix Timestamp</div>
              <div className="text-lg sm:text-xl font-mono font-bold text-brand-primary-600 break-all">
                {currentTimestamp}
              </div>
            </div>
            <button
              onClick={() => setEpochInput(currentTimestamp.toString())}
              className="w-full sm:w-auto px-4 py-3 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700 transition-colors text-sm font-medium min-h-[44px]"
              title="Use current timestamp"
            >
              Use Now
            </button>
          </div>
        </div>

        {mode === 'epoch-to-date' ? (
          <EpochToDateConverter
            epochInput={epochInput}
            setEpochInput={setEpochInput}
            timezone={timezone}
            setTimezone={setTimezone}
            precisionOverride={precisionOverride}
            setPrecisionOverride={setPrecisionOverride}
            validation={validation}
            result={epochResult}
            copyToClipboard={copyToClipboard}
            handlePrecisionSuggestion={handlePrecisionSuggestion}
            epochInputRef={epochInputRef}
          />
        ) : (
          <DateToEpochConverter
            dateInput={dateInput}
            setDateInput={setDateInput}
            timezone={timezone}
            setTimezone={setTimezone}
            copyToClipboard={copyToClipboard}
          />
        )}

        {/* Copy Success Toast */}
        {copySuccess && (
          <div 
            className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              {copySuccess}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
