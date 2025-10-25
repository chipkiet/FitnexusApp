import { http, HttpResponse } from 'msw';

const API = (p) => `http://localhost:3001${p}`;

const ok = (data = {}) => HttpResponse.json({ success: true, data });
const fail = (status = 400, data = {}) => HttpResponse.json({ success: false, ...data }, { status });

const makeJwt = (payload) => {
  const base64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  return `${base64({ alg: 'none', typ: 'JWT' })}.${base64(payload)}.`;
};

export const handlers = [
  // OAuth/session profile
  http.get(API('/auth/me'), ({ request }) => fail(401, { message: 'Not logged in' })),

  // JWT profile
  http.get(API('/api/auth/me'), () => fail(401, { message: 'Unauthenticated' })),

  // Login default: success for any credentials except identifier === 'locked'
  http.post(API('/api/auth/login'), async ({ request }) => {
    const body = await request.json().catch(() => ({}));
    if (body?.identifier === 'locked') {
      return fail(423, { message: 'Account locked', data: { lockReason: 'Too many attempts', lockedAt: new Date().toISOString() } });
    }
    const user = { id: 1, username: body?.identifier || 'john', role: 'USER' };
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const token = makeJwt({ sub: String(user.id), role: user.role, exp });
    const refreshToken = makeJwt({ sub: String(user.id), type: 'refresh', exp: exp + 3600 });
    return ok({ user, token, refreshToken });
  }),

  http.post(API('/api/auth/register'), async ({ request }) => {
    const body = await request.json().catch(() => ({}));
    const user = { id: 10, username: body?.username || 'newuser', role: 'USER' };
    return HttpResponse.json({ success: true, data: { user, token: 't', refreshToken: 'r' }, message: 'Registered' });
  }),

  http.post(API('/api/auth/refresh'), () => {
    const exp = Math.floor(Date.now() / 1000) + 3600;
    return ok({ token: makeJwt({ sub: 'u1', role: 'USER', exp }), refreshToken: makeJwt({ sub: 'u1', type: 'refresh', exp: exp + 3600 }) });
  }),

  // Onboarding session defaults to completed
  http.get(API('/api/onboarding/session'), () => ok({ required: false, completed: true })),

  // Onboarding answer -> mark completed
  http.post(API('/api/onboarding/steps/:key/answer'), async ({ params }) => {
    const key = params.key;
    // After answering last step, mark completed
    return ok({ stepKey: key, completed: true });
  }),

  // Plans - list mine
  http.get(API('/api/plans'), ({ request }) => ok({ items: [] })),

  // Create plan
  http.post(API('/api/plans'), async ({ request }) => ok({ plan_id: 101, name: 'My Plan' })),

  // Add exercise to plan
  http.post(API('/api/plans/:id/exercises'), async () => ok({})),

  // Generic protected endpoint to test interceptors
  http.get(API('/api/protected'), () => fail(423, { message: 'Locked' })),

  // Assets used by NutritionAI (minimal stubs)
  http.get('/model/labels.json', () => HttpResponse.json(['rice', 'noodle', 'beef'])),
  http.get('/tables/calorie_table.json', () => HttpResponse.json({ rice: 130, noodle: 150, beef: 250 })),
  http.get('/tables/portion_defaults.json', () => HttpResponse.json({ default_portions: { rice: { small: 100 } } })),
  http.get('/tables/macros_table.json', () => HttpResponse.json({ rice: { protein_g: 2, carbs_g: 28, fat_g: 0 }, beef: { protein_g: 26, fat_g: 15, carbs_g: 0 } })),
  http.get('/model/classifier/model.json', () => HttpResponse.json({ modelTopology: {}, weightsManifest: [] })),
  // Try various mobilenet locations — return 404 to force default in component (we mock mobilenet anyway)
  http.get('/model/mobilenet_v2_1.0_224/model.json', () => fail(404, {})),
];
