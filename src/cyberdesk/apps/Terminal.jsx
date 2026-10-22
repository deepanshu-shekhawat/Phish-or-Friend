import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../engine/store.jsx';
import { SITES, EMAILS } from '../engine/scenario.js';
import { parseUrl } from '../engine/urlTools.js';

const BANNER = `CyberDesk OS Terminal v1.0.4 [Build 1998.10.18]
Type "help" for a list of available network investigation commands.
`;

const DIRECTORY = {
  'maya.okafor@eastbrook.example': { name: 'Dr. Maya Okafor', role: 'Faculty', dept: 'Computer Science', phone: 'ext. 4481', status: 'Active Verified' },
  'registrar@eastbrook.example': { name: 'Registrar Enrolment Desk', role: 'Administration', dept: 'Student Records', phone: 'ext. 2100', status: 'Active Verified' },
  'helpdesk@eastbrook.example': { name: 'Alex Kim', role: 'Senior Technician', dept: 'IT Services', phone: 'ext. 1100', status: 'Active Verified' },
  'statements@northvale.example': { name: 'Northvale Bank Operations', role: 'Customer Service', dept: 'Electronic Banking', phone: '0800-555-0199', status: 'External Corporate' },
  'vance.dean@eastbrook.example': { name: 'Dean Marcus Vance', role: 'Dean', dept: 'Engineering & Computing', phone: 'ext. 1002', status: 'Active Executive' },
  'priya.nair@eastbrook.example': { name: 'Priya Nair', role: 'Student', dept: 'Undergraduate CS', phone: 'n/a', status: 'Enrolled' },
  'sam.rivera@eastbrook.example': { name: 'Sam Rivera', role: 'Student', dept: 'Undergraduate CS', phone: 'n/a', status: 'Enrolled (Incident Reported: Spam flagged)' },
};

export default function Terminal({ win }) {
  const { s, act } = useStore();
  const [history, setHistory] = useState([BANNER]);
  const [input, setInput] = useState('');
  const [cmdIndex, setCmdIndex] = useState(-1);
  const [cmdHistory, setCmdHistory] = useState([]);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (rawCmd) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    setCmdHistory(prev => [...prev, cmd]);
    setCmdIndex(-1);

    const [action, ...args] = cmd.split(/\s+/);
    const argStr = args.join(' ');
    const normalized = action.toLowerCase();

    const output = [`> ${cmd}`];

    switch (normalized) {
      case 'help':
        output.push(
          'Available Network & Threat Investigation Commands:',
          '  nslookup <domain>   - Query simulated DNS records (A, MX, Name Servers)',
          '  whois <domain>      - Query domain registration age, registrar, and owner',
          '  headers <msg-id>    - Display email envelope authentication (SPF, DKIM, DMARC)',
          '  verify <email/name> - Cross-check personnel in the official campus directory',
          '  cert <domain>       - Inspect TLS/SSL certificate subject & SAN matches',
          '  ping <host>         - Send ICMP echo requests to verify host availability',
          '  log                 - View recent OS audit events and security actions',
          '  clear               - Clear terminal buffer',
          '  exit                - Close the terminal window'
        );
        break;

      case 'clear':
      case 'cls':
        setHistory([]);
        return;

      case 'exit':
        if (win?.id) act.closeWin(win.id);
        return;

      case 'whois': {
        if (!argStr) {
          output.push('Usage: whois <domain>  (e.g., whois eastbrook.example)');
          break;
        }
        const host = argStr.replace(/^https?:\/\//, '').split('/')[0].toLowerCase();
        const site = SITES[host];
        act.log(`Terminal whois query: ${host}`);

        if (site) {
          const age = site.ageDays || 5;
          const isFresh = age < 30;
          output.push(
            `Domain Name: ${host}`,
            `Registry Domain ID: DOM_${host.replace(/\./g, '_').toUpperCase()}`,
            `Registrar: ${site.cert?.issuer || 'Fictional Registrar LLC'}`,
            `Domain Age: ${age} day(s) ${isFresh ? ' [!] HIGH RISK: RECENTLY REGISTERED' : ' [OK: Established Domain]'}`,
            `Registrant Organization: ${site.cert?.org || '(Private / Hidden by Proxy)'}`,
            `Status: ${site.reputation === 'suspicious' ? 'SUSPICIOUS / UNDER SURVEILLANCE' : 'ACTIVE / VERIFIED'}`
          );
          if (site.fake) {
            output.push(`[!] SECURITY WARNING: This domain imitates "${site.expected}".`);
          }
        } else {
          output.push(
            `Domain: ${host}`,
            'Registrar: Offshore Domain Privacy Ltd',
            'Creation Date: 2 days ago [!] HIGH RISK: NEW REGISTRATION',
            'Status: UNVERIFIED EXTERNAL DOMAIN'
          );
        }
        break;
      }

      case 'nslookup':
      case 'dig': {
        if (!argStr) {
          output.push('Usage: nslookup <domain>  (e.g., nslookup portal.eastbrook.example)');
          break;
        }
        const host = argStr.replace(/^https?:\/\//, '').split('/')[0].toLowerCase();
        const site = SITES[host];
        act.log(`Terminal nslookup query: ${host}`);

        output.push(
          `Server:   10.0.0.1 (Eastbrook Campus DNS)`,
          `Address:  10.0.0.1#53`,
          '',
          `Non-authoritative answer:`,
          `Name:     ${host}`
        );

        if (site) {
          output.push(
            `Address:  192.0.2.${Math.abs(host.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 250 + 1}`,
            `Authoritative NS: ns1.campus-dns.example, ns2.campus-dns.example`
          );
          if (site.page === 'redirect') {
            output.push(`CNAME:    ${site.redirects?.[site.redirects.length - 1] || 'target.example'}`);
          }
        } else {
          output.push(
            `Address:  198.51.100.84`,
            `Authoritative NS: ns1.external-hosted.example`
          );
        }
        break;
      }

      case 'headers': {
        output.push('Email Authentication & Transport Analysis:');
        const target = argStr.toLowerCase();
        const email = EMAILS.find(e => e.id.toLowerCase() === target || e.subject.toLowerCase().includes(target)) || EMAILS[0];

        output.push(
          `Message-ID: <${email.id}.simulated@cyberdesk>`,
          `From: "${email.fromName}" <${email.addr}>`,
          `To: student@eastbrook.example`,
          `Date: ${email.date}`,
          `Subject: ${email.subject}`,
          `Authentication-Results:`,
          `  spf=${email.truth.phish ? 'softfail (sender IP not in SPF record)' : 'pass (eastbrook.example)'}`,
          `  dkim=${email.truth.phish ? 'none / unaligned header' : 'pass header.i=@eastbrook.example'}`,
          `  dmarc=${email.truth.phish ? 'fail (p=none; quarantine recommended)' : 'pass'}`,
          `Return-Path: <${email.addr}>`
        );
        break;
      }

      case 'verify': {
        if (!argStr) {
          output.push('Usage: verify <email or name>  (e.g., verify maya.okafor@eastbrook.example)');
          break;
        }
        const query = argStr.toLowerCase();
        const found = Object.entries(DIRECTORY).find(([email, entry]) => 
          email.toLowerCase().includes(query) || entry.name.toLowerCase().includes(query)
        );

        if (found) {
          const [email, entry] = found;
          output.push(
            `Directory Record Found:`,
            `  Name:        ${entry.name}`,
            `  Role:        ${entry.role}`,
            `  Department:  ${entry.dept}`,
            `  Email:       ${email}`,
            `  Contact:     ${entry.phone}`,
            `  Status:      ${entry.status}`
          );
          act.log(`Terminal verified directory record: ${entry.name}`, 'ok');
        } else {
          output.push(
            `[-] No verified directory match found for "${argStr}".`,
            `    Warning: Unverified senders should be treated with high suspicion.`
          );
        }
        break;
      }

      case 'cert': {
        if (!argStr) {
          output.push('Usage: cert <domain>  (e.g., cert eastbrook.secure-login.example)');
          break;
        }
        const host = argStr.replace(/^https?:\/\//, '').split('/')[0].toLowerCase();
        const site = SITES[host];
        if (site && site.cert) {
          const c = site.cert;
          output.push(
            `Subject: CN=${c.subject}`,
            `Organization: ${c.org}`,
            `Issuer: ${c.issuer}`,
            `Valid From: ${c.from} To: ${c.to}`,
            `SANs: ${c.san.join(', ')}`,
            `Validation Status: ${c.valid && !c.mismatch ? 'Valid Trusted CA' : 'MISMATCH / UNTRUSTED CA [!] CAUTION'}`
          );
        } else {
          output.push(`No TLS certificate data available for ${host}.`);
        }
        break;
      }

      case 'ping': {
        const host = argStr || '127.0.0.1';
        output.push(
          `PING ${host} (simulated 32 bytes of data):`,
          `Reply from ${host}: bytes=32 time=4ms TTL=64`,
          `Reply from ${host}: bytes=32 time=3ms TTL=64`,
          `Reply from ${host}: bytes=32 time=4ms TTL=64`,
          `--- ${host} ping statistics: 3 packets transmitted, 3 received, 0% packet loss ---`
        );
        break;
      }

      case 'log': {
        output.push('Recent System Events:');
        s.log.slice(-8).forEach(l => {
          output.push(`[${l.t}] [${l.kind.toUpperCase()}] ${l.msg}`);
        });
        break;
      }

      default:
        output.push(`Unknown command: "${action}". Type "help" for a list of investigation commands.`);
    }

    setHistory(prev => [...prev, ...output]);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = cmdIndex === -1 ? cmdHistory.length - 1 : Math.max(0, cmdIndex - 1);
      setCmdIndex(nextIdx);
      setInput(cmdHistory[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cmdIndex === -1) return;
      const nextIdx = cmdIndex + 1;
      if (nextIdx >= cmdHistory.length) {
        setCmdIndex(-1);
        setInput('');
      } else {
        setCmdIndex(nextIdx);
        setInput(cmdHistory[nextIdx]);
      }
    }
  };

  return (
    <div className="terminal-app app-col" onClick={() => inputRef.current?.focus()}>
      <div className="term-screen">
        {history.map((line, i) => (
          <div key={i} className={`term-line ${line.startsWith('>') ? 'term-cmd' : line.includes('[!]') ? 'term-warn' : line.includes('[OK') ? 'term-ok' : ''}`}>
            {line}
          </div>
        ))}
        <div className="term-input-row">
          <span className="term-prompt">C:\CYBERDESK&gt;</span>
          <input
            ref={inputRef}
            type="text"
            className="term-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            spellCheck="false"
            autoComplete="off"
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
