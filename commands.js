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

// buildInitialConfig is required by the host loader (it's how sanitised
// settings are seeded into the engine). Nothing to sanitise yet — future
// per-state colour overrides and other customization will live here.
//
// Nothing else runs at load time. An earlier v0.1.1 called
// pluginContext.log(...) here as a heartbeat, but on AOT builds that
// invocation reliably SIGABRTed the .NET runtime during Jint's
// engine.Execute(), taking the whole ncSender server down in a systemd
// restart loop. The runtime harden pass in ncSender/Pro isolates plugin
// load failures now, but the safer contract is: don't run anything at
// module scope. Everything the plugin needs will hang off explicit event
// handlers or the config UI.
function buildInitialConfig(raw) { return raw || {}; }
