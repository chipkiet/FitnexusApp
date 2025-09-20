// import React, { useState } from "react";
// import { motion } from "framer-motion";

// export default function LoginForm({ onSubmit }) {
//   const [form, setForm] = useState({ username: "", password: "", remember: false });
//   const [showPass, setShowPass] = useState(false);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const payload = { ...form };
//     if (onSubmit) onSubmit(payload);
//     else alert("POST /login\n" + JSON.stringify(payload, null, 2));
//   };

//   const container = {
//     hidden: { opacity: 0, y: 8 },
//     show: {
//       opacity: 1,
//       y: 0,
//       transition: { staggerChildren: 0.08, ease: [0.2, 0.65, 0.2, 1], duration: 0.5 },
//     },
//   };

//   const item = {
//     hidden: { opacity: 0, y: 10 },
//     show: { opacity: 1, y: 0, transition: { ease: [0.2, 0.65, 0.2, 1], duration: 0.5 } },
//   };

//   return (
//     <div className="min-h-screen w-full grid place-items-center bg-[radial-gradient(900px_520px_at_15%_10%,#734dff33_0,transparent_60%),radial-gradient(780px_460px_at_85%_20%,#00e0ff33_0,transparent_60%),linear-gradient(160deg,#0e0f1e,#1a1440)] text-white">
//       <motion.form
//         variants={container}
//         initial="hidden"
//         animate="show"
//         onSubmit={handleSubmit}
//         className="w-[min(420px,92vw)] relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-7 shadow-2xl backdrop-blur-xl"
//       >
//         {/* glossy sweep */}
//         <div className="pointer-events-none absolute inset-0 rounded-2xl">
//           <div className="absolute inset-0 rounded-2xl [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude] p-px" style={{ background: "linear-gradient(120deg,#ffffff1a,#ffffff00_30%,#ffffff00_70%,#ffffff1a)" }} />
//         </div>

//         <motion.h1 variants={item} className="mb-1 text-[clamp(20px,3.2vw,26px)] font-semibold tracking-wide">
//           Welcome back
//         </motion.h1>
//         <motion.p variants={item} className="mb-5 text-sm text-white/70">
//           Đăng nhập để tiếp tục
//         </motion.p>

//         {/* Username */}
//         <motion.div variants={item} className="relative mb-4">
//           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-indigo-100/70">
//             {/* user icon */}
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"/></svg>
//           </span>
//           <input
//             id="username"
//             type="text"
//             required
//             placeholder=" "
//             value={form.username}
//             onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
//             className="w-full rounded-xl border border-white/15 bg-white/10 py-6 pl-11 pr-3 text-white outline-none transition-[box-shadow,transform,border-color] duration-200 focus:-translate-y-0.5 focus:border-white/40 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.09),0_8px_30px_rgba(0,0,0,0.35)]"
//           />
//           <label htmlFor="username" className="pointer-events-none absolute left-11 top-3 select-none text-sm font-semibold text-white/70 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-white/70 peer-focus:-translate-y-1.5 peer-focus:text-xs">
//             Username
//           </label>
//         </motion.div>

//         {/* Password */}
//         <motion.div variants={item} className="relative mb-2">
//           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-indigo-100/70">
//             {/* lock icon */}
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17 9V7a5 5 0 10-10 0v2H5v12h14V9h-2zm-8 0V7a3 3 0 016 0v2H9zm3 5a2 2 0 110-4 2 2 0 010 4z"/></svg>
//           </span>
//           <input
//             id="password"
//             type={showPass ? "text" : "password"}
//             required
//             placeholder=" "
//             value={form.password}
//             onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
//             className="w-full rounded-xl border border-white/15 bg-white/10 py-6 pl-11 pr-11 text-white outline-none transition-[box-shadow,transform,border-color] duration-200 focus:-translate-y-0.5 focus:border-white/40 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.09),0_8px_30px_rgba(0,0,0,0.35)]"
//           />
//           <label htmlFor="password" className="pointer-events-none absolute left-11 top-3 select-none text-sm font-semibold text-white/70 transition-all">
//             Password
//           </label>
//           <button type="button" onClick={() => setShowPass((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-white/70 hover:bg-white/10">
//             {showPass ? (
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 110-10 5 5 0 010 10z"/></svg>
//             ) : (
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5c-2.01 0-3.82.62-5.38 1.67L4.41 4.46 3 5.87l3.05 3.05C4.12 10.23 2.55 12 2 12c0 0 3 7 10 7 1.91 0 3.64-.45 5.18-1.21L18.13 19l1.41-1.41-1.73-1.73C19.73 14.45 22 12 22 12s-3-7-10-7z"/></svg>
//             )}
//           </button>
//         </motion.div>

//         <motion.div variants={item} className="mb-4 flex items-center justify-between text-sm text-white/70">
//           <label className="inline-flex items-center gap-2 select-none">
//             <input
//               type="checkbox"
//               checked={form.remember}
//               onChange={(e) => setForm((p) => ({ ...p, remember: e.target.checked }))}
//               className="h-4 w-4 rounded border-white/20 bg-white/10"
//             />
//             Nhớ tôi
//           </label>
//           <a href="#" className="text-indigo-200 hover:underline">
//             Quên mật khẩu?
//           </a>
//         </motion.div>

//         <motion.button variants={item} type="submit" className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-4 py-3 font-extrabold text-white shadow-[0_10px_24px_rgba(0,224,255,0.27)] transition hover:brightness-105 active:translate-y-[1px]">
//           Đăng nhập
//         </motion.button>

//         <motion.p variants={item} className="mt-3 text-center text-sm text-white/70">
//           Chưa có tài khoản? <a href="#" className="text-indigo-200 hover:underline">Đăng ký ngay</a>
//         </motion.p>
//       </motion.form>
//     </div>
//   );
// }
