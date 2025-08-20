const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Blog post content with SEO optimization and internal linking
const blogPost = {
  title: "Microservices Time Synchronization: Distributed Systems Timing Guide",
  slug: "microservices-time-synchronization-distributed-systems-2024",
  excerpt: "Master time synchronization in microservices architectures. Learn distributed systems timing, event ordering, consistency patterns, and advanced strategies for building reliable time-aware distributed systems.",
  meta_title: "Microservices Time Synchronization: Complete Distributed Systems Guide 2024",
  meta_description: "Learn microservices time synchronization and distributed systems timing. Master event ordering, consistency patterns, clock synchronization, and advanced strategies for time-aware architectures.",
  content: `
# Microservices Time Synchronization: Distributed Systems Timing Guide

Time synchronization in microservices architectures presents unique challenges that don't exist in monolithic applications. When multiple services across different servers, data centers, or cloud regions need to coordinate time-sensitive operations, ensuring consistent timing becomes critical for system reliability and data integrity.

This comprehensive guide explores the complexities of time synchronization in distributed systems and provides practical solutions for building robust, time-aware microservices architectures.

## The Distributed Time Challenge

### Why Time Synchronization Matters in Microservices

In distributed systems, time synchronization affects:

- **Event Ordering**: Determining the correct sequence of events across services
- **Data Consistency**: Ensuring consistent timestamps in distributed transactions
- **Audit Trails**: Maintaining accurate logs across multiple services
- **Rate Limiting**: Coordinating rate limits across service instances
- **Caching**: Managing cache expiration across distributed caches
- **Monitoring**: Correlating metrics and logs from different services

### The Fundamental Problem

Unlike monolithic applications where all components share the same system clock, microservices run on different machines with potentially different clocks. This leads to:

- **Clock Drift**: System clocks gradually diverge over time
- **Network Latency**: Time synchronization protocols have inherent delays
- **Timezone Differences**: Services may run in different geographic regions
- **Leap Seconds**: Occasional adjustments to UTC can cause timing issues

## Clock Synchronization Fundamentals

### Network Time Protocol (NTP)

NTP is the standard protocol for synchronizing clocks across networks:

\`\`\`bash
# Configure NTP on Ubuntu/Debian
sudo apt-get install ntp
sudo systemctl enable ntp
sudo systemctl start ntp

# Check NTP status
ntpq -p

# Example NTP configuration (/etc/ntp.conf)
server 0.pool.ntp.org iburst
server 1.pool.ntp.org iburst
server 2.pool.ntp.org iburst
server 3.pool.ntp.org iburst

# Restrict access
restrict default kod notrap nomodify nopeer noquery
restrict 127.0.0.1
restrict ::1
\`\`\`

### Precision Time Protocol (PTP)

For high-precision applications requiring microsecond accuracy:

\`\`\`bash
# Install PTP daemon
sudo apt-get install linuxptp

# Configure PTP (/etc/linuxptp/ptp4l.conf)
[global]
dataset_comparison     G.8275.x
G.8275.defaultDS.localPriority     128
priority1              128
priority2              128
domainNumber           24
logging_level          6
path_trace_enabled     1
follow_up_capable      1
hardware_ts_all        1

# Start PTP daemon
sudo systemctl enable ptp4l
sudo systemctl start ptp4l
\`\`\`

### Cloud Provider Time Synchronization

#### AWS Time Sync Service

\`\`\`bash
# Configure Amazon Time Sync Service
sudo chrony sources -v

# /etc/chrony/chrony.conf
server 169.254.169.123 prefer iburst minpoll 4 maxpoll 4
\`\`\`

#### Google Cloud Time

\`\`\`bash
# Google Cloud uses metadata.google.internal
server metadata.google.internal prefer iburst
\`\`\`

#### Azure Time Service

\`\`\`bash
# Azure provides time.windows.com
server time.windows.com prefer iburst
\`\`\`

## Event Ordering Strategies

### Logical Clocks

#### Lamport Timestamps

\`\`\`javascript
// Lamport timestamp implementation
class LamportClock {
  constructor(nodeId) {
    this.nodeId = nodeId;
    this.counter = 0;
  }

  tick() {
    this.counter++;
    return this.getTimestamp();
  }

  update(receivedTimestamp) {
    this.counter = Math.max(this.counter, receivedTimestamp.counter) + 1;
    return this.getTimestamp();
  }

  getTimestamp() {
    return {
      counter: this.counter,
      nodeId: this.nodeId
    };
  }

  compare(ts1, ts2) {
    if (ts1.counter < ts2.counter) return -1;
    if (ts1.counter > ts2.counter) return 1;
    return ts1.nodeId.localeCompare(ts2.nodeId);
  }
}

// Usage in microservice
class OrderService {
  constructor(serviceId) {
    this.clock = new LamportClock(serviceId);
    this.events = [];
  }

  createOrder(orderData) {
    const timestamp = this.clock.tick();
    const event = {
      type: 'ORDER_CREATED',
      data: orderData,
      timestamp: timestamp,
      wallClockTime: Date.now()
    };
    
    this.events.push(event);
    this.publishEvent(event);
    
    return event;
  }

  handleExternalEvent(event) {
    const timestamp = this.clock.update(event.timestamp);
    
    // Process event with updated logical time
    const processedEvent = {
      ...event,
      processedAt: timestamp,
      processedBy: this.clock.nodeId
    };
    
    this.events.push(processedEvent);
    return processedEvent;
  }

  publishEvent(event) {
    // Publish to message queue with logical timestamp
    console.log(\`Publishing event with timestamp: \${JSON.stringify(event.timestamp)}\`);
  }
}
\`\`\`

#### Vector Clocks

\`\`\`javascript
// Vector clock implementation for better causality tracking
class VectorClock {
  constructor(nodeId, nodes) {
    this.nodeId = nodeId;
    this.nodes = nodes;
    this.clock = {};
    
    // Initialize clock for all nodes
    nodes.forEach(node => {
      this.clock[node] = 0;
    });
  }

  tick() {
    this.clock[this.nodeId]++;
    return this.getClock();
  }

  update(receivedClock) {
    // Update each component to max of local and received
    Object.keys(receivedClock).forEach(node => {
      this.clock[node] = Math.max(
        this.clock[node] || 0, 
        receivedClock[node] || 0
      );
    });
    
    // Increment own counter
    this.clock[this.nodeId]++;
    
    return this.getClock();
  }

  getClock() {
    return { ...this.clock };
  }

  compare(clock1, clock2) {
    let clock1Greater = false;
    let clock2Greater = false;
    
    const allNodes = new Set([
      ...Object.keys(clock1),
      ...Object.keys(clock2)
    ]);
    
    for (const node of allNodes) {
      const val1 = clock1[node] || 0;
      const val2 = clock2[node] || 0;
      
      if (val1 > val2) clock1Greater = true;
      if (val2 > val1) clock2Greater = true;
    }
    
    if (clock1Greater && !clock2Greater) return 1;  // clock1 > clock2
    if (clock2Greater && !clock1Greater) return -1; // clock1 < clock2
    return 0; // concurrent or equal
  }

  happensBefore(clock1, clock2) {
    return this.compare(clock1, clock2) === -1;
  }

  isConcurrent(clock1, clock2) {
    return this.compare(clock1, clock2) === 0;
  }
}

// Usage in distributed system
class DistributedEventStore {
  constructor(serviceId, allServices) {
    this.serviceId = serviceId;
    this.vectorClock = new VectorClock(serviceId, allServices);
    this.events = [];
  }

  recordEvent(eventType, data) {
    const timestamp = this.vectorClock.tick();
    
    const event = {
      id: this.generateEventId(),
      type: eventType,
      data: data,
      timestamp: timestamp,
      serviceId: this.serviceId,
      wallClockTime: Date.now()
    };
    
    this.events.push(event);
    this.broadcastEvent(event);
    
    return event;
  }

  receiveEvent(event) {
    const updatedTimestamp = this.vectorClock.update(event.timestamp);
    
    const receivedEvent = {
      ...event,
      receivedAt: updatedTimestamp,
      receivedBy: this.serviceId
    };
    
    this.events.push(receivedEvent);
    this.processEvent(receivedEvent);
    
    return receivedEvent;
  }

  getEventHistory() {
    // Sort events by vector clock ordering
    return this.events.sort((a, b) => {
      const comparison = this.vectorClock.compare(a.timestamp, b.timestamp);
      if (comparison !== 0) return comparison;
      
      // For concurrent events, use wall clock time as tiebreaker
      return a.wallClockTime - b.wallClockTime;
    });
  }

  generateEventId() {
    return \`\${this.serviceId}-\${Date.now()}-\${Math.random().toString(36).substr(2, 9)}\`;
  }

  broadcastEvent(event) {
    // Broadcast to other services
    console.log(\`Broadcasting event: \${event.id}\`);
  }

  processEvent(event) {
    console.log(\`Processing event: \${event.id} from \${event.serviceId}\`);
  }
}
\`\`\`

### Hybrid Logical Clocks (HLC)

\`\`\`javascript
// Hybrid Logical Clock combining logical and physical time
class HybridLogicalClock {
  constructor(nodeId) {
    this.nodeId = nodeId;
    this.logicalTime = 0;
    this.lastPhysicalTime = 0;
  }

  now() {
    const physicalTime = Date.now();
    
    if (physicalTime > this.lastPhysicalTime) {
      this.logicalTime = 0;
      this.lastPhysicalTime = physicalTime;
    } else {
      this.logicalTime++;
    }
    
    return {
      physicalTime: this.lastPhysicalTime,
      logicalTime: this.logicalTime,
      nodeId: this.nodeId
    };
  }

  update(receivedTimestamp) {
    const physicalTime = Date.now();
    const receivedPhysical = receivedTimestamp.physicalTime;
    const receivedLogical = receivedTimestamp.logicalTime;
    
    if (physicalTime > this.lastPhysicalTime && physicalTime > receivedPhysical) {
      this.lastPhysicalTime = physicalTime;
      this.logicalTime = 0;
    } else if (this.lastPhysicalTime > receivedPhysical) {
      this.logicalTime++;
    } else if (receivedPhysical > this.lastPhysicalTime) {
      this.lastPhysicalTime = receivedPhysical;
      this.logicalTime = receivedLogical + 1;
    } else {
      // this.lastPhysicalTime === receivedPhysical
      this.logicalTime = Math.max(this.logicalTime, receivedLogical) + 1;
    }
    
    return this.now();
  }

  compare(ts1, ts2) {
    if (ts1.physicalTime < ts2.physicalTime) return -1;
    if (ts1.physicalTime > ts2.physicalTime) return 1;
    
    if (ts1.logicalTime < ts2.logicalTime) return -1;
    if (ts1.logicalTime > ts2.logicalTime) return 1;
    
    return ts1.nodeId.localeCompare(ts2.nodeId);
  }

  toString(timestamp) {
    return \`\${timestamp.physicalTime}.\${timestamp.logicalTime}@\${timestamp.nodeId}\`;
  }
}

// Usage in microservice with HLC
class PaymentService {
  constructor(serviceId) {
    this.serviceId = serviceId;
    this.hlc = new HybridLogicalClock(serviceId);
    this.transactions = [];
  }

  processPayment(paymentData) {
    const timestamp = this.hlc.now();
    
    const transaction = {
      id: this.generateTransactionId(),
      ...paymentData,
      timestamp: timestamp,
      status: 'PROCESSING',
      createdAt: new Date().toISOString()
    };
    
    this.transactions.push(transaction);
    
    // Publish event with HLC timestamp
    this.publishEvent('PAYMENT_PROCESSING', transaction);
    
    return transaction;
  }

  handlePaymentConfirmation(event) {
    const updatedTimestamp = this.hlc.update(event.timestamp);
    
    const transaction = this.transactions.find(t => t.id === event.transactionId);
    if (transaction) {
      transaction.status = 'CONFIRMED';
      transaction.confirmedAt = updatedTimestamp;
      
      this.publishEvent('PAYMENT_CONFIRMED', {
        transactionId: transaction.id,
        timestamp: updatedTimestamp
      });
    }
  }

  generateTransactionId() {
    const timestamp = this.hlc.now();
    return \`txn_\${this.hlc.toString(timestamp)}\`;
  }

  publishEvent(eventType, data) {
    console.log(\`[\${this.serviceId}] \${eventType}: \${JSON.stringify(data)}\`);
  }
}
\`\`\`

## Consistency Patterns

### Eventually Consistent Systems

\`\`\`javascript
// Event sourcing with eventual consistency
class EventSourcingService {
  constructor(serviceId) {
    this.serviceId = serviceId;
    this.eventStore = [];
    this.snapshots = new Map();
    this.hlc = new HybridLogicalClock(serviceId);
  }

  appendEvent(aggregateId, eventType, eventData) {
    const timestamp = this.hlc.now();
    
    const event = {
      id: this.generateEventId(),
      aggregateId: aggregateId,
      eventType: eventType,
      eventData: eventData,
      timestamp: timestamp,
      version: this.getNextVersion(aggregateId),
      serviceId: this.serviceId
    };
    
    this.eventStore.push(event);
    this.publishEvent(event);
    
    return event;
  }

  replayEvents(aggregateId, fromVersion = 0) {
    const events = this.eventStore
      .filter(e => e.aggregateId === aggregateId && e.version > fromVersion)
      .sort((a, b) => this.hlc.compare(a.timestamp, b.timestamp));
    
    let aggregate = this.snapshots.get(aggregateId) || this.createEmptyAggregate(aggregateId);
    
    events.forEach(event => {
      aggregate = this.applyEvent(aggregate, event);
    });
    
    return aggregate;
  }

  createSnapshot(aggregateId) {
    const aggregate = this.replayEvents(aggregateId);
    this.snapshots.set(aggregateId, {
      ...aggregate,
      snapshotVersion: aggregate.version,
      snapshotTimestamp: this.hlc.now()
    });
    
    return aggregate;
  }

  handleExternalEvent(event) {
    const updatedTimestamp = this.hlc.update(event.timestamp);
    
    // Check for conflicts
    const existingEvents = this.eventStore.filter(e => 
      e.aggregateId === event.aggregateId && 
      e.version >= event.version
    );
    
    if (existingEvents.length > 0) {
      // Handle conflict resolution
      this.resolveConflict(event, existingEvents);
    } else {
      // No conflict, apply event
      this.eventStore.push({
        ...event,
        receivedAt: updatedTimestamp,
        receivedBy: this.serviceId
      });
    }
  }

  resolveConflict(incomingEvent, existingEvents) {
    // Implement conflict resolution strategy
    console.log(\`Conflict detected for aggregate \${incomingEvent.aggregateId}\`);
    
    // Strategy 1: Last-writer-wins based on HLC
    const latestEvent = existingEvents.reduce((latest, current) => 
      this.hlc.compare(current.timestamp, latest.timestamp) > 0 ? current : latest
    );
    
    if (this.hlc.compare(incomingEvent.timestamp, latestEvent.timestamp) > 0) {
      // Incoming event is newer, accept it
      this.eventStore.push(incomingEvent);
    }
    
    // Strategy 2: Merge conflicts (application-specific)
    // Strategy 3: Manual resolution required
  }

  getNextVersion(aggregateId) {
    const events = this.eventStore.filter(e => e.aggregateId === aggregateId);
    return events.length > 0 ? Math.max(...events.map(e => e.version)) + 1 : 1;
  }

  generateEventId() {
    const timestamp = this.hlc.now();
    return \`evt_\${this.hlc.toString(timestamp)}\`;
  }

  createEmptyAggregate(aggregateId) {
    return {
      id: aggregateId,
      version: 0,
      data: {}
    };
  }

  applyEvent(aggregate, event) {
    // Apply event to aggregate (domain-specific logic)
    return {
      ...aggregate,
      version: event.version,
      data: {
        ...aggregate.data,
        [event.eventType]: event.eventData
      }
    };
  }

  publishEvent(event) {
    // Publish to message queue or event bus
    console.log(\`Publishing event: \${event.id}\`);
  }
}
\`\`\`

### Strong Consistency with Distributed Locks

\`\`\`javascript
// Distributed lock implementation using Redis
const Redis = require('ioredis');

class DistributedLock {
  constructor(redisClient, lockKey, ttlMs = 30000) {
    this.redis = redisClient;
    this.lockKey = lockKey;
    this.ttlMs = ttlMs;
    this.lockValue = null;
  }

  async acquire(timeoutMs = 10000) {
    const startTime = Date.now();
    this.lockValue = this.generateLockValue();
    
    while (Date.now() - startTime < timeoutMs) {
      const result = await this.redis.set(
        this.lockKey,
        this.lockValue,
        'PX', this.ttlMs,
        'NX'
      );
      
      if (result === 'OK') {
        // Lock acquired successfully
        this.startHeartbeat();
        return true;
      }
      
      // Wait before retrying
      await this.sleep(100);
    }
    
    return false; // Failed to acquire lock
  }

  async release() {
    if (!this.lockValue) return false;
    
    this.stopHeartbeat();
    
    // Lua script to ensure we only release our own lock
    const script = \`
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    \`;
    
    const result = await this.redis.eval(script, 1, this.lockKey, this.lockValue);
    this.lockValue = null;
    
    return result === 1;
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(async () => {
      if (this.lockValue) {
        // Extend lock TTL
        const script = \`
          if redis.call("get", KEYS[1]) == ARGV[1] then
            return redis.call("pexpire", KEYS[1], ARGV[2])
          else
            return 0
          end
        \`;
        
        await this.redis.eval(script, 1, this.lockKey, this.lockValue, this.ttlMs);
      }
    }, this.ttlMs / 3);
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  generateLockValue() {
    return \`\${process.pid}-\${Date.now()}-\${Math.random().toString(36).substr(2, 9)}\`;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Usage in microservice for strong consistency
class InventoryService {
  constructor(serviceId, redisClient) {
    this.serviceId = serviceId;
    this.redis = redisClient;
    this.hlc = new HybridLogicalClock(serviceId);
  }

  async reserveInventory(productId, quantity) {
    const lockKey = \`inventory_lock:\${productId}\`;
    const lock = new DistributedLock(this.redis, lockKey);
    
    try {
      const acquired = await lock.acquire(5000); // 5 second timeout
      if (!acquired) {
        throw new Error('Failed to acquire inventory lock');
      }
      
      // Critical section - strong consistency guaranteed
      const currentInventory = await this.getInventory(productId);
      
      if (currentInventory < quantity) {
        throw new Error('Insufficient inventory');
      }
      
      const timestamp = this.hlc.now();
      const reservation = {
        id: this.generateReservationId(),
        productId: productId,
        quantity: quantity,
        timestamp: timestamp,
        reservedBy: this.serviceId,
        expiresAt: Date.now() + (15 * 60 * 1000) // 15 minutes
      };
      
      await this.updateInventory(productId, currentInventory - quantity);
      await this.saveReservation(reservation);
      
      this.publishEvent('INVENTORY_RESERVED', reservation);
      
      return reservation;
      
    } finally {
      await lock.release();
    }
  }

  async getInventory(productId) {
    const inventory = await this.redis.get(\`inventory:\${productId}\`);
    return parseInt(inventory) || 0;
  }

  async updateInventory(productId, newQuantity) {
    await this.redis.set(\`inventory:\${productId}\`, newQuantity);
  }

  async saveReservation(reservation) {
    await this.redis.setex(
      \`reservation:\${reservation.id}\`,
      900, // 15 minutes
      JSON.stringify(reservation)
    );
  }

  generateReservationId() {
    const timestamp = this.hlc.now();
    return \`res_\${this.hlc.toString(timestamp)}\`;
  }

  publishEvent(eventType, data) {
    console.log(\`[\${this.serviceId}] \${eventType}: \${JSON.stringify(data)}\`);
  }
}
\`\`\`

## Monitoring and Observability

### Clock Drift Detection

\`\`\`javascript
// Service to monitor clock drift across microservices
class ClockDriftMonitor {
  constructor(services) {
    this.services = services;
    this.driftThresholdMs = 1000; // 1 second
    this.checkIntervalMs = 60000; // 1 minute
    this.metrics = [];
  }

  start() {
    this.intervalId = setInterval(() => {
      this.checkClockDrift();
    }, this.checkIntervalMs);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  async checkClockDrift() {
    const referenceTime = Date.now();
    const results = [];
    
    for (const service of this.services) {
      try {
        const serviceTime = await this.getServiceTime(service);
        const drift = Math.abs(serviceTime - referenceTime);
        
        results.push({
          service: service.name,
          serviceTime: serviceTime,
          referenceTime: referenceTime,
          drift: drift,
          timestamp: referenceTime
        });
        
        if (drift > this.driftThresholdMs) {
          this.alertClockDrift(service, drift);
        }
        
      } catch (error) {
        console.error(\`Failed to check time for service \${service.name}:\`, error);
      }
    }
    
    this.metrics.push({
      timestamp: referenceTime,
      results: results
    });
    
    // Keep only last 24 hours of metrics
    const cutoff = referenceTime - (24 * 60 * 60 * 1000);
    this.metrics = this.metrics.filter(m => m.timestamp > cutoff);
  }

  async getServiceTime(service) {
    const response = await fetch(\`\${service.url}/health/time\`);
    const data = await response.json();
    return data.timestamp;
  }

  alertClockDrift(service, drift) {
    console.warn(\`Clock drift detected: \${service.name} is \${drift}ms off\`);
    
    // Send alert to monitoring system
    this.sendAlert({
      type: 'CLOCK_DRIFT',
      service: service.name,
      drift: drift,
      threshold: this.driftThresholdMs,
      timestamp: Date.now()
    });
  }

  sendAlert(alert) {
    // Integration with monitoring systems (Prometheus, DataDog, etc.)
    console.log('ALERT:', JSON.stringify(alert));
  }

  getDriftReport() {
    const latest = this.metrics[this.metrics.length - 1];
    if (!latest) return null;
    
    return {
      timestamp: latest.timestamp,
      services: latest.results.map(r => ({
        name: r.service,
        drift: r.drift,
        status: r.drift > this.driftThresholdMs ? 'DRIFT_DETECTED' : 'OK'
      })),
      maxDrift: Math.max(...latest.results.map(r => r.drift)),
      avgDrift: latest.results.reduce((sum, r) => sum + r.drift, 0) / latest.results.length
    };
  }
}
\`\`\`

### Distributed Tracing with Time Correlation

\`\`\`javascript
// Distributed tracing with time correlation
class DistributedTracer {
  constructor(serviceId) {
    this.serviceId = serviceId;
    this.hlc = new HybridLogicalClock(serviceId);
    this.activeSpans = new Map();
  }

  startSpan(operationName, parentSpan = null) {
    const timestamp = this.hlc.now();
    const spanId = this.generateSpanId();
    
    const span = {
      spanId: spanId,
      traceId: parentSpan ? parentSpan.traceId : this.generateTraceId(),
      parentSpanId: parentSpan ? parentSpan.spanId : null,
      operationName: operationName,
      serviceId: this.serviceId,
      startTime: timestamp,
      startWallTime: Date.now(),
      tags: {},
      logs: [],
      finished: false
    };
    
    this.activeSpans.set(spanId, span);
    return span;
  }

  finishSpan(span) {
    if (span.finished) return;
    
    const timestamp = this.hlc.now();
    span.endTime = timestamp;
    span.endWallTime = Date.now();
    span.duration = span.endWallTime - span.startWallTime;
    span.finished = true;
    
    this.activeSpans.delete(span.spanId);
    this.reportSpan(span);
  }

  addTag(span, key, value) {
    span.tags[key] = value;
  }

  addLog(span, message, fields = {}) {
    const timestamp = this.hlc.now();
    span.logs.push({
      timestamp: timestamp,
      wallTime: Date.now(),
      message: message,
      fields: fields
    });
  }

  injectContext(span) {
    return {
      'x-trace-id': span.traceId,
      'x-span-id': span.spanId,
      'x-hlc-time': this.hlc.toString(span.startTime)
    };
  }

  extractContext(headers) {
    if (!headers['x-trace-id']) return null;
    
    const hlcTime = headers['x-hlc-time'];
    if (hlcTime) {
      // Update HLC with received timestamp
      const receivedTimestamp = this.parseHLCString(hlcTime);
      this.hlc.update(receivedTimestamp);
    }
    
    return {
      traceId: headers['x-trace-id'],
      parentSpanId: headers['x-span-id']
    };
  }

  parseHLCString(hlcString) {
    // Parse "physicalTime.logicalTime@nodeId" format
    const [timePart, nodeId] = hlcString.split('@');
    const [physicalTime, logicalTime] = timePart.split('.');
    
    return {
      physicalTime: parseInt(physicalTime),
      logicalTime: parseInt(logicalTime),
      nodeId: nodeId
    };
  }

  generateSpanId() {
    return Math.random().toString(16).substr(2, 16);
  }

  generateTraceId() {
    return Math.random().toString(16).substr(2, 32);
  }

  reportSpan(span) {
    // Send span to tracing backend (Jaeger, Zipkin, etc.)
    console.log(\`Span completed: \${span.operationName} (\${span.duration}ms)\`);
  }
}

// Usage in microservice
class OrderService {
  constructor(serviceId) {
    this.serviceId = serviceId;
    this.tracer = new DistributedTracer(serviceId);
  }

  async processOrder(orderData, parentContext = null) {
    const span = this.tracer.startSpan('process_order', parentContext);
    this.tracer.addTag(span, 'order.id', orderData.id);
    
    try {
      // Validate order
      const validationSpan = this.tracer.startSpan('validate_order', span);
      await this.validateOrder(orderData);
      this.tracer.finishSpan(validationSpan);
      
      // Call payment service
      const paymentSpan = this.tracer.startSpan('process_payment', span);
      const paymentResult = await this.callPaymentService(orderData, paymentSpan);
      this.tracer.addTag(paymentSpan, 'payment.status', paymentResult.status);
      this.tracer.finishSpan(paymentSpan);
      
      // Update inventory
      const inventorySpan = this.tracer.startSpan('update_inventory', span);
      await this.updateInventory(orderData, inventorySpan);
      this.tracer.finishSpan(inventorySpan);
      
      this.tracer.addTag(span, 'order.status', 'completed');
      return { status: 'success', orderId: orderData.id };
      
    } catch (error) {
      this.tracer.addTag(span, 'error', true);
      this.tracer.addLog(span, 'Order processing failed', { error: error.message });
      throw error;
    } finally {
      this.tracer.finishSpan(span);
    }
  }

  async callPaymentService(orderData, parentSpan) {
    const headers = this.tracer.injectContext(parentSpan);
    
    const response = await fetch('http://payment-service/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify(orderData)
    });
    
    return response.json();
  }

  async validateOrder(orderData) {
    // Order validation logic
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  async updateInventory(orderData, parentSpan) {
    // Inventory update logic
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}
\`\`\`

## Tools and Resources

### Essential Time Synchronization Tools

1. **[Unix Timestamp Converter](/timestamp-converter)** - Convert timestamps for debugging distributed systems timing issues
2. **[Epoch Converter](/epoch-converter)** - Advanced timestamp conversion for microservices development
3. **[Unix Time to Date](/unix-time-to-date)** - Quick conversion for analyzing distributed logs and events

### Monitoring and Observability Tools

#### Open Source
- **Prometheus**: Metrics collection and alerting
- **Grafana**: Visualization and dashboards
- **Jaeger**: Distributed tracing
- **Zipkin**: Distributed tracing alternative
- **ELK Stack**: Centralized logging

#### Commercial
- **DataDog**: Full-stack monitoring
- **New Relic**: Application performance monitoring
- **Splunk**: Log analysis and monitoring
- **Honeycomb**: Observability platform

### Time Synchronization Protocols

- **NTP (Network Time Protocol)**: Standard time synchronization
- **PTP (Precision Time Protocol)**: High-precision synchronization
- **Chrony**: Modern NTP implementation
- **timesyncd**: Systemd time synchronization

## Best Practices Summary

### Time Synchronization Principles

1. **Use NTP or PTP** for physical clock synchronization
2. **Implement logical clocks** for event ordering
3. **Choose appropriate consistency models** based on requirements
4. **Monitor clock drift** continuously
5. **Use distributed tracing** for time correlation
6. **Handle clock adjustments** gracefully
7. **Test time-dependent logic** thoroughly

### Architecture Patterns

✅ **Recommended Patterns:**
- Event sourcing with logical timestamps
- CQRS with eventual consistency
- Saga pattern for distributed transactions
- Circuit breaker for time-sensitive operations
- Bulkhead pattern for time isolation

❌ **Anti-Patterns to Avoid:**
- Relying solely on wall clock time
- Ignoring clock drift in distributed systems
- Using blocking synchronization across services
- Assuming perfect time synchronization
- Neglecting timezone handling in global systems

## Conclusion

Time synchronization in microservices architectures requires careful consideration of both physical and logical time. By implementing appropriate clock synchronization, event ordering strategies, and consistency patterns, you can build robust distributed systems that handle time-dependent operations reliably.

### Key Takeaways

1. **Physical clocks drift** - use NTP/PTP for synchronization
2. **Logical clocks provide ordering** - implement Lamport, Vector, or HLC
3. **Choose consistency models** based on business requirements
4. **Monitor and alert** on clock drift and timing issues
5. **Use distributed tracing** for time correlation across services
6. **Test thoroughly** with time-dependent scenarios

For quick timestamp conversions during microservices development and debugging, bookmark our [timestamp conversion tools](/timestamp-converter) and explore our other utilities for working with distributed systems timing.

---

*Need to convert timestamps for microservices debugging? Try our [Unix Timestamp Converter](/timestamp-converter) or explore our other time-related tools. Have questions about distributed systems timing? Feel free to reach out to our team.*
`,
  status: 'published',
  published_date: new Date().toISOString(),
  featured_image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=630&fit=crop&crop=center'
}

// Categories and tags for the post
const categories = ['Technology', 'Tutorials']
const tags = ['Microservices', 'Distributed Systems', 'Time Synchronization', 'Event Ordering', 'Consistency', 'Architecture', 'NTP', 'Logical Clocks', 'System Design', 'Observability']

async function createBlogPost() {
  try {
    console.log('🚀 Creating Microservices Time Synchronization blog post...')
    
    // Get admin user
    console.log('👤 Finding admin user...')
    const { data: adminUser, error: userError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('role', 'admin')
      .single()

    if (userError || !adminUser) {
      throw new Error('Admin user not found. Please create an admin user first.')
    }

    console.log(`   Found admin: ${adminUser.full_name || adminUser.email}`)

    // Check if post already exists
    console.log('🔍 Checking if post already exists...')
    const { data: existingPost } = await supabase
      .from('blog_posts')
      .select('id, title, slug')
      .eq('slug', blogPost.slug)
      .single()

    if (existingPost) {
      console.log('❌ Blog post with this slug already exists!')
      console.log(`   Post: "${existingPost.title}"`)
      console.log(`   Slug: ${existingPost.slug}`)
      return
    }

    // Create the blog post
    console.log('📝 Creating blog post...')
    const { data: newPost, error: postError } = await supabase
      .from('blog_posts')
      .insert({
        ...blogPost,
        author_id: adminUser.id
      })
      .select()
      .single()

    if (postError) {
      throw new Error(`Failed to create blog post: ${postError.message}`)
    }

    console.log(`   ✅ Created post: "${newPost.title}"`)
    console.log(`   📝 Slug: ${newPost.slug}`)
    console.log(`   🆔 ID: ${newPost.id}`)

    // Add categories
    console.log('📂 Adding categories...')
    for (const categoryName of categories) {
      const { data: category } = await supabase
        .from('blog_categories')
        .select('id')
        .eq('name', categoryName)
        .single()

      if (category) {
        await supabase
          .from('blog_post_categories')
          .insert({
            post_id: newPost.id,
            category_id: category.id
          })
        console.log(`   ✅ Added category: ${categoryName}`)
      }
    }

    // Add tags
    console.log('🏷️  Adding tags...')
    for (const tagName of tags) {
      // Try to find existing tag
      let { data: tag } = await supabase
        .from('blog_tags')
        .select('id')
        .eq('name', tagName)
        .single()

      // Create tag if it doesn't exist
      if (!tag) {
        const { data: newTag, error: tagError } = await supabase
          .from('blog_tags')
          .insert({
            name: tagName,
            slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
          })
          .select()
          .single()

        if (tagError) {
          console.log(`   ⚠️  Failed to create tag: ${tagName}`)
          continue
        }
        tag = newTag
        console.log(`   ➕ Created new tag: ${tagName}`)
      }

      // Link tag to post
      await supabase
        .from('blog_post_tags')
        .insert({
          post_id: newPost.id,
          tag_id: tag.id
        })
      console.log(`   ✅ Added tag: ${tagName}`)
    }

    console.log('\n🎉 Blog post created successfully!')
    console.log('\n📊 Summary:')
    console.log(`   📝 Title: ${newPost.title}`)
    console.log(`   🔗 Slug: ${newPost.slug}`)
    console.log(`   📂 Categories: ${categories.join(', ')}`)
    console.log(`   🏷️  Tags: ${tags.join(', ')}`)
    console.log(`   📅 Published: ${newPost.published_date}`)
    console.log(`   ⏱️  Reading time: ${newPost.reading_time} minutes`)
    console.log('\n🌐 URLs:')
    console.log(`   📖 Blog post: http://localhost:3000/blog/${newPost.slug}`)
    console.log(`   ⚙️  Admin edit: http://localhost:3000/admin/posts/${newPost.id}/edit`)

  } catch (error) {
    console.error('❌ Error creating blog post:', error.message)
    process.exit(1)
  }
}

// Run the script
createBlogPost()
