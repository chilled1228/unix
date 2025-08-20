import { Code, Key, Zap, Shield } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unix Converter API - Programmatic Timestamp Conversion",
  description: "RESTful API for Unix timestamp conversion. Convert timestamps programmatically with JSON responses. Free tier available with rate limiting.",
  keywords: [
    "unix converter api",
    "timestamp api",
    "unix time api",
    "epoch converter api",
    "timestamp conversion api",
    "rest api timestamp"
  ],
  alternates: {
    canonical: "/unix-converter-api/",
  },
  openGraph: {
    title: "Unix Converter API - Programmatic Timestamp Conversion",
    description: "RESTful API for Unix timestamp conversion. Convert timestamps programmatically with JSON responses.",
    url: "https://unix-timestamp-converter.com/unix-converter-api/",
  },
};

export default function UnixConverterAPIPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-brand-primary-50 to-brand-primary-100 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-brand-secondary-900 mb-6">
            Unix Converter API
          </h1>
          <p className="text-xl md:text-2xl text-brand-secondary-600 mb-8 max-w-3xl mx-auto">
            Integrate Unix timestamp conversion into your applications with our RESTful API.
            Fast, reliable, and developer-friendly.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-brand-secondary-500">
            <span className="flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full">
              <Zap className="w-4 h-4" />
              Fast responses
            </span>
            <span className="flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full">
              <Shield className="w-4 h-4" />
              Secure & reliable
            </span>
            <span className="flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full">
              <Key className="w-4 h-4" />
              Free tier available
            </span>
          </div>
        </div>
      </section>
      
      {/* API Endpoints */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-brand-secondary-900 mb-12 text-center">
            API Endpoints
          </h2>
          
          <div className="space-y-8">
            {/* Convert Unix to Date */}
            <div className="bg-brand-secondary-50 rounded-xl p-8 border border-brand-secondary-200">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">GET</span>
                <h3 className="text-xl font-semibold text-brand-secondary-900">Convert Unix Timestamp to Date</h3>
              </div>
              
              <div className="mb-6">
                <div className="bg-brand-secondary-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  GET /api/unix-to-date?timestamp=1640995200&timezone=UTC&format=iso
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-brand-secondary-900 mb-3">Parameters</h4>
                  <ul className="space-y-2 text-sm text-brand-secondary-700">
                    <li><code className="bg-brand-secondary-200 px-2 py-1 rounded">timestamp</code> - Unix timestamp (required)</li>
                    <li><code className="bg-brand-secondary-200 px-2 py-1 rounded">timezone</code> - Target timezone (optional, default: UTC)</li>
                    <li><code className="bg-brand-secondary-200 px-2 py-1 rounded">format</code> - Output format (optional, default: iso)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-brand-secondary-900 mb-3">Response</h4>
                  <div className="bg-brand-secondary-900 text-green-400 p-3 rounded text-xs font-mono">
{`{
  "timestamp": 1640995200,
  "date": "2022-01-01T00:00:00.000Z",
  "formatted": "January 1, 2022",
  "timezone": "UTC"
}`}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Convert Date to Unix */}
            <div className="bg-brand-secondary-50 rounded-xl p-8 border border-brand-secondary-200">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">GET</span>
                <h3 className="text-xl font-semibold text-brand-secondary-900">Convert Date to Unix Timestamp</h3>
              </div>
              
              <div className="mb-6">
                <div className="bg-brand-secondary-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  GET /api/date-to-unix?date=2022-01-01T00:00:00Z
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-brand-secondary-900 mb-3">Parameters</h4>
                  <ul className="space-y-2 text-sm text-brand-secondary-700">
                    <li><code className="bg-brand-secondary-200 px-2 py-1 rounded">date</code> - Date string (required)</li>
                    <li><code className="bg-brand-secondary-200 px-2 py-1 rounded">timezone</code> - Input timezone (optional, default: UTC)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-brand-secondary-900 mb-3">Response</h4>
                  <div className="bg-brand-secondary-900 text-green-400 p-3 rounded text-xs font-mono">
{`{
  "date": "2022-01-01T00:00:00.000Z",
  "timestamp": 1640995200,
  "milliseconds": 1640995200000,
  "timezone": "UTC"
}`}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Batch Conversion */}
            <div className="bg-brand-secondary-50 rounded-xl p-8 border border-brand-secondary-200">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">POST</span>
                <h3 className="text-xl font-semibold text-brand-secondary-900">Batch Conversion</h3>
              </div>
              
              <div className="mb-6">
                <div className="bg-brand-secondary-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  POST /api/batch-convert
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-brand-secondary-900 mb-3">Request Body</h4>
                  <div className="bg-brand-secondary-900 text-green-400 p-3 rounded text-xs font-mono">
{`{
  "type": "unix-to-date",
  "values": [1640995200, 1641081600],
  "timezone": "UTC",
  "format": "iso"
}`}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-brand-secondary-900 mb-3">Response</h4>
                  <div className="bg-brand-secondary-900 text-green-400 p-3 rounded text-xs font-mono">
{`{
  "results": [
    {
      "input": 1640995200,
      "output": "2022-01-01T00:00:00.000Z"
    },
    {
      "input": 1641081600,
      "output": "2022-01-02T00:00:00.000Z"
    }
  ]
}`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Code Examples */}
      <section className="py-16 px-4 bg-brand-secondary-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-brand-secondary-900 mb-12 text-center flex items-center justify-center gap-3">
            <Code className="w-8 h-8 text-brand-primary-600" />
            Code Examples
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg border border-brand-secondary-200 overflow-hidden">
              <div className="bg-brand-secondary-900 text-white px-6 py-4">
                <h3 className="font-semibold">JavaScript / Node.js</h3>
              </div>
              <div className="p-6">
                <pre className="bg-brand-secondary-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`// Convert Unix timestamp to date
const response = await fetch(
  'https://api.unix-converter.com/unix-to-date?timestamp=1640995200'
);
const data = await response.json();
console.log(data.date); // 2022-01-01T00:00:00.000Z

// Convert date to Unix timestamp
const dateResponse = await fetch(
  'https://api.unix-converter.com/date-to-unix?date=2022-01-01T00:00:00Z'
);
const dateData = await dateResponse.json();
console.log(dateData.timestamp); // 1640995200`}</code>
                </pre>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg border border-brand-secondary-200 overflow-hidden">
              <div className="bg-brand-secondary-900 text-white px-6 py-4">
                <h3 className="font-semibold">Python</h3>
              </div>
              <div className="p-6">
                <pre className="bg-brand-secondary-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`import requests

# Convert Unix timestamp to date
response = requests.get(
    'https://api.unix-converter.com/unix-to-date',
    params={'timestamp': 1640995200}
)
data = response.json()
print(data['date'])  # 2022-01-01T00:00:00.000Z

# Batch conversion
batch_data = {
    'type': 'unix-to-date',
    'values': [1640995200, 1641081600],
    'timezone': 'UTC'
}
batch_response = requests.post(
    'https://api.unix-converter.com/batch-convert',
    json=batch_data
)
print(batch_response.json())`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Rate Limits and Pricing */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-brand-secondary-900 mb-12 text-center">
            Rate Limits & Pricing
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-brand-secondary-50 rounded-xl p-6 border border-brand-secondary-200 text-center">
              <h3 className="text-xl font-semibold text-brand-secondary-900 mb-4">Free Tier</h3>
              <div className="text-3xl font-bold text-brand-primary-600 mb-2">$0</div>
              <div className="text-brand-secondary-600 mb-4">per month</div>
              <ul className="space-y-2 text-sm text-brand-secondary-700 text-left">
                <li>• 1,000 requests/day</li>
                <li>• Basic endpoints</li>
                <li>• Community support</li>
                <li>• No API key required</li>
              </ul>
            </div>
            
            <div className="bg-brand-primary-50 rounded-xl p-6 border-2 border-brand-primary-300 text-center relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-brand-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Popular
              </div>
              <h3 className="text-xl font-semibold text-brand-secondary-900 mb-4">Pro</h3>
              <div className="text-3xl font-bold text-brand-primary-600 mb-2">$9</div>
              <div className="text-brand-secondary-600 mb-4">per month</div>
              <ul className="space-y-2 text-sm text-brand-secondary-700 text-left">
                <li>• 100,000 requests/day</li>
                <li>• All endpoints</li>
                <li>• Priority support</li>
                <li>• API key authentication</li>
                <li>• Batch processing</li>
              </ul>
            </div>
            
            <div className="bg-brand-secondary-50 rounded-xl p-6 border border-brand-secondary-200 text-center">
              <h3 className="text-xl font-semibold text-brand-secondary-900 mb-4">Enterprise</h3>
              <div className="text-3xl font-bold text-brand-primary-600 mb-2">Custom</div>
              <div className="text-brand-secondary-600 mb-4">pricing</div>
              <ul className="space-y-2 text-sm text-brand-secondary-700 text-left">
                <li>• Unlimited requests</li>
                <li>• Custom endpoints</li>
                <li>• Dedicated support</li>
                <li>• SLA guarantee</li>
                <li>• On-premise deployment</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Internal Links */}
      <section className="py-16 px-4 bg-brand-secondary-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-brand-secondary-900 mb-8 text-center">
            Try Our Web Tools
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <a 
              href="/" 
              className="bg-white p-6 rounded-xl border border-brand-secondary-200 hover:border-brand-primary-300 transition-colors text-center"
            >
              <h3 className="font-semibold text-brand-secondary-900 mb-2">Unix Converter</h3>
              <p className="text-brand-secondary-600 text-sm">Free online Unix timestamp converter tool.</p>
            </a>
            <a 
              href="/timestamp-converter/" 
              className="bg-white p-6 rounded-xl border border-brand-secondary-200 hover:border-brand-primary-300 transition-colors text-center"
            >
              <h3 className="font-semibold text-brand-secondary-900 mb-2">Timestamp Converter</h3>
              <p className="text-brand-secondary-600 text-sm">Universal timestamp format converter.</p>
            </a>
            <a 
              href="/epoch-converter/" 
              className="bg-white p-6 rounded-xl border border-brand-secondary-200 hover:border-brand-primary-300 transition-colors text-center"
            >
              <h3 className="font-semibold text-brand-secondary-900 mb-2">Epoch Converter</h3>
              <p className="text-brand-secondary-600 text-sm">Convert epoch time to human-readable dates.</p>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
