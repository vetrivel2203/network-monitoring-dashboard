import React, { useState } from 'react';
import { Network, Layers, ShieldCheck, Zap, Activity, Info, BookOpen } from 'lucide-react';

const osiLayers = [
  { layer: 7, name: 'Application', pdu: 'Data', protocols: 'HTTP, HTTPS, DNS, DHCP, SSH', desc: 'Interfaces end-user applications with network services.' },
  { layer: 6, name: 'Presentation', pdu: 'Data', protocols: 'TLS/SSL, JPEG, ASCII, gzip', desc: 'Data encryption, compression, and protocol translation.' },
  { layer: 5, name: 'Session', pdu: 'Data', protocols: 'NetBIOS, RPC, Sockets', desc: 'Establishes, manages, and terminates network dialogues.' },
  { layer: 4, name: 'Transport', pdu: 'Segment (TCP) / Datagram (UDP)', protocols: 'TCP, UDP, SCTP', desc: 'End-to-end communication, flow control, and error recovery.' },
  { layer: 3, name: 'Network', pdu: 'Packet', protocols: 'IP, ICMP, IPsec, OSPF, BGP', desc: 'Logical addressing, path determination, and ICMP ping probes.' },
  { layer: 2, name: 'Data Link', pdu: 'Frame', protocols: 'Ethernet (802.3), Wi-Fi (802.11), ARP', desc: 'Physical MAC addressing, hop-to-hop transfer, and framing.' },
  { layer: 1, name: 'Physical', pdu: 'Bits', protocols: '1000BASE-T, Fiber, Radio Waves', desc: 'Transmission of raw binary bits over physical medium.' },
];

export default function NetworksLab() {
  const [selectedLayer, setSelectedLayer] = useState(osiLayers[2]); // Default Network layer (ICMP)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(15, 23, 42, 0.8))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-blue)' }}>
            <Network size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Computer Networks Core Concepts Hub
            </h2>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-dim)' }}>
              Theoretical foundations of latency, packet loss, RFC 3550 jitter, OSI 7-layer & TCP/IP architectures
            </div>
          </div>
        </div>
      </div>

      {/* Telemetry Mathematical Formulas Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Latency Formula */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '0.35rem' }}>
            1. ROUND-TRIP LATENCY (RTT)
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '8px', borderRadius: '6px', color: '#ffffff', marginBottom: '0.5rem' }}>
            RTT = t_recv - t_send
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
            Total propagation, transmission, queueing, and processing delay across intermediate network nodes.
          </p>
        </div>

        {/* Packet Loss Formula */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ef4444', marginBottom: '0.35rem' }}>
            2. PACKET LOSS RATIO
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '8px', borderRadius: '6px', color: '#ffffff', marginBottom: '0.5rem' }}>
            Loss % = ((N_sent - N_recv) / N_sent) * 100
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
            Caused by link saturation, queue overflows (tail drops), or physical bit error drops.
          </p>
        </div>

        {/* Jitter Formula */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#818cf8', marginBottom: '0.35rem' }}>
            3. RFC 3550 JITTER
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '8px', borderRadius: '6px', color: '#ffffff', marginBottom: '0.5rem' }}>
            J(i) = J(i-1) + (|D(i-1,i)| - J(i-1)) / 16
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
            Exponentially Weighted Moving Average (EWMA) filtering delay variance between packet arrivals.
          </p>
        </div>

        {/* Availability Formula */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', marginBottom: '0.35rem' }}>
            4. NETWORK AVAILABILITY
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '8px', borderRadius: '6px', color: '#ffffff', marginBottom: '0.5rem' }}>
            Avail % = (Uptime / (Uptime + Downtime)) * 100
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
            High availability (HA) SLA index衡量 endpoints target reachability and fault tolerance.
          </p>
        </div>
      </div>

      {/* OSI 7-Layer Interactive Inspector */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={18} style={{ color: 'var(--accent-cyan)' }} />
          OSI 7-Layer Reference Model Explorer
        </h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', marginBottom: '1.25rem' }}>
          Click on any layer to inspect its Protocol Data Unit (PDU), core protocols, and mapping to ICMP telemetry.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Layer stack */}
          <div className="lg:col-span-5" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {osiLayers.map((l) => {
              const isSelected = selectedLayer.layer === l.layer;
              return (
                <div
                  key={l.layer}
                  onClick={() => setSelectedLayer(l)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: isSelected ? 'rgba(0, 210, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)',
                    border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isSelected ? 'var(--accent-cyan)' : 'var(--text-dim)', width: '24px' }}>
                      L{l.layer}
                    </span>
                    <span style={{ fontWeight: isSelected ? 700 : 500, color: isSelected ? '#ffffff' : 'var(--text-muted)', fontSize: '0.875rem' }}>
                      {l.name} Layer
                    </span>
                  </div>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                    PDU: {l.pdu.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Layer Detail Panel */}
          <div className="lg:col-span-7" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '1.5rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                  Layer {selectedLayer.layer}: {selectedLayer.name}
                </span>
                <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '9999px', backgroundColor: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent-blue)', fontWeight: 600 }}>
                  PDU: {selectedLayer.pdu}
                </span>
              </div>

              <p style={{ color: 'var(--text-main)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {selectedLayer.desc}
              </p>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '0.25rem' }}>
                  PROMINENT PROTOCOLS:
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#818cf8', backgroundColor: 'rgba(0, 0, 0, 0.25)', padding: '8px 12px', borderRadius: '6px' }}>
                  {selectedLayer.protocols}
                </div>
              </div>

              {selectedLayer.layer === 3 && (
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(0, 210, 255, 0.08)', borderRadius: '6px', borderLeft: '3px solid var(--accent-cyan)' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '2px' }}>
                    Network Layer in this Project
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Our telemetry engine issues ICMP Echo Request packets (Type 8, Code 0) encapsulated within IP datagrams at Layer 3 to calculate round-trip delay.
                  </div>
                </div>
              )}
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
              TCP/IP Architecture Equivalent: {selectedLayer.layer >= 5 ? 'Application Layer' : (selectedLayer.layer === 4 ? 'Host-to-Host Transport Layer' : (selectedLayer.layer === 3 ? 'Internet Layer' : 'Network Access / Link Layer'))}
            </div>
          </div>
        </div>
      </div>

      {/* Congestion Control & QoS Deep Dive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} style={{ color: '#f59e0b' }} />
            TCP Congestion Control (AIMD & Reno)
          </h4>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
            Additive Increase / Multiplicative Decrease (AIMD) adjusts the congestion window (cwnd) based on packet loss feedback.
          </p>
          <ul style={{ fontSize: '0.75rem', color: 'var(--text-dim)', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li><strong>Slow Start:</strong> cwnd doubles every RTT until slow start threshold (ssthresh) is reached.</li>
            <li><strong>Congestion Avoidance:</strong> cwnd increases linearly by 1 MSS per RTT.</li>
            <li><strong>Packet Loss (Triple Dup ACK):</strong> cwnd is halved (multiplicative decrease) to clear router buffer queues.</li>
          </ul>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} style={{ color: '#10b981' }} />
            Quality of Service (QoS) & Bufferbloat
          </h4>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
            Quality of Service allocates prioritized bandwidth queues (DiffServ / DSCP bits) for real-time traffic.
          </p>
          <ul style={{ fontSize: '0.75rem', color: 'var(--text-dim)', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li><strong>VoIP & Gaming:</strong> Requires strict latency &lt; 150ms and jitter &lt; 30ms (EF / Expedited Forwarding).</li>
            <li><strong>Streaming Video:</strong> Tolerates higher latency if buffered, but sensitive to prolonged packet loss.</li>
            <li><strong>Active Queue Management (AQM):</strong> Algorithms like CoDel and FQ-CoDel actively drop packets early to prevent excessive queueing delays (bufferbloat).</li>
          </ul>
        </div>
      </div>
    </div>
  );
}