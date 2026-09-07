- w-id => id
- cfg-attr => attr
- widget.api => widget.subject
  -> resolver => subjectOf(WidgetType).
    => resolve(selector, SubjectOf(GraphWidget) ) => retourne Graph
    -> symbol spécial.
    -> + documenter (internal).
    resolve(element, xxx);
  => resolve([target], {id: X} OR id, X)
    => findElement.
    => resolveElement(elem, X).
    => pas utiliser selector.

- move internals (from ChartJS) + use setInternals() / getInternals()
  - notamment pour node (?).
- version => responsabilité du listener.
  -> qui l'utilise réellement ?
  -> several effect types (propertiesEffect) :
      -> value
      -> version
      -> always.

- debug tools (enable/disable __LOG__(id, msg)? + __START_LOG_SESSION__ / __END_LOG_SESSION__ + __LOG_FILTER_SOMEHOW__ ).

- set as default branch.

- doc + revoir interfaces/contrats
  - controller (behavior) - property (glue) - node (propagation).
  - Coordinator
    - accept InternalModel as input (besoin de détecter par le coordinator).
      => instanceOf (?) -> .properties si on veut résoudre l'ambiguité.
  - revoir reactive
    - link() vs forward() vs sync()
    - cache value
    - forward without dst.
  - Properties (et autres)
    => Property NOT Observable
    => ReactiveNode: effects: [] () => void [many possible].
      => NULL_ARRAY by default.
    => Properties NOT ReactiveObject
      => possède un ReactiveNode
    -> use interfaces (revoir structure)
    -> Propagation
      -> frontière unique, opaque, et imperméable.
      -> sync => utilise des primitives de base.

- ensure no export defaults / no import core/ ../impl.
- regarder anciens dépôts.

=====

From TP Engine:

- Expand<>/expand() in MWL

- Debug
    - __LOG__() [only in __DEBUG__ + only during __START_LOG__ / __STOP_LOG__]
        - console : beging/stop group.
        - + possibilité de filter sur ID ?
    - __SET_ID__(name) => this + [NAME]-[id] (?).
    - propagation : represent tree -> how (with SET) ?

=====

Project structure:
- dist/
- build/
  - cache/
  - scripts/
- libs/
- tests/
- src/
  - libs/ (compiled lib)
  - exports/ (source lib)
    - README.md for the documentation.
  - pages/ : (Website) artefacts
    - templates/
    - assets/
    - tests/
    - content.txt
  - routes/ (REST)
  - models/
  - widgets/ : content
  - presentation/
    - widgets/ : structure
    - capabilities/
    - styles/
    - [page specific]/
  - ports/ : APIs, e.g. REST, BDD, Browser

Subdirectories:
- index (an index to facilitate imports).
- core
- tools

=====

- importer utils des autres dépôts
  - LISS, etc.
  - download/upload
- marquer LISS comme obsolète.

- check other repos (1/25)