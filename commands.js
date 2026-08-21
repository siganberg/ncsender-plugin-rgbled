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
  // Skip when the accessory isn't paired at all — no point framing lines the
  // dongle will drop. Cheap enough to check every tick.
  if (!isDeviceReachable()) return;

  const s = pluginContext.getServerState();
  let status = s && s.senderStatus;
  if (!status) return;

  // Job completion isn't expressible in senderStatus: a finished job just
  // returns to idle. Fire once on the running -> completed edge; the device
  // latches complete and the idle keepalives that follow won't clear it.
  const job = s.jobStatus == null ? null : String(s.jobStatus);
  if (job !== lastJobStatus) {
    if (job && job.toLowerCase() === 'completed') status = 'complete';
    lastJobStatus = job;
  }

  const t = now();
  const changed = status !== lastSent;
  if (!changed && (t - lastSentAt) < KEEPALIVE_MS) return;

  pluginContext.dongle.send(DEVICE, 'state ' + status);
  lastSent = status;
  lastSentAt = t;
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
