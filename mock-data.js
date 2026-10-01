// LLA Network Alarm Engine — all mock data in one place.
// Shapes follow the pilot database ERD (upload_file, alarm_raw, alarm, incident,
// incident_alarm, ticket, audit_event, maintenance_window, alarm_severity,
// correlation_rule, pipeline_config). Replace with API calls later.
(function () {
  const HOSTS = {
    'ANU-APUA-MPLS01': '190.242.4.24',
    'BHS-EMR-MPLS01': '190.242.12.10',
    'BHS-NAS-MPLS01': '190.242.12.18',
    'ANU-APUA01-MPLS02': '190.242.4.26',
    'BRB-GARRI-MPLS01': '190.242.20.5'
  };
  const CPU = 'Routing Engine 0: High CPU utilization (over 90% for 5m)';

  // [id, upload, host, severity, problem, time, recovery, ack, alertType, component, interface, alias, pipeline_status, reason, survivor]
  const A = [
    [100201, 12, 'BRB-GARRI-MPLS01', 'Average', CPU, '2026-09-03 07:12:04', '2026-09-03 07:18:04', false, 'performance', 'cpu', null, null, 'SUPPRESSED_DEBOUNCE', 'Resolved after 6.00 min, under the debounce window of 10 min', null],
    [100202, 12, 'BHS-EMR-MPLS01', 'Average', CPU, '2026-09-04 13:40:51', '2026-09-04 13:46:51', false, 'performance', 'cpu', null, null, 'SUPPRESSED_DEBOUNCE', 'Resolved after 6.00 min, under the debounce window of 10 min', null],
    [100203, 12, 'ANU-APUA-MPLS01', 'Average', CPU, '2026-09-05 22:05:17', '2026-09-05 22:11:17', false, 'performance', 'cpu', null, null, 'SUPPRESSED_DEBOUNCE', 'Resolved after 6.00 min, under the debounce window of 10 min', null],
    [100204, 12, 'BHS-EMR-MPLS01', 'Average', 'Interface ge-1/0/0: Link down', '2026-09-06 10:14:00', '2026-09-06 10:24:25', true, 'availability', 'interface', 'ge-1/0/0', 'To BHS-EMR-ACC03 port 24', 'CORRELATED', null, null],
    [100205, 12, 'BRB-GARRI-MPLS01', 'Average', 'Interface ge-1/0/3: Link down', '2026-09-09 02:10:12', '2026-09-09 02:30:21', true, 'availability', 'interface', 'ge-1/0/3', 'Customer CIRCUIT BRB-ENT-0912', 'CORRELATED', null, null],
    [100206, 12, 'BRB-GARRI-MPLS01', 'Average', 'Interface ge-1/0/3: Link down', '2026-09-09 02:11:02', '2026-09-09 02:30:21', true, 'availability', 'interface', 'ge-1/0/3', 'Customer CIRCUIT BRB-ENT-0912', 'SUPPRESSED_DEDUP', 'Same host and problem as alarm 100205 within 5 min', 100205],
    [100207, 12, 'BRB-GARRI-MPLS01', 'Average', CPU, '2026-09-10 05:31:40', '2026-09-10 05:37:40', false, 'performance', 'cpu', null, null, 'SUPPRESSED_DEBOUNCE', 'Resolved after 6.00 min, under the debounce window of 10 min', null],
    [100208, 12, 'BHS-NAS-MPLS01', 'Average', CPU, '2026-09-10 18:02:09', '2026-09-10 18:08:09', false, 'performance', 'cpu', null, null, 'SUPPRESSED_DEBOUNCE', 'Resolved after 6.00 min, under the debounce window of 10 min', null],
    [100209, 12, 'ANU-APUA01-MPLS02', 'Average', CPU, '2026-09-11 03:44:55', '2026-09-11 03:50:55', false, 'performance', 'cpu', null, null, 'SUPPRESSED_DEBOUNCE', 'Resolved after 6.00 min, under the debounce window of 10 min', null],
    [100210, 12, 'BHS-EMR-MPLS01', 'Average', 'Interface ge-1/0/0: Link down', '2026-09-11 08:02:14', '2026-09-11 08:12:13', false, 'availability', 'interface', 'ge-1/0/0', 'To BHS-EMR-ACC03 port 24', 'SUPPRESSED_DEBOUNCE', 'Resolved after 9.98 min, under the debounce window of 10 min', null],
    [100211, 12, 'BRB-GARRI-MPLS01', 'Average', 'Interface ge-1/0/3: Link down', '2026-09-11 16:40:03', '2026-09-11 17:00:23', true, 'availability', 'interface', 'ge-1/0/3', 'Customer CIRCUIT BRB-ENT-0912', 'CORRELATED', null, null],
    [100212, 12, 'BRB-GARRI-MPLS01', 'Average', 'Interface ge-1/0/3: Link down', '2026-09-11 16:41:10', '2026-09-11 17:00:23', true, 'availability', 'interface', 'ge-1/0/3', 'Customer CIRCUIT BRB-ENT-0912', 'SUPPRESSED_DEDUP', 'Same host and problem as alarm 100211 within 5 min', 100211],
    [100213, 12, 'BHS-NAS-MPLS01', 'Average', CPU, '2026-09-12 06:20:30', '2026-09-12 06:26:30', false, 'performance', 'cpu', null, null, 'SUPPRESSED_DEBOUNCE', 'Resolved after 6.00 min, under the debounce window of 10 min', null],
    [100214, 12, 'BHS-NAS-MPLS01', 'Average', 'Interface xe-0/1/0: Link down', '2026-09-12 01:35:00', '2026-09-12 01:58:24', false, 'availability', 'interface', 'xe-0/1/0', 'Core uplink to BHS-NAS-CORE01', 'SUPPRESSED_MAINTENANCE', 'Inside maintenance window 2: Core uplink fibre splice (CHG-48812)', null],
    [100215, 12, 'BHS-NAS-MPLS01', 'Average', 'BGP peer 190.242.12.1 state changed to Idle', '2026-09-12 01:36:12', '2026-09-12 02:05:12', false, 'availability', 'bgp', null, null, 'SUPPRESSED_MAINTENANCE', 'Inside maintenance window 2: Core uplink fibre splice (CHG-48812)', null],
    [100216, 12, 'BHS-NAS-MPLS01', 'Warning', 'AFEB Exhaust A Temperature above 55 degrees', '2026-09-12 11:05:41', '2026-09-12 11:48:11', true, 'environment', 'temperature', null, null, 'CORRELATED', null, null],
    [100217, 12, 'BHS-NAS-MPLS01', 'Warning', 'AFEB Exhaust A Temperature above 55 degrees', '2026-09-12 11:06:41', '2026-09-12 11:48:11', true, 'environment', 'temperature', null, null, 'SUPPRESSED_DEDUP', 'Same host and problem as alarm 100216 within 5 min', 100216],
    [100218, 12, 'ANU-APUA-MPLS01', 'Average', CPU, '2026-09-12 19:15:22', '2026-09-12 19:21:22', false, 'performance', 'cpu', null, null, 'SUPPRESSED_DEBOUNCE', 'Resolved after 6.00 min, under the debounce window of 10 min', null],
    [100219, 12, 'ANU-APUA01-MPLS02', 'Average', 'Interface et-0/0/0: Link down', '2026-09-13 15:22:08', '2026-09-13 15:51:26', true, 'availability', 'interface', 'et-0/0/0', 'Uplink to ANU-APUA-CORE01 100G', 'CORRELATED', null, null],
    [100220, 12, 'ANU-APUA01-MPLS02', 'Average', 'Interface ae0: Link down', '2026-09-13 15:22:31', '2026-09-13 15:52:37', true, 'availability', 'interface', 'ae0', 'LAG to ANU-APUA-CORE01', 'CORRELATED', null, null],
    [100221, 12, 'BRB-GARRI-MPLS01', 'Average', CPU, '2026-09-13 21:48:00', '2026-09-13 21:54:00', false, 'performance', 'cpu', null, null, 'SUPPRESSED_DEBOUNCE', 'Resolved after 6.00 min, under the debounce window of 10 min', null],
    [100222, 12, 'BHS-EMR-MPLS01', 'Average', CPU, '2026-09-13 23:30:45', '2026-09-13 23:36:45', false, 'performance', 'cpu', null, null, 'SUPPRESSED_DEBOUNCE', 'Resolved after 6.00 min, under the debounce window of 10 min', null],
    [100223, 12, 'BHS-EMR-MPLS01', 'Warning', 'FPC 0 Temperature above 55 degrees', '2026-09-14 09:02:10', '2026-09-14 09:41:55', false, 'environment', 'temperature', null, null, 'CORRELATED', null, null],
    [100224, 12, 'BHS-EMR-MPLS01', 'Warning', 'FPC 1 Temperature above 55 degrees', '2026-09-14 09:03:02', '2026-09-14 09:40:14', false, 'environment', 'temperature', null, null, 'CORRELATED', null, null],
    [100225, 12, 'BHS-EMR-MPLS01', 'Warning', 'PEM 0 Temperature above 55 degrees', '2026-09-14 09:04:40', '2026-09-14 09:38:02', false, 'environment', 'temperature', null, null, 'CORRELATED', null, null],
    [100226, 12, 'BHS-EMR-MPLS01', 'Warning', 'PEM 1 Temperature above 55 degrees', '2026-09-14 09:05:12', '2026-09-14 09:37:40', false, 'environment', 'temperature', null, null, 'CORRELATED', null, null],
    [100227, 12, 'BHS-EMR-MPLS01', 'Warning', 'Routing Engine 0: Temperature above 55 degrees', '2026-09-14 09:07:31', '2026-09-14 09:39:16', false, 'environment', 'temperature', null, null, 'CORRELATED', null, null],
    [100228, 12, 'BHS-EMR-MPLS01', 'Warning', 'AFEB Exhaust A Temperature above 55 degrees', '2026-09-14 09:09:03', '2026-09-14 09:42:48', false, 'environment', 'temperature', null, null, 'CORRELATED', null, null],
    [100229, 12, 'BHS-EMR-MPLS01', 'Warning', 'Chassis fan tray 0 inlet temperature above 45 degrees', '2026-09-14 09:11:47', '2026-09-14 09:44:20', false, 'environment', 'temperature', null, null, 'CORRELATED', null, null],
    [100230, 12, 'BHS-EMR-MPLS01', 'Average', CPU, '2026-09-14 12:10:19', '2026-09-14 12:16:19', false, 'performance', 'cpu', null, null, 'SUPPRESSED_DEBOUNCE', 'Resolved after 6.00 min, under the debounce window of 10 min', null],
    [100231, 12, 'ANU-APUA01-MPLS02', 'Average', CPU, '2026-09-14 13:27:33', '2026-09-14 13:33:33', false, 'performance', 'cpu', null, null, 'SUPPRESSED_DEBOUNCE', 'Resolved after 6.00 min, under the debounce window of 10 min', null],
    [100232, 12, 'BRB-GARRI-MPLS01', 'Average', CPU, '2026-09-14 14:02:51', '2026-09-14 14:08:51', false, 'performance', 'cpu', null, null, 'SUPPRESSED_DEBOUNCE', 'Resolved after 6.00 min, under the debounce window of 10 min', null],
    [100233, 12, 'ANU-APUA-MPLS01', 'High', 'Routing Engine 0: Temperature above 60 degrees (critical)', '2026-09-14 15:36:12', null, false, 'environment', 'temperature', null, null, 'CORRELATED', null, null],
    [100234, 12, 'ANU-APUA-MPLS01', 'High', 'Routing Engine 0: Temperature above 60 degrees (critical)', '2026-09-14 15:37:12', null, false, 'environment', 'temperature', null, null, 'SUPPRESSED_DEDUP', 'Same host and problem as alarm 100233 within 5 min', 100233]
  ];

  const minutesBetween = (a, b) => Math.round(((new Date(b.replace(' ', 'T')) - new Date(a.replace(' ', 'T'))) / 60000) * 100) / 100;
  const UPLOAD_AT = { 10: '2026-09-25 16:05:44', 11: '2026-09-26 10:12:30', 12: '2026-09-29 08:40:05' };

  const alarms = A.map(r => {
    const [id, up, host, sev, problem, t, rec, ack, at, comp, iface, alias, ps, reason, surv] = r;
    return {
      alarm_id: id, source_upload_id: up, host, severity: sev, problem,
      alarm_time: t, recovery_time: rec, status: rec ? 'RESOLVED' : 'PROBLEM',
      duration_minutes: rec ? minutesBetween(t, rec) : null,
      ack, alarm_class: 'network', alert_type: at, component: comp,
      ip_address: HOSTS[host], interface: iface, alias, vendor: 'juniper',
      pipeline_status: ps, suppression_reason: reason, survivor_alarm_id: surv,
      created_at: UPLOAD_AT[up], updated_at: UPLOAD_AT[up]
    };
  });

  const fmtDur = m => { if (m == null) return ''; const tot = Math.round(m * 60); const h = Math.floor(tot / 3600), mi = Math.floor((tot % 3600) / 60), s = tot % 60; return (h ? h + 'h ' : '') + mi + 'm' + (s ? ' ' + s + 's' : ''); };
  const to12 = s => { if (!s) return ''; const [d, t] = s.split(' '); let [h, m, sec] = t.split(':').map(Number); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return `${d} ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')} ${ap}`; };
  const tagsOf = a => [`alerttype: ${a.alert_type}`, `class: ${a.alarm_class}`, `component: ${a.component}`, a.interface ? `interface: ${a.interface}` : null, a.alias ? `alias: ${a.alias}` : null, `ip: ${a.ip_address}`, `vendor: ${a.vendor}`].filter(Boolean).join(', ');
  const rawOf = (a, ackOverride) => ({
    Severity: a.severity, Time: to12(a.alarm_time), 'Recovery time': to12(a.recovery_time),
    Status: a.status, Host: a.host, Problem: a.problem, Duration: fmtDur(a.duration_minutes),
    Ack: (ackOverride != null ? ackOverride : a.ack) ? 'Yes' : 'No', Actions: '', Tags: tagsOf(a)
  });
  const addSec = (s, n) => { const d = new Date(s.replace(' ', 'T')); d.setSeconds(d.getSeconds() + n); const p = x => String(x).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`; };
  const byId = Object.fromEntries(alarms.map(a => [a.alarm_id, a]));

  // ---- upload_file ----
  // run.steps: one entry per agent with the run message, timing and the counts it reported back
  const step = (message, state, started, secs, counts, error) => ({ message, state, started_at: started, finished_at: started && state !== 'Running' && state !== 'Waiting' ? addSec(started, secs) : null, counts: counts || null, error: error || undefined });
  const ERR10 = "Normalization failed: column 'Time' value '31/08/2026 23:14' at row 1 does not match the expected format YYYY-MM-DD hh:mm:ss AM/PM. No rows were loaded.";
  const uploads = [
    { upload_id: 10, file_name: 'lla_b2b_alarms_2026-08_export.csv', file_hash: '9f1c2e7a4b0d63e8c1f5a2b9d7e40c6f18a3b5d2e9c7f01a4b6d8e2c3f5a7b9d', uploaded_by: 'Analyst Name', uploaded_at: UPLOAD_AT[10], status: 'FAILED', rows_total: 5, rows_loaded: 0, rows_updated: 0, rows_skipped: 0, rows_rejected: 0, completed_at: null,
      run: { steps: [
        step('Normalize upload 10', 'Failed', '2026-09-25 16:05:47', 11, null, ERR10),
        step('Run deduplication and suppression', 'Waiting'),
        step('Run correlation', 'Waiting'),
        step('Run ticketing', 'Waiting')] } },
    { upload_id: 11, file_name: 'lla_b2b_alarms_2026-09-08_manual.csv', file_hash: '3a7d9b1e5c2f8a40d6b3e1c9f7a25d8b0e4c6a1f3d9b7e2c5a8f0d4b6e1c3a9f', uploaded_by: 'Analyst Name', uploaded_at: UPLOAD_AT[11], status: 'UPLOADED', rows_total: 2, rows_loaded: 0, rows_updated: 0, rows_skipped: 0, rows_rejected: 2, completed_at: '2026-09-26 10:12:58',
      run: { steps: [
        step('Normalize upload 11', 'Done', '2026-09-26 10:12:33', 6, { total: 2, loaded: 0, updated: 0, skipped: 0, rejected: 2 }),
        step('Run deduplication and suppression', 'Done', '2026-09-26 10:12:40', 4, { processed: 0, suppressed_maintenance: 0, suppressed_dedup: 0, suppressed_debounce: 0, survived: 0 }),
        step('Run correlation', 'Done', '2026-09-26 10:12:45', 5, { incidents_created: 0, alarms_linked: 0, by_rule: 0, by_reasoning: 0 }),
        step('Run ticketing', 'Done', '2026-09-26 10:12:51', 7, { tickets_created: 0, auto_approved: 0, waiting_for_analyst: 0 })] } },
    { upload_id: 12, file_name: 'lla_b2b_alarms_2026-09_sample.csv', file_hash: 'c5e8a1d3f7b9024e6a8c1d5f3b7e9a20c4d6f8b1e3a5c7d9f0b2e4a6c8d1f3b5', uploaded_by: 'Analyst Name', uploaded_at: UPLOAD_AT[12], status: 'UPLOADED', rows_total: 34, rows_loaded: 34, rows_updated: 0, rows_skipped: 0, rows_rejected: 0, completed_at: '2026-09-29 08:42:18',
      run: { steps: [
        step('Normalize upload 12', 'Done', '2026-09-29 08:40:08', 19, { total: 34, loaded: 34, updated: 0, skipped: 0, rejected: 0 }),
        step('Run deduplication and suppression', 'Done', '2026-09-29 08:40:28', 31, { processed: 34, suppressed_maintenance: 2, suppressed_dedup: 4, suppressed_debounce: 14, survived: 14 }),
        step('Run correlation', 'Done', '2026-09-29 08:41:00', 64, { incidents_created: 7, alarms_linked: 14, by_rule: 2, by_reasoning: 5 }),
        step('Run ticketing', 'Done', '2026-09-29 08:42:05', 13, { tickets_created: 7, auto_approved: 6, waiting_for_analyst: 1 })] } }
  ];

  // ---- alarm_raw ----
  const raw = []; let rawId = 5001;
  [
    { Severity: 'Average', Time: '31/08/2026 23:14', 'Recovery time': '31/08/2026 23:20', Status: 'RESOLVED', Host: 'BHS-EMR-MPLS01', Problem: CPU, Duration: '6m', Ack: 'No', Actions: '', Tags: 'alerttype: performance, class: network, component: cpu, ip: 190.242.12.10, vendor: juniper' },
    { Severity: 'Warning', Time: '31/08/2026 23:40', 'Recovery time': '01/09/2026 00:12', Status: 'RESOLVED', Host: 'BHS-NAS-MPLS01', Problem: 'FPC 0 Temperature above 55 degrees', Duration: '32m', Ack: 'No', Actions: '', Tags: 'alerttype: environment, class: network, component: temperature, ip: 190.242.12.18, vendor: juniper' },
    { Severity: 'Average', Time: '01/09/2026 01:02', 'Recovery time': '01/09/2026 01:08', Status: 'RESOLVED', Host: 'ANU-APUA-MPLS01', Problem: CPU, Duration: '6m', Ack: 'No', Actions: '', Tags: 'alerttype: performance, class: network, component: cpu, ip: 190.242.4.24, vendor: juniper' },
    { Severity: 'Average', Time: '01/09/2026 03:18', 'Recovery time': '01/09/2026 03:41', Status: 'RESOLVED', Host: 'BRB-GARRI-MPLS01', Problem: 'Interface ge-1/0/3: Link down', Duration: '23m', Ack: 'Yes', Actions: '', Tags: 'alerttype: availability, class: network, component: interface, interface: ge-1/0/3, ip: 190.242.20.5, vendor: juniper' },
    { Severity: 'Average', Time: '01/09/2026 06:55', 'Recovery time': '01/09/2026 07:01', Status: 'RESOLVED', Host: 'ANU-APUA01-MPLS02', Problem: CPU, Duration: '6m', Ack: 'No', Actions: '', Tags: 'alerttype: performance, class: network, component: cpu, ip: 190.242.4.26, vendor: juniper' }
  ].forEach((d, i) => raw.push({ raw_id: rawId++, upload_id: 10, row_number: i + 1, raw_data: d, load_outcome: 'PENDING', outcome_reason: null, alarm_id: null, created_at: '2026-09-25 16:05:46' }));

  // upload 11: 2 rows, both rejected
  [
    { Severity: 'Average', Time: '2026-09-07 04:12:44 AM', 'Recovery time': '2026-09-07 04:31:02 AM', Status: 'RESOLVED', Host: '', Problem: 'Interface xe-0/0/2: Link down', Duration: '18m 18s', Ack: 'No', Actions: '', Tags: 'alerttype: availability, class: network, component: interface, vendor: juniper', _r: 'Rejected: required value Host is empty' },
    { Severity: 'Information', Time: '2026-09-08 11:20:05 AM', 'Recovery time': '2026-09-08 11:20:35 AM', Status: 'RESOLVED', Host: 'BRB-GARRI-MPLS01', Problem: 'Configuration committed by user netops', Duration: '30s', Ack: 'No', Actions: '', Tags: 'alerttype: config, class: network, component: system, ip: 190.242.20.5, vendor: juniper', _r: "Rejected: severity 'Information' is not in the severity mapping" }
  ].forEach((d, i) => { const reason = d._r; delete d._r; raw.push({ raw_id: rawId++, upload_id: 11, row_number: i + 1, raw_data: d, load_outcome: 'PROCESSED', outcome_reason: reason, alarm_id: null, created_at: '2026-09-26 10:12:33', _outcome: 'REJECTED' }); });
  // upload 12: 34 rows, all loaded as new alarms
  alarms.forEach((a, i) => raw.push({ raw_id: rawId++, upload_id: 12, row_number: i + 1, raw_data: rawOf(a), load_outcome: 'PROCESSED', outcome_reason: 'Loaded as new alarm', alarm_id: a.alarm_id, created_at: '2026-09-29 08:40:09', _outcome: 'LOADED' }));

  // ---- correlation_rule ----
  const rules = [
    { rule_id: 1, rule_code: 'TEMP_STORM', rule_name: 'Temperature storm', condition_text: '3 or more temperature alarms on the same host within the correlation window', action_text: 'Group into one incident; lead is the earliest alarm with the highest severity', rule_source: 'NOC_TEAM', is_active: true, created_at: '2026-07-20 10:00:00', updated_at: '2026-08-14 16:22:00' },
    { rule_id: 2, rule_code: 'INTERFACE_STORM', rule_name: 'Interface storm', condition_text: '2 or more interface link down alarms on the same host within the correlation window', action_text: 'Group into one incident; physical interface is lead, aggregated (ae) interfaces are symptoms', rule_source: 'NOC_TEAM', is_active: true, created_at: '2026-07-20 10:00:00', updated_at: '2026-07-20 10:00:00' },
    { rule_id: 3, rule_code: 'INTERFACE_ICMP', rule_name: 'Interface with ICMP loss', condition_text: 'Interface link down and ICMP unreachable on the same host within the correlation window', action_text: 'Group into one incident; interface alarm is lead, ICMP alarm is a symptom', rule_source: 'NOC_TEAM', is_active: true, created_at: '2026-07-20 10:00:00', updated_at: '2026-07-20 10:00:00' }
  ];

  // ---- incident / incident_alarm / ticket ----
  const INC = [
    [1, 'INC-0001', 'BHS-EMR-MPLS01', 'LLM_REASONING', null, [[100204, 'LEAD']], 'Average', 'S3', '2026-09-29 08:41:02', 'One surviving alarm on BHS-EMR-MPLS01 in the 30 minute window: Interface ge-1/0/0 link down for 10.42 min (10m 25s). This is above the 10 min debounce window, so it is a real outage rather than a flap. No other alarms on this host in the window. No rule matched; opened as a single-alarm incident with the alarm as lead.', 'TCK-000101', 'BHS-EMR-MPLS01: Interface ge-1/0/0 link down for 10m 25s'],
    [2, 'INC-0002', 'BRB-GARRI-MPLS01', 'LLM_REASONING', null, [[100205, 'LEAD']], 'Average', 'S3', '2026-09-29 08:41:06', 'One surviving alarm on BRB-GARRI-MPLS01 in the 30 minute window: Interface ge-1/0/3 link down for 20.15 min on 2026-09-09. A second identical alarm one minute later (100206) was suppressed as a duplicate. The interface carries customer circuit BRB-ENT-0912. No rule matched; opened as a single-alarm incident.', 'TCK-000102', 'BRB-GARRI-MPLS01: Interface ge-1/0/3 link down for 20m 9s (customer circuit BRB-ENT-0912)'],
    [3, 'INC-0003', 'BRB-GARRI-MPLS01', 'LLM_REASONING', null, [[100211, 'LEAD']], 'Average', 'S3', '2026-09-29 08:41:11', 'One surviving alarm on BRB-GARRI-MPLS01 in the 30 minute window: Interface ge-1/0/3 link down for 20.33 min on 2026-09-11. Same interface failed on 2026-09-09 (INC-0002); the earlier incident is closed, so this is treated as a new occurrence. Duplicate 100212 was suppressed. No rule matched.', 'TCK-000103', 'BRB-GARRI-MPLS01: Interface ge-1/0/3 link down for 20m 20s, repeat of 2026-09-09'],
    [4, 'INC-0004', 'BHS-NAS-MPLS01', 'LLM_REASONING', null, [[100216, 'LEAD']], 'Warning', 'S4', '2026-09-29 08:41:16', 'One surviving alarm on BHS-NAS-MPLS01 in the 30 minute window: AFEB Exhaust A temperature above 55 degrees for 42.5 min. Only one sensor reported, so TEMP_STORM (3 or more temperature alarms) does not apply. Duplicate 100217 was suppressed. Opened as a single-alarm incident.', 'TCK-000104', 'BHS-NAS-MPLS01: AFEB Exhaust A temperature above 55 degrees for 42m 30s'],
    [5, 'INC-0005', 'ANU-APUA01-MPLS02', 'RULE', 2, [[100219, 'LEAD'], [100220, 'SYMPTOM']], 'Average', 'S3', '2026-09-29 08:41:22', 'Rule INTERFACE_STORM matched: 2 interface link down alarms on ANU-APUA01-MPLS02 within 23 seconds. et-0/0/0 is the physical 100G uplink and went down first, so it is the lead. ae0 is the LAG that contains et-0/0/0 and dropped as a consequence, so it is a symptom.', 'TCK-000105', 'ANU-APUA01-MPLS02: interface storm, et-0/0/0 and ae0 link down for about 30 min'],
    [6, 'INC-0006', 'BHS-EMR-MPLS01', 'RULE', 1, [[100223, 'LEAD'], [100224, 'MEMBER'], [100225, 'MEMBER'], [100226, 'MEMBER'], [100227, 'MEMBER'], [100228, 'MEMBER'], [100229, 'MEMBER']], 'Warning', 'S4', '2026-09-29 08:41:30', 'Rule TEMP_STORM matched: 7 temperature alarms on BHS-EMR-MPLS01 between 09:02 AM and 09:11 AM on 2026-09-14, all Warning. Sensors span FPC 0, FPC 1, PEM 0, PEM 1, Routing Engine 0, AFEB exhaust and fan tray inlet, which points to a site cooling issue rather than a single component. FPC 0 reported first and is the lead.', 'TCK-000106', 'BHS-EMR-MPLS01: temperature storm, 7 alarms across FPC, PEM, RE and fan tray sensors'],
    [7, 'INC-0007', 'ANU-APUA-MPLS01', 'LLM_REASONING', null, [[100233, 'LEAD']], 'High', 'S2', '2026-09-29 08:41:40', 'One surviving alarm on ANU-APUA-MPLS01 in the 30 minute window: Routing Engine 0 temperature above 60 degrees (critical). The alarm is still active, so its duration is unknown. A duplicate one minute later (100234) was suppressed. Only one temperature sensor, so TEMP_STORM does not apply. Opened as a single-alarm incident.', 'TCK-000107', 'ANU-APUA-MPLS01: Routing Engine 0 temperature above 60 degrees (critical), still active']
  ];
  const incidents = [], incidentAlarms = [], tickets = [];
  INC.forEach(([id, code, host, basis, ruleId, members, hi, ts, created, reasoning, tnum, summary]) => {
    incidents.push({ incident_id: id, incident_code: code, host, grouping_basis: basis, rule_id: ruleId, time_window_minutes: 30, llm_reasoning: reasoning, highest_severity: hi, ticket_severity: ts, created_at: created, updated_at: created });
    members.forEach(([aid, role]) => incidentAlarms.push({ incident_id: id, alarm_id: aid, alarm_role: role }));
    const lead = byId[members[0][0]];
    const pending = ts === 'S1' || ts === 'S2';
    tickets.push({ ticket_id: 900 + id, ticket_number: tnum, external_ticket_ref: null, incident_id: id, host, severity: ts, summary, component: lead.component, alert_type: lead.alert_type, alarm_count: members.length, start_time: lead.alarm_time, ticket_status: pending ? 'NEW' : 'OPEN', approval_required: pending, approval_status: pending ? 'PENDING' : 'APPROVED', decided_by: pending ? null : 'auto:severity_mapping', decided_at: pending ? null : created, created_at: created });
  });

  // ---- audit_event ----
  const audit = []; let auditId = 70001;
  const ev = (time, stage, outcome, reason, actor, refs, details) => audit.push({ audit_id: auditId++, event_time: time, stage, outcome, reason, actor, upload_id: refs.upload || null, alarm_id: refs.alarm || null, incident_id: refs.incident || null, ticket_id: refs.ticket || null, details: details || null });

  ev('2026-09-25 16:05:58', 'NORMALIZATION', 'REJECTED', "Normalization failed: column 'Time' value '31/08/2026 23:14' at row 1 does not match the expected format", 'agent:normalization', { upload: 10 }, { rows_total: 5, rows_loaded: 0, error: 'time_format_mismatch', row_number: 1, column: 'Time', value: '31/08/2026 23:14' });

  [11, 12].forEach(up => {
    const t0 = UPLOAD_AT[up];
    raw.filter(r => r.upload_id === up).forEach((r, i) => {
      ev(addSec(t0, 3 + i), 'NORMALIZATION', r._outcome, r.outcome_reason, 'agent:normalization', { upload: up, alarm: r.alarm_id }, { raw_id: r.raw_id, row_number: r.row_number });
    });
    alarms.filter(a => a.source_upload_id === up).forEach((a, i) => {
      const map = { SUPPRESSED_MAINTENANCE: 'MAINTENANCE', SUPPRESSED_DEDUP: 'DEDUP', SUPPRESSED_DEBOUNCE: 'DEBOUNCE' };
      const stage = map[a.pipeline_status] || 'DEBOUNCE';
      const outcome = a.pipeline_status === 'CORRELATED' ? 'SURVIVED' : a.pipeline_status;
      ev(addSec(t0, 50 + i), stage, outcome, a.suppression_reason || 'Passed maintenance, duplicate and debounce checks', 'agent:dedup', { upload: up, alarm: a.alarm_id }, { duration_minutes: a.duration_minutes, survivor_alarm_id: a.survivor_alarm_id, debounce_window_minutes: 10 });
    });
  });
  incidents.forEach(inc => {
    const up = 12;
    const rule = rules.find(r => r.rule_id === inc.rule_id);
    incidentAlarms.filter(x => x.incident_id === inc.incident_id).forEach((x, i) => {
      ev(addSec(inc.created_at, i), 'CORRELATION', 'GROUPED', `Linked to ${inc.incident_code} as ${x.alarm_role}` + (rule ? ` by rule ${rule.rule_code}` : ' by agent reasoning'), 'agent:correlation', { upload: up, alarm: x.alarm_id, incident: inc.incident_id }, { grouping_basis: inc.grouping_basis, rule_code: rule ? rule.rule_code : null, alarm_role: x.alarm_role, time_window_minutes: 30 });
    });
    const t = tickets.find(t => t.incident_id === inc.incident_id);
    ev(addSec(inc.created_at, 12), 'TICKETING', 'TICKET_CREATED', `Ticket ${t.ticket_number} created with severity ${t.severity} from severity mapping (${inc.highest_severity} → ${t.severity})`, 'agent:ticketing', { upload: up, incident: inc.incident_id, ticket: t.ticket_id }, { severity: t.severity, approval_required: t.approval_required, alarm_count: t.alarm_count });
    if (!t.approval_required) ev(addSec(inc.created_at, 13), 'TICKETING', 'APPROVED', `Approved automatically: severity mapping says ${t.severity} does not need analyst approval`, 'agent:ticketing', { upload: up, incident: inc.incident_id, ticket: t.ticket_id }, { decided_by: 'auto:severity_mapping', approval_status: 'APPROVED' });
  });
  raw.forEach(r => delete r._outcome);

  window.LLA_MOCK = {
    analyst: 'Analyst Name',
    uploads, raw, alarms, incidents, incidentAlarms, tickets,
    audit: audit.sort((a, b) => a.event_time < b.event_time ? -1 : 1),
    maintenance: [
      { window_id: 1, host: 'BRB-GARRI-MPLS01', start_time: '2026-08-28 00:00:00', end_time: '2026-08-28 03:00:00', description: 'Line card replacement FPC 1 (CHG-48530)', created_at: '2026-08-25 14:10:00' },
      { window_id: 2, host: 'BHS-NAS-MPLS01', start_time: '2026-09-12 01:00:00', end_time: '2026-09-12 03:00:00', description: 'Core uplink fibre splice (CHG-48812)', created_at: '2026-09-09 11:32:00' },
      { window_id: 3, host: 'ANU-APUA-MPLS01', start_time: '2026-10-08 00:00:00', end_time: '2026-10-08 04:00:00', description: 'Junos upgrade to 23.4R2 (CHG-49007)', created_at: '2026-09-28 16:45:00' }
    ],
    severity: [
      { severity_name: 'High', severity_rank: 2, ticket_severity: 'S2', approval_required: true },
      { severity_name: 'Average', severity_rank: 3, ticket_severity: 'S3', approval_required: false },
      { severity_name: 'Warning', severity_rank: 4, ticket_severity: 'S4', approval_required: false }
    ],
    rules,
    config: [
      { config_key: 'debounce_window_minutes', config_value: '10', description: 'Resolved alarms shorter than this are suppressed by the debounce check (Agent 2)', updated_at: '2026-07-20 10:00:00' },
      { config_key: 'correlation_window_minutes', config_value: '30', description: 'Surviving alarms on the same host within this window are considered for one incident (Agent 3)', updated_at: '2026-07-20 10:00:00' }
    ]
  };
})();
