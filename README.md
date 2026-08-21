# ncSender RGB LED Plugin (Beta)

> **IMPORTANT DISCLAIMER:** This plugin is part of my personal ncSender project. If you choose to use it, you do so entirely at your own risk. I am not responsible for any damage, malfunction, or personal injury that may result from the use or misuse of this plugin. Use it with caution and at your own discretion.

Drives the ncSender wireless RGB LED accessory. Pushes the app's derived machine status to the LED controller so the strip mirrors what the header card is showing — green while a job is running, red on alarm, teal while probing, a small fireworks burst when a job finishes, etc.

## Features

- **Machine status → LED strip** — sends `state <name>` on change, plus a 2-second keepalive so the device knows the host is alive
- **Job-complete edge** — fires the device's latched "complete" animation on the `running → completed` edge (returning to `idle` afterward does not clear it)
- **Live status view** — connection state, current machine state, what the strip is showing, firmware version
- **Brightness control** — master 1–255 slider, persisted on the device
- **Identify** — flashes the strip 6× to identify which controller you're looking at

## Requirements

- ncSender **≥ 0.3.111** (community) or **≥ 2.0.0** (pro v2)
- ncSender wireless dongle (paired)
- ncsender.rgb controller flashed with firmware v0.7.3 or newer

## How the colors work

Colors, effects and timings live in the RGB controller's firmware, not in this plugin. The plugin only sends state *names* — the device decides how each one looks. See `PROTOCOL.md` in the [ncsender.rgb](https://github.com/siganberg/ncsender.rgb) firmware repo for the full state → color mapping.

## License

GPL-3.0 — see [LICENSE-GPL-3.0](./LICENSE-GPL-3.0).
