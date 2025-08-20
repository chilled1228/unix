"use client";

import { useState } from "react";
import { Code, Copy, Check } from "lucide-react";

const programmingExamples = {
  javascript: {
    title: "JavaScript Unix Time Conversion",
    examples: [
      {
        title: "Convert Unix timestamp to date",
        code: `// Convert Unix timestamp to date
const timestamp = 1640995200;
const date = new Date(timestamp * 1000);
console.log(date.toISOString()); // 2022-01-01T00:00:00.000Z

// Format the date
const options = { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
};
console.log(date.toLocaleDateString('en-US', options));
// January 1, 2022 at 12:00 AM`
      },
      {
        title: "Convert date to Unix timestamp",
        code: `// Convert date to Unix timestamp
const currentTime = Math.floor(Date.now() / 1000);
console.log(currentTime); // Current Unix timestamp

// Convert specific date
const specificDate = new Date('2022-01-01T00:00:00Z');
const timestamp = Math.floor(specificDate.getTime() / 1000);
console.log(timestamp); // 1640995200`
      }
    ]
  },
  python: {
    title: "Python Timestamp Conversion",
    examples: [
      {
        title: "Convert Unix timestamp to datetime",
        code: `import datetime

# Convert Unix timestamp to datetime
timestamp = 1640995200
dt = datetime.datetime.fromtimestamp(timestamp, tz=datetime.timezone.utc)
print(dt.isoformat())  # 2022-01-01T00:00:00+00:00

# Format the datetime
formatted = dt.strftime('%Y-%m-%d %H:%M:%S %Z')
print(formatted)  # 2022-01-01 00:00:00 UTC`
      },
      {
        title: "Convert datetime to Unix timestamp",
        code: `import datetime

# Get current Unix timestamp
current_timestamp = int(datetime.datetime.now().timestamp())
print(current_timestamp)

# Convert specific datetime
dt = datetime.datetime(2022, 1, 1, 0, 0, 0, tzinfo=datetime.timezone.utc)
timestamp = int(dt.timestamp())
print(timestamp)  # 1640995200`
      }
    ]
  },
  php: {
    title: "PHP Unix Time Functions",
    examples: [
      {
        title: "Convert Unix timestamp to date",
        code: `<?php
// Convert Unix timestamp to date
$timestamp = 1640995200;
$date = new DateTime('@' . $timestamp);
$date->setTimezone(new DateTimeZone('UTC'));
echo $date->format('Y-m-d H:i:s T'); // 2022-01-01 00:00:00 UTC

// Using date() function
echo date('Y-m-d H:i:s', $timestamp); // 2022-01-01 00:00:00
?>`
      },
      {
        title: "Convert date to Unix timestamp",
        code: `<?php
// Get current Unix timestamp
$currentTimestamp = time();
echo $currentTimestamp;

// Convert specific date
$date = new DateTime('2022-01-01 00:00:00', new DateTimeZone('UTC'));
$timestamp = $date->getTimestamp();
echo $timestamp; // 1640995200

// Using strtotime()
$timestamp = strtotime('2022-01-01 00:00:00 UTC');
echo $timestamp; // 1640995200
?>`
      }
    ]
  },
  sql: {
    title: "SQL Unix Timestamp Queries",
    examples: [
      {
        title: "MySQL Unix timestamp functions",
        code: `-- Convert Unix timestamp to datetime
SELECT FROM_UNIXTIME(1640995200) AS converted_date;
-- Result: 2022-01-01 00:00:00

-- Convert datetime to Unix timestamp
SELECT UNIX_TIMESTAMP('2022-01-01 00:00:00') AS unix_timestamp;
-- Result: 1640995200

-- Get current Unix timestamp
SELECT UNIX_TIMESTAMP() AS current_timestamp;`
      },
      {
        title: "PostgreSQL timestamp conversion",
        code: `-- Convert Unix timestamp to timestamp
SELECT to_timestamp(1640995200) AS converted_date;
-- Result: 2022-01-01 00:00:00+00

-- Convert timestamp to Unix timestamp
SELECT extract(epoch from timestamp '2022-01-01 00:00:00') AS unix_timestamp;
-- Result: 1640995200

-- Get current Unix timestamp
SELECT extract(epoch from now()) AS current_timestamp;`
      }
    ]
  }
};

export function ProgrammingExamples() {
  const [activeTab, setActiveTab] = useState('javascript');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  return (
    <section id="programming-examples" className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-secondary-900 mb-4 flex items-center justify-center gap-3">
            <Code className="w-8 h-8 text-brand-primary-600" />
            Unix Timestamp in Programming Languages
          </h2>
          <p className="text-xl text-brand-secondary-600 max-w-3xl mx-auto">
            Learn how to work with Unix timestamps in popular programming languages with practical examples and best practices.
          </p>
        </div>

        {/* Language Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {Object.entries(programmingExamples).map(([key, lang]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === key
                  ? 'bg-brand-primary-600 text-white shadow-lg'
                  : 'bg-brand-secondary-100 text-brand-secondary-700 hover:bg-brand-secondary-200'
              }`}
            >
              {lang.title.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Active Language Content */}
        <div className="bg-brand-secondary-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-brand-secondary-900 mb-8 text-center">
            {programmingExamples[activeTab as keyof typeof programmingExamples].title}
          </h3>

          <div className="grid lg:grid-cols-2 gap-8">
            {programmingExamples[activeTab as keyof typeof programmingExamples].examples.map((example, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg border border-brand-secondary-200 overflow-hidden">
                <div className="bg-brand-secondary-900 text-white px-6 py-4 flex items-center justify-between">
                  <h4 className="font-semibold">{example.title}</h4>
                  <button
                    onClick={() => copyToClipboard(example.code, `${activeTab}-${index}`)}
                    className="p-2 hover:bg-brand-secondary-800 rounded-lg transition-colors"
                    title="Copy code"
                  >
                    {copiedCode === `${activeTab}-${index}` ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="p-6">
                  <pre className="bg-brand-secondary-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{example.code}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Tips */}
        <div className="mt-12 bg-brand-primary-50 rounded-xl p-8 border border-brand-primary-200">
          <h3 className="text-xl font-semibold text-brand-secondary-900 mb-6">Best Practices for Unix Timestamps</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-brand-secondary-900 mb-3">✅ Do:</h4>
              <ul className="space-y-2 text-brand-secondary-700">
                <li>• Always store timestamps in UTC</li>
                <li>• Use 64-bit integers for future compatibility</li>
                <li>• Validate timestamp ranges in your applications</li>
                <li>• Consider millisecond precision when needed</li>
                <li>• Use proper timezone conversion for display</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-brand-secondary-900 mb-3">❌ Don't:</h4>
              <ul className="space-y-2 text-brand-secondary-700">
                <li>• Store local time as Unix timestamp</li>
                <li>• Assume all timestamps are in seconds</li>
                <li>• Ignore the Year 2038 problem for 32-bit systems</li>
                <li>• Perform timezone math manually</li>
                <li>• Use string concatenation for date formatting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
