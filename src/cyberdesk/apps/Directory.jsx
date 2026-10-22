import React, { useState } from 'react';
import { useStore } from '../engine/store.jsx';
import { A } from '../engine/assets.js';
import { Px, Button, Input } from '../os/ui.jsx';

const CAMPUS_DIRECTORY = [
  { id: '1', name: 'Dr. Maya Okafor', title: 'Associate Professor', dept: 'Computer Science', email: 'maya.okafor@eastbrook.example', phone: 'ext. 4481', office: 'Turing Hall 304', verified: true, notes: 'Office hours: Thu 2-4pm' },
  { id: '2', name: 'Registrar Enrolment Services', title: 'Department Office', dept: 'Student Records', email: 'registrar@eastbrook.example', phone: 'ext. 2100', office: 'Founders Hall 101', verified: true, notes: 'Official notice: Never demands passwords via email' },
  { id: '3', name: 'Alex Kim', title: 'Senior Systems Analyst', dept: 'Information Technology', email: 'helpdesk@eastbrook.example', phone: 'ext. 1100', office: 'Computing Center 12', verified: true, notes: 'IT Help Desk - verified contact' },
  { id: '4', name: 'Dean Marcus Vance', title: 'Dean of Engineering', dept: 'Executive Administration', email: 'm.vance@eastbrook.example', phone: 'ext. 1002', office: 'Main Building 400', verified: true, notes: 'Executive disbursements require 2-tier approval' },
  { id: '5', name: 'Priya Nair', title: 'Undergraduate Student', dept: 'CS Senior', email: 'priya.nair@eastbrook.example', phone: 'n/a', office: 'Student Lab 4', verified: true, notes: 'Lab 3 group partner' },
  { id: '6', name: 'Sam Rivera', title: 'Undergraduate Student', dept: 'CS Sophomore', email: 'sam.rivera@eastbrook.example', phone: 'n/a', office: 'Dorm C', verified: true, notes: 'ALERT: Account compromised reports pending review' },
  { id: '7', name: 'Rosa Martinez', title: 'Director of Career Placement', dept: 'Career Services', email: 'rosa.martinez@eastbrook.example', phone: 'ext. 5120', office: 'Student Union 204', verified: true, notes: 'Official internships posted on verified portal only' },
  { id: '8', name: 'Northvale Bank Operations', title: 'Corporate Banking Partner', dept: 'External Financial', email: 'statements@northvale.example', phone: '0800-555-0199', office: 'Northvale Plaza', verified: true, notes: 'Official banking notification partner' },
];

export default function Directory({ win }) {
  const { act } = useStore();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(CAMPUS_DIRECTORY[0]);

  const filtered = CAMPUS_DIRECTORY.filter(item => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return item.name.toLowerCase().includes(q) ||
           item.dept.toLowerCase().includes(q) ||
           item.email.toLowerCase().includes(q) ||
           item.title.toLowerCase().includes(q);
  });

  const handleVerify = (person) => {
    act.log(`Verified personnel directory: ${person.name} (${person.email})`, 'ok');
    act.notify({
      kind: 'task',
      title: 'Directory Verified',
      text: `${person.name} is an authentic contact (${person.email}).`,
      ms: 4000,
    });
  };

  return (
    <div className="directory-app app-col">
      <div className="dir-search-bar">
        <label htmlFor="dir-q">Search Directory:</label>
        <Input
          id="dir-q"
          className="grow"
          placeholder="Type name, department, or email address..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={() => setQuery('')} disabled={!query}>Clear</Button>
      </div>

      <div className="dir-main">
        <div className="dir-list" role="listbox">
          <div className="dir-header"><span>Name / Office</span><span>Department</span><span>Email</span></div>
          {filtered.length === 0 ? (
            <div className="empty">No verified directory entries match "{query}".<br />Beware: Attackers often use names not present in official registries.</div>
          ) : (
            filtered.map(person => (
              <div
                key={person.id}
                role="option"
                aria-selected={selected?.id === person.id}
                className={`dir-row ${selected?.id === person.id ? 'sel' : ''}`}
                onClick={() => setSelected(person)}
              >
                <span className="bold">{person.name}</span>
                <span>{person.dept}</span>
                <span className="mono">{person.email}</span>
              </div>
            ))
          )}
        </div>

        {selected && (
          <div className="dir-details">
            <div className="dir-dhead">
              <Px src={A.sys('user')} size={32} />
              <div>
                <h4>{selected.name}</h4>
                <p className="sub">{selected.title} &middot; {selected.dept}</p>
              </div>
            </div>

            <table className="props">
              <tbody>
                <tr><th>Official Email</th><td className="mono bold">{selected.email}</td></tr>
                <tr><th>Phone Contact</th><td>{selected.phone}</td></tr>
                <tr><th>Office Location</th><td>{selected.office}</td></tr>
                <tr><th>Security Status</th><td><span className="good">&#10003; Verified Institutional Record</span></td></tr>
                <tr><th>Institutional Note</th><td>{selected.notes}</td></tr>
              </tbody>
            </table>

            <div className="dir-actions">
              <Button def onClick={() => handleVerify(selected)}>Record as Verified Contact</Button>
              <Button onClick={() => {
                navigator.clipboard?.writeText(selected.email);
                act.notify({ kind: 'task', title: 'Address Copied', text: selected.email });
              }}>Copy Official Address</Button>
            </div>
          </div>
        )}
      </div>

      <div className="statusbar">
        <span className="sb-main">Campus Intranet Directory &bull; Out-of-Band Verification Desk</span>
        <span className="sb-cell">{CAMPUS_DIRECTORY.length} Verified Entries</span>
      </div>
    </div>
  );
}
