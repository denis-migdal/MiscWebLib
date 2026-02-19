Event is required as we *need* a way to notify.

Its features should be :
- addListener/removeListener
- trigger/flush

We use queueMicrotask() to protect against multiple triggers.
Not sure if there might be unintended consequences.


Usage :
- internal : override onXXX functions.
- input : use normal setters, might use beforeUpdate to set value.
- output: listen to events.