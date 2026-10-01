// LLA Network Alarm Engine — shared helpers: formatting, tags, table utilities,
// CSV parsing/export and the simulated four-agent pipeline.
(function () {
  const p2 = x => String(x).padStart(2, '0');
  const L = {};

  // ---------- formatting ----------
  L.fmtTime = s => {
    if (!s) return '';
    const [d, t] = s.split(' ');
    if (!t) return d;
    let [h, m] = t.split(':').map(Number);
    const ap = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${d} ${p2(h)}:${p2(m)} ${ap}`;
  };
  L.now = () => { const d = new Date(); return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())} ${p2(d.getHours())}:${p2(d.getMinutes())}:${p2(d.getSeconds())}`; };
  L.fmtDuration = a => (a.recovery_time == null || a.duration_minutes == null) ? 'Still active' : Number(a.duration_minutes).toFixed(2);
  L.np = v => (v == null || v === '') ? 'Not provided' : String(v);
  L.yesNo = v => v == null ? 'Not provided' : (v ? 'Yes' : 'No');
  L.json = o => JSON.stringify(o, null, 2);

  // ---------- tags ----------
  const T = {
    red: { background: '#FBEBEA', color: '#9A1F17', borderColor: '#EDC6C2' },
    orange: { background: '#FCF0E6', color: '#8F4310', borderColor: '#F0D2B8' },
    amber: { background: '#FBF5DE', color: '#715400', borderColor: '#E7DBA6' },
    green: { background: '#E9F4EC', color: '#1D6436', borderColor: '#C2DDCB' },
    gray: { background: '#F0F1F4', color: '#4A5160', borderColor: '#D9DCE3' },
    blue: { background: '#ECEFF7', color: '#2E3A6B', borderColor: '#CDD3E6' },
    brand: { background: '#FCEDE6', color: '#93330F', borderColor: '#F0C9B7' }
  };
  const TONE = {
    High: 'red', S1: 'red', S2: 'red', Disaster: 'red', REJECTED: 'red', Rejected: 'red', FAILED: 'red', Failed: 'red', CLOSED: 'gray',
    Average: 'orange', S3: 'orange',
    Warning: 'amber', S4: 'amber', PENDING: 'amber', Pending: 'amber', NEW: 'amber', Running: 'amber',
    APPROVED: 'green', Approved: 'green', UPLOADED: 'green', PROCESSED: 'green', Done: 'green', LOADED: 'green', SURVIVED: 'green', OPEN: 'green', PROBLEM: 'red', RESOLVED: 'gray',
    SUPPRESSED_MAINTENANCE: 'gray', SUPPRESSED_DEDUP: 'gray', SUPPRESSED_DEBOUNCE: 'gray', SKIPPED_EXISTING: 'gray', Waiting: 'gray', MEMBER: 'gray', SYMPTOM: 'gray',
    CORRELATED: 'blue', GROUPED: 'blue', TICKET_CREATED: 'blue', UPDATED: 'blue', RULE: 'blue', LLM_REASONING: 'blue',
    LEAD: 'brand'
  };
  L.tag = v => Object.assign({ display: 'inline-block', padding: '0 6px', lineHeight: '18px', fontSize: 11, fontWeight: 600, borderRadius: 3, border: '1px solid', whiteSpace: 'nowrap', letterSpacing: 0.1 }, T[TONE[v] || 'gray']);

  // ---------- table helpers ----------
  L.sortBy = (rows, key, dir) => {
    if (!key) return rows;
    const m = dir === 'desc' ? -1 : 1;
    return rows.slice().sort((a, b) => {
      const x = a[key], y = b[key];
      if (x == null && y == null) return 0;
      if (x == null) return 1;
      if (y == null) return -1;
      if (typeof x === 'number' && typeof y === 'number') return (x - y) * m;
      return String(x).localeCompare(String(y), undefined, { numeric: true }) * m;
    });
  };
  L.uniq = arr => Array.from(new Set(arr.filter(v => v != null && v !== ''))).sort();
  L.opts = (arr, all) => [{ value: '', label: all || 'All' }].concat(arr.map(v => ({ value: String(v), label: String(v) })));
  L.inRange = (t, from, to) => (!from || (t && t.slice(0, 10) >= from)) && (!to || (t && t.slice(0, 10) <= to));

  L.downloadCSV = (filename, header, rows) => {
    const esc = v => { const s = v == null ? '' : String(v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
    const csv = [header.map(esc).join(',')].concat(rows.map(r => r.map(esc).join(','))).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  // ---------- CSV parsing ----------
  L.REQUIRED_HEADERS = ['Severity', 'Time', 'Recovery time', 'Status', 'Host', 'Problem', 'Duration', 'Ack', 'Actions', 'Tags'];
  L.parseCSV = text => {
    const rows = []; let row = [], cur = '', q = false;
    text = text.replace(/^\uFEFF/, '');
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; }
        else cur += c;
      } else if (c === '"') q = true;
      else if (c === ',') { row.push(cur); cur = ''; }
      else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cur); rows.push(row); row = []; cur = ''; }
      else cur += c;
    }
    if (cur !== '' || row.length) { row.push(cur); rows.push(row); }
    const clean = rows.filter(r => r.some(c => c.trim() !== ''));
    const headers = (clean[0] || []).map(h => h.trim());
    const data = clean.slice(1).map(r => Object.fromEntries(headers.map((h, i) => [h, (r[i] || '').trim()])));
    const missing = L.REQUIRED_HEADERS.filter(h => !headers.includes(h));
    return { headers, data, missing };
  };
  L.exampleCSV = () => {
    const H = L.REQUIRED_HEADERS;
    const R = [
      ['High', '2026-09-16 02:14:05 AM', '', 'PROBLEM', 'BRB-GARRI-MPLS01', 'Interface ge-1/0/1: Link down', '', 'No', '', 'alerttype: availability, class: network, component: interface, interface: ge-1/0/1, alias: Customer CIRCUIT BRB-ENT-1044, ip: 190.242.20.5, vendor: juniper'],
      ['High', '2026-09-16 02:14:40 AM', '', 'PROBLEM', 'BRB-GARRI-MPLS01', 'ICMP: host 190.242.20.9 unreachable', '', 'No', '', 'alerttype: availability, class: network, component: icmp, ip: 190.242.20.5, vendor: juniper'],
      ['Average', '2026-09-16 05:03:11 AM', '2026-09-16 05:09:11 AM', 'RESOLVED', 'BHS-EMR-MPLS01', 'Routing Engine 0: High CPU utilization (over 90% for 5m)', '6m', 'No', '', 'alerttype: performance, class: network, component: cpu, ip: 190.242.12.10, vendor: juniper'],
      ['Warning', '2026-09-16 07:40:00 AM', '2026-09-16 08:22:30 AM', 'RESOLVED', 'BHS-NAS-MPLS01', 'FPC 0 Temperature above 55 degrees', '42m 30s', 'Yes', '', 'alerttype: environment, class: network, component: temperature, ip: 190.242.12.18, vendor: juniper'],
      ['Warning', '2026-09-16 07:41:00 AM', '2026-09-16 08:22:30 AM', 'RESOLVED', 'BHS-NAS-MPLS01', 'FPC 0 Temperature above 55 degrees', '41m 30s', 'Yes', '', 'alerttype: environment, class: network, component: temperature, ip: 190.242.12.18, vendor: juniper'],
      ['Average', '2026-09-16 10:12:20 AM', '2026-09-16 10:47:02 AM', 'RESOLVED', 'ANU-APUA01-MPLS02', 'Interface et-0/0/1: Link down', '34m 42s', 'Yes', '', 'alerttype: availability, class: network, component: interface, interface: et-0/0/1, ip: 190.242.4.26, vendor: juniper'],
      ['Average', '2026-09-16 11:30:00 AM', '2026-09-16 11:36:00 AM', 'RESOLVED', '', 'Interface xe-0/0/2: Link down', '6m', 'No', '', 'alerttype: availability, class: network, component: interface, vendor: juniper'],
      ['Average', '2026-09-14 12:10:19 PM', '2026-09-14 12:16:19 PM', 'RESOLVED', 'BHS-EMR-MPLS01', 'Routing Engine 0: High CPU utilization (over 90% for 5m)', '6m', 'No', '', 'alerttype: performance, class: network, component: cpu, ip: 190.242.12.10, vendor: juniper']
    ];
    const esc = s => /[",]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    return [H.join(',')].concat(R.map(r => r.map(esc).join(','))).join('\n');
  };

  // ---------- normalization helpers ----------
  const parseTime = s => {
    if (!s) return null;
    const m = s.trim().match(/^(\d{4}-\d{2}-\d{2})[ T](\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i);
    if (!m) return undefined;
    let h = +m[2]; const ap = m[5] && m[5].toUpperCase();
    if (ap === 'PM' && h < 12) h += 12; if (ap === 'AM' && h === 12) h = 0;
    return `${m[1]} ${p2(h)}:${m[3]}:${m[4] || '00'}`;
  };
  const minutesBetween = (a, b) => Math.round(((new Date(b.replace(' ', 'T')) - new Date(a.replace(' ', 'T'))) / 60000) * 100) / 100;
  const parseTags = s => Object.fromEntries((s || '').split(',').map(x => x.split(':').map(y => y.trim())).filter(x => x[0] && x.length > 1).map(([k, ...v]) => [k.toLowerCase(), v.join(':')]));
  const parseDur = s => { if (!s) return null; let m = 0, ok = false; s.replace(/(\d+)\s*([hms])/g, (_, n, u) => { ok = true; m += u === 'h' ? n * 60 : u === 'm' ? +n : n / 60; }); return ok ? Math.round(m * 100) / 100 : null; };
  const sevMap = db => Object.fromEntries(db.severity.map(s => [s.severity_name, s]));
  const cfg = (db, k) => Number((db.config.find(c => c.config_key === k) || {}).config_value);

  // Each step returns { ok, counts, error } and mutates db. ctx = { addAudit }
  L.agents = {
    normalization(db, uploadId, ctx) {
      const up = db.uploads.find(u => u.upload_id === uploadId);
      const rows = db.raw.filter(r => r.upload_id === uploadId);
      if (!rows.length) return { ok: false, error: `Normalization failed: upload ${uploadId} has no data rows. No rows were loaded.` };
      const first = parseTime(rows[0].raw_data.Time);
      if (first === undefined) return { ok: false, error: `Normalization failed: column 'Time' value '${rows[0].raw_data.Time}' at row 1 does not match the expected format YYYY-MM-DD hh:mm:ss AM/PM. No rows were loaded.` };
      const sm = sevMap(db); const c = { total: rows.length, loaded: 0, updated: 0, skipped: 0, rejected: 0 };
      let nextId = Math.max(...db.alarms.map(a => a.alarm_id)) + 1;
      const now = L.now();
      rows.forEach(r => {
        const d = r.raw_data; let reject = null;
        const t = parseTime(d.Time), rec = parseTime(d['Recovery time']);
        if (!d.Host) reject = 'Rejected: required value Host is empty';
        else if (!d.Problem) reject = 'Rejected: required value Problem is empty';
        else if (!sm[d.Severity]) reject = `Rejected: severity '${d.Severity}' is not in the severity mapping`;
        else if (!t) reject = `Rejected: Time '${d.Time}' could not be read`;
        else if (rec === undefined) reject = `Rejected: Recovery time '${d['Recovery time']}' could not be read`;
        r.load_outcome = 'PROCESSED';
        if (reject) { r.outcome_reason = reject; c.rejected++; ctx.addAudit('NORMALIZATION', 'REJECTED', reject, 'agent:normalization', { upload: uploadId }, { raw_id: r.raw_id, row_number: r.row_number }); return; }
        const tags = parseTags(d.Tags);
        const ack = /^y/i.test(d.Ack);
        const dur = rec ? (parseDur(d.Duration) != null ? parseDur(d.Duration) : minutesBetween(t, rec)) : null;
        const ex = db.alarms.find(a => a.host === d.Host && a.problem === d.Problem && a.alarm_time === t);
        if (ex) {
          const changes = [];
          if ((ex.recovery_time || null) !== (rec || null)) changes.push('Recovery time');
          if (ex.ack !== ack) changes.push('Ack');
          r.alarm_id = ex.alarm_id;
          if (changes.length) {
            ex.recovery_time = rec || null; ex.status = rec ? 'RESOLVED' : 'PROBLEM'; ex.duration_minutes = dur; ex.ack = ack; ex.updated_at = now;
            r.outcome_reason = `Updated existing alarm ${ex.alarm_id}: ${changes.join(', ')} changed`; c.updated++;
            ctx.addAudit('NORMALIZATION', 'UPDATED', r.outcome_reason, 'agent:normalization', { upload: uploadId, alarm: ex.alarm_id }, { raw_id: r.raw_id, row_number: r.row_number, changed: changes });
          } else {
            r.outcome_reason = `Skipped: identical to existing alarm ${ex.alarm_id}`; c.skipped++;
            ctx.addAudit('NORMALIZATION', 'SKIPPED_EXISTING', r.outcome_reason, 'agent:normalization', { upload: uploadId, alarm: ex.alarm_id }, { raw_id: r.raw_id, row_number: r.row_number });
          }
          return;
        }
        const a = {
          alarm_id: nextId++, source_upload_id: uploadId, host: d.Host, severity: d.Severity, problem: d.Problem,
          alarm_time: t, recovery_time: rec || null, status: rec ? 'RESOLVED' : 'PROBLEM', duration_minutes: dur, ack,
          alarm_class: tags.class || null, alert_type: tags.alerttype || null, component: tags.component || null,
          ip_address: tags.ip || null, interface: tags.interface || null, alias: tags.alias || null, vendor: tags.vendor || null,
          pipeline_status: 'NEW', suppression_reason: null, survivor_alarm_id: null, created_at: now, updated_at: now
        };
        db.alarms.push(a); r.alarm_id = a.alarm_id; r.outcome_reason = 'Loaded as new alarm'; c.loaded++;
        ctx.addAudit('NORMALIZATION', 'LOADED', r.outcome_reason, 'agent:normalization', { upload: uploadId, alarm: a.alarm_id }, { raw_id: r.raw_id, row_number: r.row_number });
      });
      Object.assign(up, { rows_total: c.total, rows_loaded: c.loaded, rows_updated: c.updated, rows_skipped: c.skipped, rows_rejected: c.rejected });
      return { ok: true, counts: c };
    },
    dedup(db, uploadId, ctx) {
      const deb = cfg(db, 'debounce_window_minutes');
      const list = db.alarms.filter(a => a.source_upload_id === uploadId && a.pipeline_status === 'NEW').sort((a, b) => a.alarm_time < b.alarm_time ? -1 : 1);
      const c = { processed: list.length, suppressed_maintenance: 0, suppressed_dedup: 0, suppressed_debounce: 0, survived: 0 };
      list.forEach(a => {
        const mw = db.maintenance.find(w => w.host === a.host && a.alarm_time >= w.start_time && a.alarm_time <= w.end_time);
        if (mw) { a.pipeline_status = 'SUPPRESSED_MAINTENANCE'; a.suppression_reason = `Inside maintenance window ${mw.window_id}: ${mw.description || 'no description'}`; c.suppressed_maintenance++; ctx.addAudit('MAINTENANCE', 'SUPPRESSED_MAINTENANCE', a.suppression_reason, 'agent:dedup', { upload: uploadId, alarm: a.alarm_id }, { window_id: mw.window_id }); return; }
        const surv = db.alarms.find(b => b !== a && b.host === a.host && b.problem === a.problem && b.pipeline_status !== 'SUPPRESSED_DEDUP' && b.pipeline_status !== 'NEW' && Math.abs(minutesBetween(b.alarm_time, a.alarm_time)) <= 5);
        if (surv) { a.pipeline_status = 'SUPPRESSED_DEDUP'; a.survivor_alarm_id = surv.alarm_id; a.suppression_reason = `Same host and problem as alarm ${surv.alarm_id} within 5 min`; c.suppressed_dedup++; ctx.addAudit('DEDUP', 'SUPPRESSED_DEDUP', a.suppression_reason, 'agent:dedup', { upload: uploadId, alarm: a.alarm_id }, { survivor_alarm_id: surv.alarm_id }); return; }
        if (a.recovery_time && a.duration_minutes != null && a.duration_minutes < deb) { a.pipeline_status = 'SUPPRESSED_DEBOUNCE'; a.suppression_reason = `Resolved after ${a.duration_minutes.toFixed(2)} min, under the debounce window of ${deb} min`; c.suppressed_debounce++; ctx.addAudit('DEBOUNCE', 'SUPPRESSED_DEBOUNCE', a.suppression_reason, 'agent:dedup', { upload: uploadId, alarm: a.alarm_id }, { duration_minutes: a.duration_minutes, debounce_window_minutes: deb }); return; }
        a.pipeline_status = 'SURVIVED'; c.survived++;
        ctx.addAudit('DEBOUNCE', 'SURVIVED', 'Passed maintenance, duplicate and debounce checks', 'agent:dedup', { upload: uploadId, alarm: a.alarm_id }, { duration_minutes: a.duration_minutes, debounce_window_minutes: deb });
      });
      return { ok: true, counts: c };
    },
    correlation(db, uploadId, ctx) {
      const win = cfg(db, 'correlation_window_minutes');
      const sm = sevMap(db);
      const surv = db.alarms.filter(a => a.source_upload_id === uploadId && a.pipeline_status === 'SURVIVED').sort((a, b) => a.alarm_time < b.alarm_time ? -1 : 1);
      const groups = [];
      surv.forEach(a => {
        const g = groups.find(g => g.host === a.host && minutesBetween(g.start, a.alarm_time) <= win);
        if (g) g.alarms.push(a); else groups.push({ host: a.host, start: a.alarm_time, alarms: [a] });
      });
      let nextId = Math.max(0, ...db.incidents.map(i => i.incident_id)) + 1; let linked = 0, byRule = 0;
      const now = L.now();
      groups.forEach(g => {
        const temp = g.alarms.filter(a => /temperature/i.test(a.problem));
        const iface = g.alarms.filter(a => /interface|link down/i.test(a.problem));
        const icmp = g.alarms.filter(a => /icmp|unreachable/i.test(a.problem));
        let rule = null;
        if (temp.length >= 3) rule = 'TEMP_STORM';
        else if (iface.length >= 1 && icmp.length >= 1) rule = 'INTERFACE_ICMP';
        else if (iface.length >= 2) rule = 'INTERFACE_STORM';
        const r = rule && db.rules.find(x => x.rule_code === rule && x.is_active);
        const sorted = g.alarms.slice().sort((a, b) => (sm[a.severity].severity_rank - sm[b.severity].severity_rank) || (a.alarm_time < b.alarm_time ? -1 : 1));
        const lead = sorted[0];
        const hi = lead.severity;
        const code = 'INC-' + String(nextId).padStart(4, '0');
        const roleOf = a => a === lead ? 'LEAD' : (/icmp|unreachable|ae\d/i.test(a.problem) ? 'SYMPTOM' : 'MEMBER');
        const reasoning = r
          ? `Rule ${r.rule_code} matched: ${g.alarms.length} alarms on ${g.host} within the ${win} minute window. ${lead.problem} is the lead (highest severity, earliest). ` + g.alarms.filter(a => a !== lead).map(a => `${a.problem} is a ${roleOf(a).toLowerCase()}.`).join(' ')
          : (g.alarms.length === 1
            ? `One surviving alarm on ${g.host} in the ${win} minute window: ${lead.problem}` + (lead.recovery_time ? ` for ${lead.duration_minutes.toFixed(2)} min.` : '. The alarm is still active, so its duration is unknown.') + ' No rule matched; opened as a single-alarm incident.'
            : `${g.alarms.length} surviving alarms on ${g.host} within the ${win} minute window. No rule matched, but the alarms share a host and time window, so they were grouped. ${lead.problem} is the lead.`);
        const inc = { incident_id: nextId, incident_code: code, host: g.host, grouping_basis: r ? 'RULE' : 'LLM_REASONING', rule_id: r ? r.rule_id : null, time_window_minutes: win, llm_reasoning: reasoning, highest_severity: hi, ticket_severity: sm[hi].ticket_severity, created_at: now, updated_at: now };
        db.incidents.push(inc); if (r) byRule++;
        g.alarms.forEach(a => {
          const role = roleOf(a);
          db.incidentAlarms.push({ incident_id: inc.incident_id, alarm_id: a.alarm_id, alarm_role: role });
          a.pipeline_status = 'CORRELATED'; a.updated_at = now; linked++;
          ctx.addAudit('CORRELATION', 'GROUPED', `Linked to ${code} as ${role}` + (r ? ` by rule ${r.rule_code}` : ' by agent reasoning'), 'agent:correlation', { upload: uploadId, alarm: a.alarm_id, incident: inc.incident_id }, { grouping_basis: inc.grouping_basis, rule_code: r ? r.rule_code : null, alarm_role: role, time_window_minutes: win });
        });
        nextId++;
      });
      return { ok: true, counts: { incidents_created: groups.length, alarms_linked: linked, by_rule: byRule, by_reasoning: groups.length - byRule }, created: groups.length };
    },
    ticketing(db, uploadId, ctx, newIncidentIds) {
      const sm = sevMap(db);
      let nextId = Math.max(...db.tickets.map(t => t.ticket_id)) + 1;
      let nextNum = Math.max(...db.tickets.map(t => +t.ticket_number.replace(/\D/g, ''))) + 1;
      const c = { tickets_created: 0, auto_approved: 0, waiting_for_analyst: 0 };
      const now = L.now();
      db.incidents.filter(i => newIncidentIds.includes(i.incident_id)).forEach(inc => {
        const links = db.incidentAlarms.filter(x => x.incident_id === inc.incident_id);
        const lead = db.alarms.find(a => a.alarm_id === links.find(x => x.alarm_role === 'LEAD').alarm_id);
        const map = sm[inc.highest_severity];
        const need = map.approval_required;
        const t = { ticket_id: nextId++, ticket_number: 'TCK-' + String(nextNum++).padStart(6, '0'), external_ticket_ref: null, incident_id: inc.incident_id, host: inc.host, severity: map.ticket_severity,
          summary: links.length > 1 ? `${inc.host}: ${links.length} correlated alarms, lead ${lead.problem}` : `${inc.host}: ${lead.problem}` + (lead.recovery_time ? '' : ', still active'),
          component: lead.component, alert_type: lead.alert_type, alarm_count: links.length, start_time: lead.alarm_time, ticket_status: need ? 'NEW' : 'OPEN', approval_required: need, approval_status: need ? 'PENDING' : 'APPROVED', decided_by: need ? null : 'auto:severity_mapping', decided_at: need ? null : now, created_at: now };
        db.tickets.push(t); c.tickets_created++;
        ctx.addAudit('TICKETING', 'TICKET_CREATED', `Ticket ${t.ticket_number} created with severity ${t.severity} from severity mapping (${inc.highest_severity} → ${t.severity})`, 'agent:ticketing', { upload: uploadId, incident: inc.incident_id, ticket: t.ticket_id }, { severity: t.severity, approval_required: need, alarm_count: t.alarm_count });
        if (need) c.waiting_for_analyst++;
        else { c.auto_approved++; ctx.addAudit('TICKETING', 'APPROVED', `Approved automatically: severity mapping says ${t.severity} does not need analyst approval`, 'agent:ticketing', { upload: uploadId, incident: inc.incident_id, ticket: t.ticket_id }, { decided_by: 'auto:severity_mapping', approval_status: 'APPROVED' }); }
      });
      return { ok: true, counts: c };
    }
  };
  L.STEP_LABELS = ['Normalization', 'Deduplication and suppression', 'Correlation', 'Ticketing'];
  L.COUNT_LABELS = {
    total: 'Total', loaded: 'Loaded', updated: 'Updated', skipped: 'Skipped', rejected: 'Rejected',
    processed: 'Processed', suppressed_maintenance: 'Suppressed for maintenance', suppressed_dedup: 'Suppressed as duplicates', suppressed_debounce: 'Suppressed by debounce', survived: 'Survived',
    incidents_created: 'Incidents created', alarms_linked: 'Alarms linked', by_rule: 'By rule', by_reasoning: 'By agent reasoning',
    tickets_created: 'Tickets created', auto_approved: 'Approved automatically', waiting_for_analyst: 'Waiting for an analyst'
  };
  L.durationText = s => { if (!s || !s.started_at) return null; if (!s.finished_at) return 'Running'; const sec = Math.round((new Date(s.finished_at.replace(' ', 'T')) - new Date(s.started_at.replace(' ', 'T'))) / 1000); return sec < 60 ? sec + 's' : Math.floor(sec / 60) + 'm ' + (sec % 60) + 's'; };
  L.decidedBy = v => v === 'auto:severity_mapping' ? 'Auto (severity mapping)' : (v || '');

  window.LLA = L;
})();
