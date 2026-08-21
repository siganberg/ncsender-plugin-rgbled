## Initial beta release

First public build of the RGB LED plugin. Drives the wireless RGB LED accessory strip and mirrors machine status on the LEDs.

### ✨ Features

- Pushes derived machine status (`idle` / `running` / `alarm` / `probing` / `homing` / …) to the strip on change plus a 2 s keepalive
- Fires the device's latched job-complete animation on the `running → completed` edge
- Config UI with connection status card, live state readout, brightness slider (1–255), and an Identify button
- Sidebar tab layout: Status / Colors / Firmware (Colors and Firmware tabs are placeholders — coming in later builds)

### Requirements

- ncSender ≥ 0.3.111 (community) or ≥ 2.0.0 (pro v2), with the plugin API updates that expose `pluginContext.getServerState()` and `pluginContext.setInterval()`
- ncSender wireless dongle, paired
- ncsender.rgb controller firmware v0.7.3 or newer
