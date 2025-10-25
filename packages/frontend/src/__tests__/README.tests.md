Frontend tests overview

- Runner: Vitest (jsdom)
- Utilities: React Testing Library, User Event
- API mocking: MSW (Node server)

Test Coverage

- Validation libs: email, password, username, phone, full name
- Token manager: set/get/clear, expiration parsing
- Axios interceptors: Authorization header, 423 redirect, pass-through behavior
- Routing: PrivateRoute onboarding redirect, unauthenticated redirect to /login
- Auth Pages: Login (success, locked account, admin redirect), Register (success flow)
- Onboarding: Age step flow (submit and complete)
- Landing: CTA navigation for guest vs logged-in + pending onboarding
- PlanPicker: list + select plan + add exercise
- NutritionAI: page initializes and enables upload when models ready (TFJS/mobilenet mocked)

How to run

1) From repo root: `npm install`
2) Go to frontend: `cd packages/frontend`
3) Run once: `npm run test`
   - Or watch: `npm run test:watch`

