Principles:
- Make API/libs independent of signals.
- Use wrappers to add signals features
    - write: set properties from signal.
    - read: .hooks = createEventHooks(...)