# RedFlag AI Privacy Options

This file explains the privacy choices in simple words.

## Two privacy modes

### Individual mode
Use this when you want the most private setup.

What it means:
- your scans are treated as personal
- the system should keep as little as possible
- content should be deleted quickly unless you choose to save it
- nothing should be shared to help other users by default

Best for:
- private family issues
- banking or identity threats
- sensitive screenshots or transcripts

### Community mode
Use this when you want to help protect others too.

What it means:
- the system can keep anonymous scam patterns
- it should avoid storing raw private content when possible
- it can use pattern fingerprints, labels, and non-personal signals to detect similar scams faster

Best for:
- helping flag new scam templates
- improving warnings for other users
- building shared threat intelligence

## Memory
Memory should be optional.

Good memory behavior:
- remember repeated scam patterns for the same user
- remember trusted contacts or trusted senders
- remember that a user keeps seeing the same attack shape
- let the user delete memory any time

Bad memory behavior:
- keeping everything forever
- storing raw personal messages by default
- making it unclear what is remembered

## Good privacy defaults
- private mode first
- short retention by default
- clear delete controls
- clear explanation of what was processed
- redact sensitive details before cloud analysis when possible
- do not sell personal scam data

## Wearables privacy
Wearables make privacy harder, not easier.

Why:
- they are used in public
- they may see bystanders, screens, and private spaces
- voice and camera data can be more sensitive than phone text input

A good wearable version should:
- do tiny alerts on-device
- send deeper reasoning to phone
- use local processing when possible
- avoid keeping raw audio or video by default
- make camera and microphone status obvious
- require clear opt-in for cloud features

## What should happen in a public demo
For a public demo, the safest setup is:
- demo mode on
- live model calls off unless intentionally enabled
- sample scenarios only for the public link

## Simple principle
RedFlag AI should help users decide what not to trust without becoming another system that quietly collects too much about them.
