Principles:
- Make API/libs independent of signals.
    - read : .hooks = createEventHooks(...)
    - write: normal setters, then wrap it.