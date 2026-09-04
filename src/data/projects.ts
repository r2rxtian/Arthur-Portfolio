import type { Project } from '../types/portfolio';

export const projectsData: Project[] = [
  {
    id: 'nexus-edge',
    title: 'NexusEdge Gateway',
    tagline: 'Distributed multi-region API Gateway & edge caching engine',
    category: 'Systems & Cloud',
    featured: true,
    thumbnailGradient: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
    executive: {
      businessChallenge:
        'Legacy API infrastructure was suffering from 480ms p99 latency under global traffic surges, resulting in dropped checkout conversions during flash sales.',
      strategicSolution:
        'Architected an edge-native reverse-proxy layer with dynamic stale-while-revalidate caching and intelligent GeoDNS load balancing across 18 edge locations.',
      quantifiableImpact: [
        'Reduced p99 global latency from 480ms to 64ms (86% reduction)',
        'Cut infrastructure cloud ingress/egress spend by 38%',
        'Maintained 100% uptime through 12.5M request-per-minute Black Friday peak',
      ],
      role: 'Lead Cloud & Systems Architect',
    },
    technical: {
      architecture:
        'Rust/Go core routing engine deployed on Fly.io edge workers with Redis cluster cache tier and eBPF network telemetry.',
      techStack: ['Go', 'TypeScript', 'Redis Cluster', 'Docker', 'Prometheus', 'Grafana'],
      keyFeatures: [
        'Sub-millisecond token-bucket rate limiting',
        'Automatic TLS termination with zero-downtime certificate rotation',
        'OpenTelemetry tracing injected at transport layer',
        'Adaptive compression (Brotli/Gzip) based on payload structure',
      ],
      codeSnippet: {
        filename: 'gateway/ratelimit.go',
        language: 'go',
        code: `package gateway

import (
	"context"
	"fmt"
	"time"
	"github.com/redis/go-redis/v9"
)

type TokenBucket struct {
	client   *redis.Client
	capacity int64
	refillRate float64
}

// Allow checks if the client key has tokens remaining in the sliding window
func (tb *TokenBucket) Allow(ctx context.Context, clientKey string) (bool, error) {
	key := fmt.Sprintf("rate:%s", clientKey)
	now := time.Now().UnixNano()
	
	pipe := tb.client.TxPipeline()
	pipe.ZRemRangeByScore(ctx, key, "0", fmt.Sprintf("%d", now-1e9))
	countCmd := pipe.ZCard(ctx, key)
	pipe.ZAdd(ctx, key, redis.Z{Score: float64(now), Member: now})
	pipe.Expire(ctx, key, 2*time.Second)
	
	_, err := pipe.Exec(ctx)
	if err != nil {
		return false, err
	}
	return countCmd.Val() <= tb.capacity, nil
}`,
      },
    },
    links: {
      demo: 'https://gateway-demo.nexus.dev',
      github: 'https://github.com/r2rxtian/nexus-edge',
      docs: 'https://docs.nexus.dev',
    },
  },
  {
    id: 'chronos-ai',
    title: 'Chronos Realtime Analytics',
    tagline: 'High-throughput event streaming engine with anomaly detection',
    category: 'AI & Data',
    featured: true,
    thumbnailGradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    executive: {
      businessChallenge:
        'Financial risk management operations required real-time fraud alerts, but existing batch ETL jobs ran only every 6 hours, leading to significant exposure.',
      strategicSolution:
        'Constructed a low-latency event stream processing system using Apache Kafka and lightweight ML inference pipelines capable of screening transactions sub-50ms.',
      quantifiableImpact: [
        'Prevented an estimated $1.8M in fraudulent checkout transactions within Q1',
        'Decreased fraud detection turnaround from 6 hours to 42 milliseconds',
        'Onboarded 4 enterprise financial institutions onto the automated risk engine',
      ],
      role: 'Principal Backend Engineer',
    },
    technical: {
      architecture:
        'Event-driven microservices architecture consuming Kafka streams with a vectorized Python ML worker and WebSockets feed to a React dashboard.',
      techStack: ['TypeScript', 'Kafka', 'Python/FastAPI', 'PostgreSQL', 'WebSockets', 'Tailwind/CSS'],
      keyFeatures: [
        'Backpressure-aware stream buffer with zero packet drops',
        'Lightweight XGBoost model scoring 120+ behavioural signals per millisecond',
        'Live bidirectional WebSocket push with automatic reconnect and state sync',
        'Audit-grade event replay mechanism for regulatory compliance',
      ],
      codeSnippet: {
        filename: 'analytics/stream_processor.ts',
        language: 'typescript',
        code: `import { KafkaConsumer, Message } from '@stream/broker';
import { AnomalyModel } from './models/classifier';

export class TransactionPipeline {
  private model: AnomalyModel;

  constructor() {
    this.model = new AnomalyModel({ threshold: 0.88 });
  }

  async processEvent(message: Message): Promise<void> {
    const payload = JSON.parse(message.value.toString());
    const score = await this.model.evaluate({
      amount: payload.amount,
      velocity: payload.userVelocityWindow,
      geoDistance: payload.geoDiscrepancyKm,
    });

    if (score > 0.88) {
      await this.dispatchSecurityAlert({
        transactionId: payload.id,
        riskScore: score,
        timestamp: Date.now(),
      });
    }
  }
}`,
      },
    },
    links: {
      demo: 'https://chronos-analytics.demo.dev',
      github: 'https://github.com/r2rxtian/chronos-ai',
    },
  },
  {
    id: 'hyperion-studio',
    title: 'Hyperion Design Studio',
    tagline: 'Collaborative canvas IDE for rapid UI scaffolding and live preview',
    category: 'Frontend Engineering',
    featured: true,
    thumbnailGradient: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
    executive: {
      businessChallenge:
        'Cross-functional handoff between UI designers and frontend developers was fragmented, with specs repeatedly misinterpreted across multiple iteration cycles.',
      strategicSolution:
        'Spearheaded an in-browser multiplayer design-to-code workspace with real-time CRDT synchronization, component code generation, and instant sandboxed previews.',
      quantifiableImpact: [
        'Accelerated sprint prototype velocity by 65% across 8 product squads',
        'Eliminated over 20 hours per week of manual Figma-to-code conversion work',
        'Rated 4.9/5 satisfaction by 40+ participating engineers and designers',
      ],
      role: 'Staff Frontend Engineer & Tech Lead',
    },
    technical: {
      architecture:
        'Yjs CRDTs over WebSockets for collaborative multi-cursor canvas editing, Web Workers for on-the-fly AST parsing and CSS generation.',
      techStack: ['React 19', 'TypeScript', 'Web Workers', 'Web Audio API', 'Yjs', 'Canvas API'],
      keyFeatures: [
        'Fluid 60fps infinite canvas with zoom, pan, and snap-to-grid math',
        'Conflict-free multi-user live cursors and undo/redo history trees',
        'Sandboxed iframe runtime with CSP compliance for custom user code',
        'Zero-dependency keyboard shortcut engine supporting chord bindings',
      ],
      codeSnippet: {
        filename: 'canvas/crdt_sync.ts',
        language: 'typescript',
        code: `import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

export function initializeMultiplayerRoom(roomId: string, userId: string) {
  const ydoc = new Y.Doc();
  const provider = new WebsocketProvider('wss://sync.hyperion.dev', roomId, ydoc);
  const sharedLayers = ydoc.getArray<LayerNode>('canvas-layers');
  const awareness = provider.awareness;

  awareness.setLocalStateField('user', {
    id: userId,
    color: generateUserColor(userId),
    cursor: { x: 0, y: 0 },
    activeElementId: null,
  });

  return { ydoc, sharedLayers, awareness };
}`,
      },
    },
    links: {
      demo: 'https://hyperion-studio.app',
      github: 'https://github.com/r2rxtian/hyperion-studio',
    },
  },
  {
    id: 'synapse-auth',
    title: 'Synapse Identity & Vault',
    tagline: 'Zero-knowledge biometric passkey authenticator and secret store',
    category: 'Full-Stack',
    featured: false,
    thumbnailGradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    executive: {
      businessChallenge:
        'Customer support tickets for forgotten passwords and account takeovers consumed 25% of support capacity while introducing cybersecurity vulnerabilities.',
      strategicSolution:
        'Implemented WebAuthn passkey authentication backed by encrypted zero-knowledge hardware token enclaves, completely phasing out legacy credential storage.',
      quantifiableImpact: [
        'Drop in account takeover attempts to 0% across 500k registered accounts',
        'Saved ~$120k annually in SMS 2FA delivery charges',
        'Decreased sign-in drop-off friction by 72%',
      ],
      role: 'Security & Full-Stack Engineer',
    },
    technical: {
      architecture:
        'FIDO2 / WebAuthn server implementation with Argon2id cryptographic hashing, PostgreSQL RLS, and secure enclave signature validation.',
      techStack: ['Node.js', 'TypeScript', 'WebAuthn API', 'PostgreSQL', 'Docker'],
      keyFeatures: [
        'Biometric authentication (TouchID, FaceID, Windows Hello)',
        'Zero plain-text secrets held at rest or in transit',
        'Audit logs cryptographic chaining for non-repudiation',
      ],
      codeSnippet: {
        filename: 'auth/webauthn.ts',
        language: 'typescript',
        code: `import { verifyRegistrationResponse } from '@simplewebauthn/server';

export async function verifyPasskeyRegistration(user: User, response: any) {
  const verification = await verifyRegistrationResponse({
    response,
    expectedChallenge: user.currentChallenge,
    expectedOrigin: 'https://synapse.dev',
    expectedRPID: 'synapse.dev',
  });

  if (!verification.verified || !verification.registrationInfo) {
    throw new Error('Passkey verification failed');
  }

  return verification.registrationInfo;
}`,
      },
    },
    links: {
      demo: 'https://synapse-vault.dev',
      github: 'https://github.com/r2rxtian/synapse-auth',
    },
  },
];
