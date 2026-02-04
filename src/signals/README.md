Principles:
- for public/protected members, use inline functions to perform private operations.
- Make API/libs independent of signals.
    - read : .hooks = createHooks(...)
    - write: normal setters, then wrap it.