// routes/auth.js
import express from "express";
import passport from "passport";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  (req, res) => {
    // Cho phép postMessage/đóng popup
    res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
    res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");

    const targetOrigin = new URL(process.env.FRONTEND_URL).origin;

    res.type("html").send(`<!doctype html>
<html><head><meta charset="utf-8"/></head><body>
<script>
  (function(){
  var user = req.user ? (typeof req.user.toJSON === "function" ? req.user.toJSON() : req.user) : null;
  if (user && user.passwordHash) delete user.passwordHash;
  if (user && user.providerId) delete user.providerId;
  var payload = { source: "oauth", provider: "google", status: "success", user };
    try {
      if (window.opener && window.opener.postMessage) {
        window.opener.postMessage(payload, "${targetOrigin}");
        window.opener.postMessage(payload, "*"); // dev fallback
      }
    } catch(e) {}
    setTimeout(function(){ try{ window.close(); }catch(_){} }, 150);
  })();
</script>
Đăng nhập thành công.
</body></html>`);
  }
);

// >>> Thêm route này <<<
// Trả thông tin user từ session Passport
router.get("/me", (req, res) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  res.set("Surrogate-Control", "no-store");

  if (!req.user) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  // loại các field nhạy cảm
  const { passwordHash, providerId, ...safe } = (req.user.toJSON?.() || req.user);
  return res.json({ user: safe });
});

export default router;
