"use client";

import { useState } from "react";
import { Upload, Download, Copy, Trash2, Plus } from "lucide-react";
import { format, fromUnixTime, getUnixTime, parseISO } from "date-fns";

interface ConversionResult {
  id: string;
  input: string;
  output: string;
  type: 'timestamp-to-date' | 'date-to-timestamp';
  timestamp: number;
}

export function BatchConverter() {
  const [batchInput, setBatchInput] = useState("");
  const [conversionHistory, setConversionHistory] = useState<ConversionResult[]>([]);
  const [conversionType, setConversionType] = useState<'timestamp-to-date' | 'date-to-timestamp'>('timestamp-to-date');
  const [customFormat, setCustomFormat] = useState("yyyy-MM-dd HH:mm:ss");
  const [copySuccess, setCopySuccess] = useState("");

  const processBatchConversion = () => {
    const lines = batchInput.split('\n').filter(line => line.trim() !== '');
    const results: ConversionResult[] = [];

    lines.forEach((line, index) => {
      const input = line.trim();
      let output = "";

      try {
        if (conversionType === 'timestamp-to-date') {
          const timestamp = parseInt(input);
          if (!isNaN(timestamp)) {
            const date = timestamp > 9999999999 
              ? new Date(timestamp) 
              : fromUnixTime(timestamp);
            output = format(date, customFormat);
          } else {
            output = "Invalid timestamp";
          }
        } else {
          let date: Date;
          if (input.includes("T") || input.match(/^\d{4}-\d{2}-\d{2}/)) {
            date = parseISO(input);
          } else {
            date = new Date(input);
          }
          
          if (!isNaN(date.getTime())) {
            output = getUnixTime(date).toString();
          } else {
            output = "Invalid date";
          }
        }

        results.push({
          id: `${Date.now()}-${index}`,
          input,
          output,
          type: conversionType,
          timestamp: Date.now()
        });
      } catch (error) {
        results.push({
          id: `${Date.now()}-${index}`,
          input,
          output: "Conversion error",
          type: conversionType,
          timestamp: Date.now()
        });
      }
    });

    setConversionHistory(prev => [...results, ...prev]);
    setBatchInput("");
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(`${type} copied!`);
      setTimeout(() => setCopySuccess(""), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const exportResults = () => {
    const csvContent = [
      "Input,Output,Type,Timestamp",
      ...conversionHistory.map(result => 
        `"${result.input}","${result.output}","${result.type}","${new Date(result.timestamp).toISOString()}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'unix-timestamp-conversions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearHistory = () => {
    setConversionHistory([]);
  };

  const addToHistory = (input: string, output: string) => {
    const result: ConversionResult = {
      id: `${Date.now()}`,
      input,
      output,
      type: conversionType,
      timestamp: Date.now()
    };
    setConversionHistory(prev => [result, ...prev]);
  };

  return (
    <section id="batch-converter" className="py-16 px-4 bg-brand-secondary-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-secondary-900 mb-4">
            Batch Unix Timestamp Converter
          </h2>
          <p className="text-xl text-brand-secondary-600 max-w-3xl mx-auto">
            Convert multiple timestamps or dates at once. Perfect for processing large datasets or batch operations.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Batch Input Section */}
          <div className="bg-white rounded-xl shadow-lg border border-brand-secondary-200 p-6">
            <h3 className="text-xl font-semibold text-brand-secondary-900 mb-4">Batch Input</h3>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <select
                  value={conversionType}
                  onChange={(e) => setConversionType(e.target.value as 'timestamp-to-date' | 'date-to-timestamp')}
                  className="flex-1 px-3 py-2 border border-brand-secondary-300 rounded-lg focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500 bg-white"
                >
                  <option value="timestamp-to-date">Timestamp to Date</option>
                  <option value="date-to-timestamp">Date to Timestamp</option>
                </select>
                
                <input
                  type="text"
                  value={customFormat}
                  onChange={(e) => setCustomFormat(e.target.value)}
                  placeholder="Date format"
                  className="flex-1 px-3 py-2 border border-brand-secondary-300 rounded-lg focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500 bg-white"
                />
              </div>

              <textarea
                value={batchInput}
                onChange={(e) => setBatchInput(e.target.value)}
                placeholder={conversionType === 'timestamp-to-date' 
                  ? "Enter Unix timestamps, one per line:\n1640995200\n1641081600\n1641168000"
                  : "Enter dates, one per line:\n2022-01-01 00:00:00\n2022-01-02 00:00:00\n2022-01-03 00:00:00"
                }
                rows={8}
                className="w-full px-4 py-3 border border-brand-secondary-300 rounded-lg focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500 font-mono text-sm bg-white resize-none"
              />

              <div className="flex gap-3">
                <button
                  onClick={processBatchConversion}
                  disabled={!batchInput.trim()}
                  className="flex-1 bg-brand-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Convert Batch
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-lg border border-brand-secondary-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-brand-secondary-900">Conversion History</h3>
              <div className="flex gap-2">
                {conversionHistory.length > 0 && (
                  <>
                    <button
                      onClick={exportResults}
                      className="px-4 py-2 bg-brand-primary-600 text-white rounded-lg hover:bg-brand-primary-700 transition-colors flex items-center gap-2"
                      title="Export as CSV"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                    <button
                      onClick={clearHistory}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                      title="Clear history"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {conversionHistory.length === 0 ? (
                <div className="text-center py-8 text-brand-secondary-500">
                  <Upload className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No conversions yet. Add some data above to get started.</p>
                </div>
              ) : (
                conversionHistory.map((result) => (
                  <div key={result.id} className="bg-brand-secondary-50 rounded-lg p-4 border border-brand-secondary-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-brand-secondary-500 uppercase tracking-wide">
                        {result.type.replace('-', ' → ')}
                      </span>
                      <span className="text-xs text-brand-secondary-500">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-brand-secondary-600 mb-1">Input</div>
                        <div className="font-mono text-sm text-brand-secondary-900 bg-white p-2 rounded border">
                          {result.input}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-brand-secondary-600 mb-1 flex items-center justify-between">
                          Output
                          <button
                            onClick={() => copyToClipboard(result.output, "Result")}
                            className="p-1 hover:bg-brand-secondary-200 rounded transition-colors"
                            title="Copy result"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="font-mono text-sm text-brand-secondary-900 bg-white p-2 rounded border">
                          {result.output}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Copy Success Message */}
        {copySuccess && (
          <div className="mt-6 p-3 bg-brand-success-100 border border-brand-success-300 rounded-lg text-brand-success-700 text-center">
            {copySuccess}
          </div>
        )}
      </div>
    </section>
  );
}
