/**
 * RGB LED wireless accessory — status pusher.
 *
 * The device firmware owns colours, effects and timings; core sends a state
 * name only. Contract lives in ncsender.rgb/firmware/PROTOCOL.md.
 *
 * Runs entirely on ctx.setInterval + ctx.getServerState + ctx.dongle — no
 * changes to core needed beyond those three primitives.
 */

const DEVICE = 'rgbled';
// Device treats 8s of host silence as "host gone" and drops back to its
// resting look. Stay well inside that window.
const KEEPALIVE_MS = 2000;
// How often we look at state. Fine-grained enough that the strip changes as
// soon as the header does; a 250ms lag is imperceptible on a big glowing LED.
const TICK_MS = 250;

let lastSent = null;
let lastSentAt = 0;
let lastJobStatus = null;

// Fake clock: pluginContext runs inside Jint where Date.now() is available,
// but keep it centralised so a mock/test double is a one-liner.
function now() { return Date.now(); }

function isDeviceReachable() {
  const devices = (pluginContext.dongle && pluginContext.dongle.getDevices()) || [];
  for (let i = 0; i < devices.length; i++) {
    if (devices[i] && devices[i].name === DEVICE) return true;
  }
  return false;
}

function pump() {
  // Machine state is delivered to the strip by the dongle's DRO broadcast
  // (dongle firmware >= dro-broadcast build) — the firmware parses the
  // `$<status>|…` frames directly. Pushing `state <name>` from here on top
  // of that produced flip-flops on jog release: broadcast said $idle, our
  // tagged unicast said `state jogging` (from a still-fresh lastSent), and
  // both landed on the same s_state in the device. So this pump no longer
  // repeats DRO information.
  //
  // The one thing DRO can't express is "the job just finished cleanly":
  // senderStatus goes straight back to idle after a completion, which looks
  // identical to a machine sitting quiet. Watch jobStatus for the
  // running -> completed edge and fire `state complete` once; the device
  // latches it, and the DRO `$idle` frames that follow don't clear it.
  if (!isDeviceReachable()) return;

  const s = pluginContext.getServerState();
  const job = s && s.jobStatus != null ? String(s.jobStatus) : null;
  if (job === lastJobStatus) return;

  lastJobStatus = job;

  // Fire on ANY transition INTO completed (not just running -> completed).
  // A stricter check missed cases where the plugin loaded mid-job or where
  // the tick straddled the boundary and never observed 'running' first.
  // `stopped`/`error`/`null` fall through and the strip stays with whatever
  // DRO is reporting.
  if (job && job.toLowerCase() === 'completed') {
    // Burst three to survive an occasional dropped packet — one-shot only,
    // no keepalive follows.
    pluginContext.dongle.send(DEVICE, 'state complete');
    pluginContext.dongle.send(DEVICE, 'state complete');
    pluginContext.dongle.send(DEVICE, 'state complete');
    lastSent = 'complete';
    lastSentAt = now();
  }
}

pluginContext.log('RGB LED plugin loaded — pumping status to @' + DEVICE);

// Force a resend of the current status. Config UI calls it via a manual send
// path when the user just paired or rebooted the strip — no waiting up to
// the keepalive interval for the strip to sync.
function resetPushCache() { lastSent = null; lastSentAt = 0; }

pluginContext.setInterval(pump, TICK_MS);

// buildInitialConfig is required by the host loader (it's how sanitised
// settings are seeded into the engine). Nothing to sanitise yet.
function buildInitialConfig(raw) { return raw || {}; }
