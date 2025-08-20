"use client";

import { useState, useEffect } from "react";
import { Copy, Clock, Calendar, RefreshCw } from "lucide-react";
import { format, fromUnixTime, getUnixTime, parseISO } from "date-fns";

const TIMEZONES = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Paris", label: "Paris (CET/CEST)" },
  { value: "Europe/Berlin", label: "Berlin (CET/CEST)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST/AEDT)" },
];

const DATE_FORMATS = [
  { value: "MM/dd/yyyy HH:mm:ss", label: "US Format (MM/dd/yyyy)" },
  { value: "dd/MM/yyyy HH:mm:ss", label: "UK Format (dd/MM/yyyy)" },
  { value: "yyyy-MM-dd HH:mm:ss", label: "ISO Format (yyyy-MM-dd)" },
  { value: "MMM dd, yyyy HH:mm:ss", label: "Long Format (Jan 01, 2024)" },
];

export function TimestampConverter() {
  const [unixInput, setUnixInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [dateFormat, setDateFormat] = useState("yyyy-MM-dd HH:mm:ss");
  const [currentTimestamp, setCurrentTimestamp] = useState(0);
  const [convertedDate, setConvertedDate] = useState("");
  const [convertedUnix, setConvertedUnix] = useState("");
  const [copySuccess, setCopySuccess] = useState("");

  // Update current timestamp every second
  useEffect(() => {
    const updateCurrentTime = () => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000));
    };
    
    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Convert Unix to Date
  useEffect(() => {
    if (unixInput.trim() === "") {
      setConvertedDate("");
      return;
    }

    try {
      const timestamp = parseInt(unixInput);
      if (isNaN(timestamp)) {
        setConvertedDate("Invalid timestamp");
        return;
      }

      // Handle both seconds and milliseconds
      const date = timestamp > 9999999999 
        ? new Date(timestamp) 
        : fromUnixTime(timestamp);
      
      const formatted = format(date, dateFormat);
      setConvertedDate(formatted);
    } catch (error) {
      setConvertedDate("Invalid timestamp");
    }
  }, [unixInput, timezone, dateFormat]);

  // Convert Date to Unix
  useEffect(() => {
    if (dateInput.trim() === "") {
      setConvertedUnix("");
      return;
    }

    try {
      // Try to parse the date input
      let date: Date;
      
      // Check if it's already in ISO format
      if (dateInput.includes("T") || dateInput.match(/^\d{4}-\d{2}-\d{2}/)) {
        date = parseISO(dateInput);
      } else {
        // Try to parse as a general date
        date = new Date(dateInput);
      }

      if (isNaN(date.getTime())) {
        setConvertedUnix("Invalid date");
        return;
      }

      // Use the date as-is for now (simplified timezone handling)
      const utcDate = date;
      
      const timestamp = getUnixTime(utcDate);
      setConvertedUnix(timestamp.toString());
    } catch (error) {
      setConvertedUnix("Invalid date");
    }
  }, [dateInput, timezone]);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(`${type} copied!`);
      setTimeout(() => setCopySuccess(""), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const getCurrentTimestamp = () => {
    setUnixInput(currentTimestamp.toString());
  };

  const getCurrentDate = () => {
    const now = new Date();
    const formatted = format(now, "yyyy-MM-dd'T'HH:mm:ss");
    setDateInput(formatted);
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          {/* Current Timestamp Display */}
          <div className="mb-8 p-4 bg-brand-primary-50 rounded-lg text-center border border-brand-primary-200">
            <div className="text-sm text-brand-secondary-600 mb-2">Current Unix Timestamp</div>
            <div className="text-2xl font-mono font-bold text-brand-primary-600 mb-2">
              {currentTimestamp}
            </div>
            <div className="text-sm text-brand-secondary-500">
              {format(new Date(), dateFormat)}
            </div>
          </div>

          {/* Settings */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-brand-secondary-700 mb-2">
                Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 border border-brand-secondary-300 rounded-lg focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500 bg-white"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-brand-secondary-700 mb-2">
                Date Format
              </label>
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="w-full px-3 py-2 border border-brand-secondary-300 rounded-lg focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500 bg-white"
              >
                {DATE_FORMATS.map((fmt) => (
                  <option key={fmt.value} value={fmt.value}>
                    {fmt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Converters */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Unix to Date */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-brand-secondary-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-primary-600" />
                Unix Timestamp to Date
              </h3>
              
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={unixInput}
                    onChange={(e) => setUnixInput(e.target.value)}
                    placeholder="Enter Unix timestamp (e.g., 1640995200)"
                    className="w-full px-4 py-3 border border-brand-secondary-300 rounded-lg focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500 font-mono bg-white"
                  />
                  <button
                    onClick={getCurrentTimestamp}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-brand-secondary-400 hover:text-brand-primary-600 transition-colors"
                    title="Use current timestamp"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="relative">
                  <div className="w-full px-4 py-3 bg-brand-secondary-50 border border-brand-secondary-200 rounded-lg font-mono text-brand-secondary-900 min-h-[48px] flex items-center">
                    {convertedDate || "Converted date will appear here"}
                  </div>
                  {convertedDate && convertedDate !== "Invalid timestamp" && (
                    <button
                      onClick={() => copyToClipboard(convertedDate, "Date")}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-brand-secondary-400 hover:text-brand-primary-600 transition-colors"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Date to Unix */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-brand-secondary-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-primary-600" />
                Date to Unix Timestamp
              </h3>
              
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={dateInput}
                    onChange={(e) => setDateInput(e.target.value)}
                    placeholder="Enter date (e.g., 2024-01-01 12:00:00)"
                    className="w-full px-4 py-3 border border-brand-secondary-300 rounded-lg focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500 bg-white"
                  />
                  <button
                    onClick={getCurrentDate}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-brand-secondary-400 hover:text-brand-primary-600 transition-colors"
                    title="Use current date"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="relative">
                  <div className="w-full px-4 py-3 bg-brand-secondary-50 border border-brand-secondary-200 rounded-lg font-mono text-brand-secondary-900 min-h-[48px] flex items-center">
                    {convertedUnix || "Converted timestamp will appear here"}
                  </div>
                  {convertedUnix && convertedUnix !== "Invalid date" && (
                    <button
                      onClick={() => copyToClipboard(convertedUnix, "Timestamp")}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-brand-secondary-400 hover:text-brand-primary-600 transition-colors"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Copy Success Message */}
          {copySuccess && (
            <div className="mt-4 p-3 bg-brand-success-100 border border-brand-success-300 rounded-lg text-brand-success-700 text-center">
              {copySuccess}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
