# LU 3.14 — Repository Pattern

This implementation separates business logic from in-memory storage.

## Layout

- `repositories/`: private Map-backed storage, id generation, and the stable repository contract.
- `services/`: business rules and workflow orchestration; no service imports a raw store.

## Repository contract

Each repository exposes `findAll()`, `findById(id)`, `create(fields)`, `update(id, patch)`, and `remove(id)`.

- `findAll` returns a new array with copied records.
- `findById` returns a copied record or `null`.
- `create` returns the created record, including its generated id.
- `update` returns the updated record or `null`.
- `remove` returns a boolean.

The post repository is Map-backed to demonstrate the storage-swap requirement. The services use only repository methods, so changing the internal Map to an array or a Prisma client does not change their interface. The vote and user repositories include one domain-shaped lookup each to support the existing business rules without exposing storage details.
