"use client";

import { useState, useEffect } from "react";
import { Copy, Clock, Calendar, RefreshCw } from "lucide-react";
import { format, fromUnixTime, getUnixTime, parseISO } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { CityData } from '@/data/cities';

interface CityTimestampConverterProps {
  cityData: CityData;
}

export function CityTimestampConverter({ cityData }: CityTimestampConverterProps) {
  const [unixInput, setUnixInput] = useState("");
  const [dateInput, setDateInput] = useState("");
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

  // Convert Unix to Date in city timezone
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
      
      const formatted = formatInTimeZone(date, cityData.timezone, cityData.localTimeFormat);
      setConvertedDate(formatted);
    } catch (error) {
      setConvertedDate("Invalid timestamp");
    }
  }, [unixInput, cityData.timezone, cityData.localTimeFormat]);

  // Convert Date to Unix
  useEffect(() => {
    if (dateInput.trim() === "") {
      setConvertedUnix("");
      return;
    }

    try {
      let date: Date;
      
      if (dateInput.includes("T") || dateInput.match(/^\d{4}-\d{2}-\d{2}/)) {
        date = parseISO(dateInput);
      } else {
        date = new Date(dateInput);
      }

      if (isNaN(date.getTime())) {
        setConvertedUnix("Invalid date");
        return;
      }

      // Convert from city timezone to UTC
      const utcDate = fromZonedTime(date, cityData.timezone);
      const timestamp = getUnixTime(utcDate);
      setConvertedUnix(timestamp.toString());
    } catch (error) {
      setConvertedUnix("Invalid date");
    }
  }, [dateInput, cityData.timezone]);

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
    const formatted = formatInTimeZone(now, cityData.timezone, "yyyy-MM-dd'T'HH:mm:ss");
    setDateInput(formatted);
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-brand-secondary-200 p-8">
          {/* Current Timestamp Display */}
          <div className="mb-8 p-6 bg-brand-primary-50 rounded-lg text-center border border-brand-primary-200">
            <div className="text-sm text-brand-secondary-600 mb-2">
              Current Unix Timestamp
            </div>
            <div className="text-2xl font-mono font-bold text-brand-primary-600 mb-2">
              {currentTimestamp}
            </div>
            <div className="text-sm text-brand-secondary-500">
              {formatInTimeZone(new Date(), cityData.timezone, cityData.localTimeFormat)} ({cityData.name})
            </div>
            <div className="text-xs text-brand-secondary-400 mt-1">
              {cityData.timezone} • {cityData.utcOffset}
            </div>
          </div>

          {/* Converters */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Unix to Date */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-brand-secondary-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-primary-600" />
                Unix Timestamp to {cityData.name} Time
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
                    {convertedDate || `Converted ${cityData.name} time will appear here`}
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
                {cityData.name} Time to Unix Timestamp
              </h3>
              
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={dateInput}
                    onChange={(e) => setDateInput(e.target.value)}
                    placeholder={`Enter ${cityData.name} date (e.g., 2024-01-01 12:00:00)`}
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

          {/* City-specific info */}
          <div className="mt-8 p-4 bg-brand-secondary-50 rounded-lg border border-brand-secondary-200">
            <h4 className="font-semibold text-brand-secondary-900 mb-2">
              {cityData.name} Time Zone Information
            </h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-brand-secondary-600">
              <div>
                <span className="font-medium">Timezone:</span> {cityData.timezone}
              </div>
              <div>
                <span className="font-medium">UTC Offset:</span> {cityData.utcOffset}
              </div>
              <div>
                <span className="font-medium">Date Format:</span> {cityData.localTimeFormat}
              </div>
              <div>
                <span className="font-medium">Business Hours:</span> {cityData.businessHours.start} - {cityData.businessHours.end}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
