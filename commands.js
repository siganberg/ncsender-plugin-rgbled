/**
 * RGB LED wireless accessory — customization shell.
 *
 * Machine state (idle/jogging/homing/running/...) AND job-complete are
 * delivered to the strip by the dongle's DRO broadcast. The strip firmware
 * (>= v0.7.4) parses "$<status>|…|D:<jobStatus>|…" directly and owns the
 * running->completed edge that triggers the celebration animation.
 *
 * This plugin exists as the surface for optional user customization
 * (activation, per-state colour overrides, brightness, effects). The runtime
 * side is intentionally empty — the strip is functional whether the plugin
 * is installed or not.
 */

const DEVICE = 'rgbled';

// buildInitialConfig is required by the host loader (it's how sanitised
// settings are seeded into the engine). Nothing to sanitise yet — future
// per-state colour overrides and other customization will live here.
function buildInitialConfig(raw) { return raw || {}; }

pluginContext.log('RGB LED plugin loaded — customization surface only, no runtime pump');
